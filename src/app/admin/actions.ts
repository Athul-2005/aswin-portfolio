"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath, revalidateTag } from "next/cache";

export type CollectionType = "hero" | "memory" | "gallery" | "recent";
export type CategoryType = "nature" | "wedding" | "casual";

/**
 * Server auth check utility.
 * Verifies caller has valid Supabase claims.
 */
async function requireAuth() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) {
    throw new Error("Unauthorized: Please sign in to perform this action.");
  }

  return supabase;
}

/**
 * Purges Next.js caches for affected public routes & tags.
 */
function purgeCaches(collection: CollectionType) {
  try {
    revalidateTag(`photos-${collection}`, "max");
    revalidatePath("/", "page");
    if (collection === "gallery") revalidatePath("/gallery", "page");
    if (collection === "recent") revalidatePath("/recent", "page");
  } catch (err) {
    console.warn("[purgeCaches] Non-fatal cache revalidation error:", err);
  }
}

// -------------------------------------------------------------------------
// Auth Actions
// -------------------------------------------------------------------------

export async function loginAction(
  prevState: { error?: string } | null,
  formData: FormData
) {
  const email = formData.get("email")?.toString().trim();
  const password = formData.get("password")?.toString();

  if (!email || !password) {
    return { error: "Please enter both email and password." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message || "Invalid credentials." };
  }

  redirect("/admin");
}

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

// -------------------------------------------------------------------------
// Photo Management Actions (CRUD, Reorder, Replace Memory)
// -------------------------------------------------------------------------

export interface InsertPhotoInput {
  collection: CollectionType;
  category?: CategoryType | null;
  title: string;
  alt: string;
  caption?: string | null;
  storage_path: string;
  width: number;
  height: number;
  blur_data_url?: string | null;
  instagram_url?: string | null;
  taken_on?: string | null;
  sort_order?: number;
}

export async function insertPhotoAction(input: InsertPhotoInput) {
  const supabase = await requireAuth();

  // Validate required fields
  if (!input.title?.trim()) {
    return { error: "Photo title is required." };
  }
  if (!input.alt?.trim()) {
    return { error: "Alt text is required." };
  }
  if (!input.storage_path?.trim()) {
    return { error: "Storage path is missing." };
  }
  if (
    (input.collection === "memory" || input.collection === "gallery") &&
    !input.category
  ) {
    return { error: "Category is required for Memory and Gallery photos." };
  }

  // Calculate sort order if not specified
  let sortOrder = input.sort_order ?? 0;
  if (input.sort_order === undefined) {
    const { data: maxRow } = await supabase
      .from("photos")
      .select("sort_order")
      .eq("collection", input.collection)
      .order("sort_order", { ascending: false })
      .limit(1)
      .single();

    sortOrder = maxRow ? (maxRow.sort_order || 0) + 1 : 0;
  }

  const { data, error } = await supabase
    .from("photos")
    .insert({
      collection: input.collection,
      category: input.category || null,
      title: input.title.trim(),
      alt: input.alt.trim(),
      caption: input.caption?.trim() || null,
      storage_path: input.storage_path,
      width: input.width,
      height: input.height,
      blur_data_url: input.blur_data_url || null,
      instagram_url: input.instagram_url?.trim() || null,
      taken_on: input.taken_on || null,
      sort_order: sortOrder,
    })
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  purgeCaches(input.collection);
  return { success: true, photo: data };
}

export interface UpdatePhotoInput {
  id: string;
  collection: CollectionType;
  category?: CategoryType | null;
  title: string;
  alt: string;
  caption?: string | null;
  instagram_url?: string | null;
  taken_on?: string | null;
}

export async function updatePhotoAction(input: UpdatePhotoInput) {
  const supabase = await requireAuth();

  if (!input.id) {
    return { error: "Photo ID is required." };
  }
  if (!input.title?.trim()) {
    return { error: "Photo title is required." };
  }
  if (!input.alt?.trim()) {
    return { error: "Alt text is required." };
  }

  const { error } = await supabase
    .from("photos")
    .update({
      title: input.title.trim(),
      alt: input.alt.trim(),
      caption: input.caption?.trim() || null,
      category: input.category || null,
      instagram_url: input.instagram_url?.trim() || null,
      taken_on: input.taken_on || null,
    })
    .eq("id", input.id);

  if (error) {
    return { error: error.message };
  }

  purgeCaches(input.collection);
  return { success: true };
}

export async function deletePhotoAction(id: string, storagePath: string, collection: CollectionType) {
  const supabase = await requireAuth();

  if (!id) {
    return { error: "Photo ID is required." };
  }

  // 1. Delete database row first
  const { error: dbError } = await supabase.from("photos").delete().eq("id", id);
  if (dbError) {
    return { error: dbError.message };
  }

  // 2. Delete storage object if path provided
  if (storagePath) {
    const { error: storageError } = await supabase.storage
      .from("photos")
      .remove([storagePath]);
    if (storageError) {
      console.warn("[deletePhotoAction] Could not delete storage file:", storageError.message);
    }
  }

  purgeCaches(collection);
  return { success: true };
}

export async function reorderPhotoAction(
  id: string,
  direction: "up" | "down",
  collection: CollectionType
) {
  const supabase = await requireAuth();

  // Fetch all photos in collection sorted by sort_order
  const { data: photos, error } = await supabase
    .from("photos")
    .select("id, sort_order")
    .eq("collection", collection)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error || !photos) {
    return { error: error?.message || "Failed to fetch collection for reordering." };
  }

  const currentIndex = photos.findIndex((p) => p.id === id);
  if (currentIndex === -1) {
    return { error: "Photo not found in collection." };
  }

  const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
  if (targetIndex < 0 || targetIndex >= photos.length) {
    // Already at the boundary
    return { success: true };
  }

  const currentPhoto = photos[currentIndex];
  const targetPhoto = photos[targetIndex];

  // Swap sort_order
  const currentOrder = currentPhoto.sort_order;
  const targetOrder = targetPhoto.sort_order;

  // If sort_orders are identical, assign fresh sequential numbers
  const newCurrentOrder = currentOrder === targetOrder ? (direction === "up" ? targetOrder - 1 : targetOrder + 1) : targetOrder;
  const newTargetOrder = currentOrder === targetOrder ? targetOrder : currentOrder;

  await Promise.all([
    supabase.from("photos").update({ sort_order: newCurrentOrder }).eq("id", currentPhoto.id),
    supabase.from("photos").update({ sort_order: newTargetOrder }).eq("id", targetPhoto.id),
  ]);

  purgeCaches(collection);
  return { success: true };
}

export async function replaceMemoryAction(input: {
  category: CategoryType;
  title: string;
  alt: string;
  caption?: string | null;
  storage_path: string;
  width: number;
  height: number;
  blur_data_url?: string | null;
  old_id?: string | null;
  old_storage_path?: string | null;
}) {
  const supabase = await requireAuth();

  // Insert or update memory slot
  // If old_id exists, we update or delete the old row and storage file
  if (input.old_id) {
    const { error: deleteError } = await supabase
      .from("photos")
      .delete()
      .eq("id", input.old_id);

    if (deleteError) {
      return { error: deleteError.message };
    }

    if (input.old_storage_path) {
      await supabase.storage.from("photos").remove([input.old_storage_path]);
    }
  }

  const { data, error } = await supabase
    .from("photos")
    .insert({
      collection: "memory",
      category: input.category,
      title: input.title.trim(),
      alt: input.alt.trim(),
      caption: input.caption?.trim() || null,
      storage_path: input.storage_path,
      width: input.width,
      height: input.height,
      blur_data_url: input.blur_data_url || null,
      sort_order: 0,
    })
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  purgeCaches("memory");
  return { success: true, photo: data };
}

import { createPublicClient } from "@/lib/supabase/public";
import {
  Photo,
  Category,
  heroPhotos as staticHeroPhotos,
  memoriesPhotos as staticMemoriesPhotos,
  galleryPhotos as staticGalleryPhotos,
} from "@/data/photos";
import { RecentArt, recentArts as staticRecentArts } from "@/data/recent";

import { cacheLife, cacheTag } from "next/cache";

export type Collection = "hero" | "memory" | "gallery" | "recent";

export interface DatabasePhotoRow {
  id: string;
  collection: Collection;
  category: Category | null;
  title: string;
  alt: string;
  caption: string | null;
  storage_path: string;
  width: number;
  height: number;
  blur_data_url: string | null;
  instagram_url: string | null;
  taken_on: string | null;
  sort_order: number;
  created_at: string;
}

/**
 * Builds the public CDN URL for a photo stored in Supabase Storage bucket 'photos'.
 */
export function getPhotoPublicUrl(storagePath: string): string {
  const supabase = createPublicClient();
  if (!supabase) return storagePath;
  const { data } = supabase.storage.from("photos").getPublicUrl(storagePath);
  return data.publicUrl;
}

/**
 * Maps a Supabase database row to the standard Photo shape used throughout the public site.
 */
export function mapRowToPhoto(row: DatabasePhotoRow): Photo {
  const src = getPhotoPublicUrl(row.storage_path);
  return {
    id: row.id,
    src,
    title: row.title,
    category: (row.category as Category) || "casual",
    caption: row.caption || undefined,
    width: row.width,
    height: row.height,
    alt: row.alt,
    credit: {
      name: "Aswin Krishna",
      url: "https://www.instagram.com/foto.aswin/",
    },
  };
}

/**
 * Maps a Supabase database row to the RecentArt shape.
 */
export function mapRowToRecentArt(row: DatabasePhotoRow): RecentArt {
  const src = getPhotoPublicUrl(row.storage_path);
  // Format date from taken_on or created_at (e.g. "October 2026")
  let dateStr = "Recent";
  try {
    const rawDate = row.taken_on || row.created_at;
    if (rawDate) {
      dateStr = new Intl.DateTimeFormat("en-US", {
        month: "long",
        year: "numeric",
      }).format(new Date(rawDate));
    }
  } catch {
    dateStr = "Recent";
  }

  return {
    id: row.id,
    src,
    title: row.title,
    date: dateStr,
    instagramUrl: row.instagram_url || "https://www.instagram.com/foto.aswin/",
    width: row.width,
    height: row.height,
    alt: row.alt,
  };
}

/**
 * Access layer for public site photos (Hero, Memories, Gallery).
 *
 * Rules:
 * - Uses cookie-less anon client (createPublicClient) to preserve cacheability & prevent session leakage.
 * - When Supabase is configured and reachable: queries Supabase 'photos' table.
 * - Fallback: returns static data if Supabase is unconfigured, or table query fails (permission/network).
 * - Empty states: returns empty array if Supabase query succeeds with 0 rows.
 */
export async function getPhotos(
  collection: Collection,
  category?: Category
): Promise<Photo[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag(`photos-${collection}`);
  const supabase = createPublicClient();

  if (!supabase) {
    // Supabase credentials not configured: fallback to static data
    return getStaticPhotos(collection, category);
  }

  try {
    let query = supabase
      .from("photos")
      .select("*")
      .eq("collection", collection);

    if (category) {
      query = query.eq("category", category);
    }

    if (collection === "recent") {
      query = query.order("created_at", { ascending: false });
    } else {
      query = query.order("sort_order", { ascending: true });
    }

    const { data, error } = await query;

    if (error) {
      console.warn(`[getPhotos] Supabase query error for ${collection}: ${error.message}. Using fallback.`);
      return getStaticPhotos(collection, category);
    }

    // Supabase query succeeded: map database rows (empty array if 0 rows)
    const rows = (data || []) as DatabasePhotoRow[];
    return rows.map(mapRowToPhoto);
  } catch (err) {
    console.warn(`[getPhotos] Unexpected error querying ${collection}:`, err);
    return getStaticPhotos(collection, category);
  }
}

/**
 * Access layer for Memories section on Home page.
 * Returns record of { nature: Photo | null, wedding: Photo | null, casual: Photo | null }.
 */
export async function getMemoriesPhotos(): Promise<Record<Category, Photo | null>> {
  "use cache";
  cacheLife("minutes");
  cacheTag("photos-memory");
  const supabase = createPublicClient();

  if (!supabase) {
    return {
      nature: staticMemoriesPhotos.nature,
      wedding: staticMemoriesPhotos.wedding,
      casual: staticMemoriesPhotos.casual,
    };
  }

  try {
    const { data, error } = await supabase
      .from("photos")
      .select("*")
      .eq("collection", "memory");

    if (error) {
      console.warn(`[getMemoriesPhotos] Supabase query error: ${error.message}. Using fallback.`);
      return {
        nature: staticMemoriesPhotos.nature,
        wedding: staticMemoriesPhotos.wedding,
        casual: staticMemoriesPhotos.casual,
      };
    }

    const rows = (data || []) as DatabasePhotoRow[];
    const result: Record<Category, Photo | null> = {
      nature: null,
      wedding: null,
      casual: null,
    };

    rows.forEach((row) => {
      if (row.category && row.category in result) {
        result[row.category as Category] = mapRowToPhoto(row);
      }
    });

    return result;
  } catch (err) {
    console.warn("[getMemoriesPhotos] Unexpected error:", err);
    return {
      nature: staticMemoriesPhotos.nature,
      wedding: staticMemoriesPhotos.wedding,
      casual: staticMemoriesPhotos.casual,
    };
  }
}

/**
 * Access layer for Recent Arts page.
 */
export async function getRecentPhotos(): Promise<RecentArt[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag("photos-recent");
  const supabase = createPublicClient();

  if (!supabase) {
    return staticRecentArts;
  }

  try {
    const { data, error } = await supabase
      .from("photos")
      .select("*")
      .eq("collection", "recent")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) {
      console.warn(`[getRecentPhotos] Supabase query error: ${error.message}. Using fallback.`);
      return staticRecentArts;
    }

    const rows = (data || []) as DatabasePhotoRow[];
    return rows.map(mapRowToRecentArt);
  } catch (err) {
    console.warn("[getRecentPhotos] Unexpected error:", err);
    return staticRecentArts;
  }
}

function getStaticPhotos(collection: Collection, category?: Category): Photo[] {
  switch (collection) {
    case "hero":
      return staticHeroPhotos;
    case "memory":
      if (category && staticMemoriesPhotos[category]) {
        return [staticMemoriesPhotos[category]];
      }
      return Object.values(staticMemoriesPhotos);
    case "gallery":
      if (category) {
        return staticGalleryPhotos.filter((p) => p.category === category);
      }
      return staticGalleryPhotos;
    case "recent":
      return staticRecentArts.map((r) => ({
        id: r.id,
        src: r.src,
        title: r.title,
        category: "casual" as Category,
        caption: r.date,
        width: r.width,
        height: r.height,
        alt: r.alt,
        credit: {
          name: "Aswin Krishna",
          url: r.instagramUrl,
        },
      }));
    default:
      return [];
  }
}

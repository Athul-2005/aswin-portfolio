import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AdminDashboardClient from "./components/AdminDashboardClient";
import { AdminPhotoItem } from "./components/AdminPhotoGrid";
import { DatabasePhotoRow, getPhotoPublicUrl } from "@/lib/photos";

async function AdminContent() {
  const supabase = await createClient();

  // Rule 4: Verify authentication on the server with getClaims() (never trust proxy alone)
  const { data: authData } = await supabase.auth.getClaims();

  if (!authData?.claims) {
    redirect("/admin/login");
  }

  const claims = authData.claims as { email?: string };
  const userEmail = claims.email || "Authenticated User";

  // Fetch all photos for admin management
  const { data: dbPhotos, error } = await supabase
    .from("photos")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    console.warn("[AdminDashboardPage] Error fetching photos:", error.message);
  }

  const rows = (dbPhotos || []) as DatabasePhotoRow[];
  const initialPhotos: AdminPhotoItem[] = rows.map((r) => ({
    id: r.id,
    collection: r.collection,
    category: r.category,
    title: r.title,
    alt: r.alt,
    caption: r.caption,
    storage_path: r.storage_path,
    width: r.width,
    height: r.height,
    instagram_url: r.instagram_url,
    sort_order: r.sort_order,
    public_url: getPhotoPublicUrl(r.storage_path),
  }));

  return (
    <AdminDashboardClient
      userEmail={userEmail}
      initialPhotos={initialPhotos}
    />
  );
}

export default function AdminDashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-svh flex items-center justify-center bg-[#000000] text-[#8a8780] text-xs uppercase tracking-[0.18em]">
          Loading admin dashboard...
        </div>
      }
    >
      <AdminContent />
    </Suspense>
  );
}

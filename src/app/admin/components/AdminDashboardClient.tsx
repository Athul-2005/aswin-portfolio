"use client";

import { useState } from "react";
import Link from "next/link";
import { CollectionType, CategoryType, signOutAction } from "../actions";
import AdminUploader from "./AdminUploader";
import AdminPhotoGrid, { AdminPhotoItem } from "./AdminPhotoGrid";
import AdminMemoriesTab, { MemorySlotData } from "./AdminMemoriesTab";

interface AdminDashboardClientProps {
  userEmail: string;
  initialPhotos: AdminPhotoItem[];
}

export default function AdminDashboardClient({
  userEmail,
  initialPhotos,
}: AdminDashboardClientProps) {
  const [activeTab, setActiveTab] = useState<CollectionType>("hero");
  const [photos] = useState<AdminPhotoItem[]>(initialPhotos);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchPhotos = async () => {
    setIsRefreshing(true);
    try {
      // Dynamic fetch from API or reload page
      window.location.reload();
    } catch (e) {
      console.error("Failed to refresh photos:", e);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Group photos for Memories tab
  const memoriesRecord: Record<CategoryType, MemorySlotData | null> = {
    nature: null,
    wedding: null,
    casual: null,
  };

  photos
    .filter((p) => p.collection === "memory")
    .forEach((p) => {
      if (p.category && p.category in memoriesRecord) {
        memoriesRecord[p.category] = {
          id: p.id,
          category: p.category,
          title: p.title,
          alt: p.alt,
          caption: p.caption,
          storage_path: p.storage_path,
          public_url: p.public_url,
        };
      }
    });

  const tabPhotos = photos.filter((p) => p.collection === activeTab);

  const getPublicLink = () => {
    switch (activeTab) {
      case "hero":
      case "memory":
        return "/";
      case "gallery":
        return "/gallery";
      case "recent":
        return "/recent";
      default:
        return "/";
    }
  };

  return (
    <div className="min-h-svh flex flex-col bg-[#000000] text-[#f2efe9]">
      {/* Header */}
      <header className="border-b border-[#26241f] bg-[#0b0b0b] px-4 sm:px-8 py-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-4 sm:gap-6">
          <Link href="/admin" className="font-['Bebas_Neue',sans-serif] text-2xl tracking-wider text-[#f2efe9]">
            PHOTOS ADMIN
          </Link>
          <span className="hidden sm:inline-block text-xs uppercase tracking-[0.18em] text-[#8a8780]">
            Supabase Live
          </span>
        </div>

        <div className="flex items-center gap-4 sm:gap-6 text-xs uppercase tracking-[0.18em]">
          <span className="text-[#8a8780] hidden md:inline lowercase tracking-normal">
            {userEmail}
          </span>
          <Link
            href={getPublicLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#c8a96a] hover:text-[#f2efe9] transition-colors flex items-center gap-1.5"
          >
            <span>Open page</span>
            <span aria-hidden="true">↗</span>
          </Link>
          <form action={signOutAction}>
            <button
              type="submit"
              className="px-3 py-1.5 border border-[#26241f] text-[#f2efe9] hover:border-[#f2efe9] hover:bg-white/5 transition-colors cursor-pointer min-h-[44px]"
            >
              Sign out
            </button>
          </form>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-[1440px] mx-auto w-full p-4 sm:p-8 flex flex-col">
        {/* Tabs */}
        <div className="flex gap-2 sm:gap-4 border-b border-[#26241f] pb-4 mb-8 text-xs uppercase tracking-[0.18em] overflow-x-auto">
          {(
            [
              { id: "hero", label: "Hero (Home)" },
              { id: "memory", label: "Memories (Home)" },
              { id: "gallery", label: "Gallery" },
              { id: "recent", label: "Recent Arts" },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 border transition-all cursor-pointer min-h-[44px] shrink-0 ${
                activeTab === tab.id
                  ? "bg-[#f2efe9] text-black font-semibold border-[#f2efe9]"
                  : "border-[#26241f] text-[#8a8780] hover:text-[#f2efe9] hover:border-[#8a8780]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Specific Content */}
        {activeTab === "memory" ? (
          <AdminMemoriesTab
            memories={memoriesRecord}
            onRefresh={fetchPhotos}
          />
        ) : (
          <div className="flex flex-col gap-10">
            {/* Direct Uploader */}
            <section className="flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <span className="text-xs uppercase tracking-[0.2em] text-[#c8a96a] font-medium">
                  Add Photos to {activeTab.toUpperCase()}
                </span>
                {activeTab === "hero" && (
                  <span className="text-[11px] uppercase tracking-wider text-[#8a8780]">
                    1 to 5 slides recommended ({tabPhotos.length} active)
                  </span>
                )}
              </div>
              <AdminUploader
                collection={activeTab}
                defaultCategory="nature"
                onUploadComplete={fetchPhotos}
              />
            </section>

            {/* Existing Photos Grid */}
            <section className="flex flex-col gap-4">
              <div className="flex justify-between items-center pb-2 border-b border-[#26241f]">
                <span className="text-xs uppercase tracking-[0.2em] text-[#f2efe9] font-medium">
                  Current {activeTab.toUpperCase()} Photos ({tabPhotos.length})
                </span>
                <button
                  type="button"
                  onClick={fetchPhotos}
                  disabled={isRefreshing}
                  className="text-[11px] uppercase tracking-[0.18em] text-[#8a8780] hover:text-[#c8a96a] transition-colors cursor-pointer"
                >
                  {isRefreshing ? "Refreshing..." : "↻ Refresh List"}
                </button>
              </div>

              <AdminPhotoGrid
                photos={tabPhotos}
                collection={activeTab}
                onRefresh={fetchPhotos}
              />
            </section>
          </div>
        )}
      </main>
    </div>
  );
}

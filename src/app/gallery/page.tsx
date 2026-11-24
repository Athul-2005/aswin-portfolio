import { Suspense } from "react";
import GalleryGrid from "@/components/GalleryGrid";
import { getPhotos } from "@/lib/photos";

export const metadata = {
  title: "Gallery | Aswin Krishna Photography Toronto",
  description:
    "Portfolio gallery of nature, wedding, and casual photography in Toronto and across Ontario.",
};

export default async function GalleryPage() {
  const galleryPhotos = await getPhotos("gallery");

  return (
    <main
      id="main"
      className="pt-28 pb-20 px-4 sm:px-8 md:px-12 max-w-[1440px] mx-auto w-full min-h-svh"
    >
      <header className="mb-10">
        <span className="text-xs uppercase tracking-[0.2em] text-[var(--accent)] font-medium">
          Portfolio Archive
        </span>
        <h1 className="font-['Bebas_Neue',sans-serif] text-[clamp(3.5rem,12vw,9rem)] leading-[0.9] text-[var(--fg)] tracking-tight mt-2">
          GALLERY
        </h1>
        <p className="text-xs sm:text-sm uppercase tracking-[0.18em] text-[var(--muted)] mt-4">
          Curated visual stories across Toronto, Algonquin, and beyond
        </p>
      </header>

      {/* Suspense wrapper for client component using useSearchParams */}
      <Suspense
        fallback={
          <div className="py-20 text-center text-xs uppercase tracking-widest text-[var(--muted)]">
            Loading gallery...
          </div>
        }
      >
        <GalleryGrid initialPhotos={galleryPhotos} />
      </Suspense>
    </main>
  );
}

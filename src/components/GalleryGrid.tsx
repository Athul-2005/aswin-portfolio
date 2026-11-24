"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { Photo, Category, galleryPhotos as fallbackGalleryPhotos } from "@/data/photos";
import Lightbox from "./Lightbox";
import { playShutterSound } from "@/lib/shutter";

const CATEGORIES: { label: string; value: Category | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Nature", value: "nature" },
  { label: "Wedding", value: "wedding" },
  { label: "Casual", value: "casual" },
];

interface GalleryGridProps {
  initialPhotos?: Photo[];
}

export default function GalleryGrid({
  initialPhotos = fallbackGalleryPhotos,
}: GalleryGridProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const shouldReduceMotion = useReducedMotion();

  const currentCategory = (searchParams.get("category") || "all") as Category | "all";
  const [hoveredPhotoId, setHoveredPhotoId] = useState<string | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  // Filtered photos
  const filteredPhotos =
    currentCategory === "all"
      ? initialPhotos
      : initialPhotos.filter((p) => p.category === currentCategory);

  const selectedIndex = selectedPhoto
    ? filteredPhotos.findIndex((p) => p.id === selectedPhoto.id)
    : -1;

  const handleFilterChange = (cat: Category | "all") => {
    if (cat === "all") {
      router.push("/gallery", { scroll: false });
    } else {
      router.push(`/gallery?category=${cat}`, { scroll: false });
    }
  };

  const handlePhotoClick = (photo: Photo) => {
    playShutterSound();
    setSelectedPhoto(photo);
  };

  const handleNextPhoto = () => {
    if (selectedIndex >= 0 && selectedIndex < filteredPhotos.length - 1) {
      setSelectedPhoto(filteredPhotos[selectedIndex + 1]);
    } else if (selectedIndex === filteredPhotos.length - 1) {
      setSelectedPhoto(filteredPhotos[0]);
    }
  };

  const handlePrevPhoto = () => {
    if (selectedIndex > 0) {
      setSelectedPhoto(filteredPhotos[selectedIndex - 1]);
    } else if (selectedIndex === 0) {
      setSelectedPhoto(filteredPhotos[filteredPhotos.length - 1]);
    }
  };

  return (
    <>
      {/* Category Filter Chips */}
      <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-10">
        {CATEGORIES.map((cat) => {
          const isActive = currentCategory === cat.value;
          return (
            <button
              key={cat.value}
              type="button"
              onClick={() => handleFilterChange(cat.value)}
              className={`px-5 py-2 text-xs uppercase tracking-[0.18em] transition-all cursor-pointer focus-visible:outline-1 focus-visible:outline-[var(--accent)] ${
                isActive
                  ? "bg-[var(--fg)] text-black font-semibold border border-[var(--fg)]"
                  : "border border-[var(--line)] text-[var(--muted)] hover:text-[var(--fg)] hover:border-[var(--muted)]"
              }`}
              aria-pressed={isActive}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Empty State (Rule 11: empty gallery shows a short message) */}
      {filteredPhotos.length === 0 ? (
        <div className="py-24 text-center border border-[var(--line)] bg-[var(--bg-soft)] p-8">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
            No photographs found in this collection yet.
          </p>
          <button
            type="button"
            onClick={() => handleFilterChange("all")}
            className="mt-4 inline-block text-xs uppercase tracking-[0.18em] text-[var(--accent)] hover:text-[var(--fg)] underline transition-colors cursor-pointer"
          >
            View all photographs →
          </button>
        </div>
      ) : (
        /* Masonry Layout via CSS columns with 8px gap */
        <div
          className="columns-1 sm:columns-2 lg:columns-3 gap-2 [column-fill:_balance]"
          style={{ columnGap: "8px" }}
        >
          {filteredPhotos.map((photo, index) => {
            const isHovered = hoveredPhotoId === photo.id;
            return (
              <motion.div
                key={photo.id}
                layout
                initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={shouldReduceMotion ? undefined : { opacity: 0, scale: 0.95 }}
                transition={{
                  duration: shouldReduceMotion ? 0 : 0.4,
                  delay: shouldReduceMotion ? 0 : Math.min(index * 0.04, 0.4),
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="break-inside-avoid mb-2"
              >
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => handlePhotoClick(photo)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handlePhotoClick(photo);
                    }
                  }}
                  onMouseEnter={() => setHoveredPhotoId(photo.id)}
                  onMouseLeave={() => setHoveredPhotoId(null)}
                  className="group relative block w-full overflow-hidden cursor-pointer focus-visible:outline-2 focus-visible:outline-[var(--accent)] focus-visible:outline-offset-2 border border-[var(--line)] bg-[var(--bg-soft)]"
                  aria-label={`Open photo: ${photo.title}`}
                >
                  {/* Photo Container */}
                  <div className="relative w-full overflow-hidden">
                    <Image
                      src={photo.src}
                      alt={photo.alt}
                      width={photo.width}
                      height={photo.height}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      loading={index < 4 ? "eager" : "lazy"}
                      priority={index < 2}
                      className="w-full h-auto object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />

                    {/* Gradient Overlay on Hover */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-300 pointer-events-none ${
                        isHovered ? "opacity-100" : "opacity-0"
                      }`}
                    />

                    {/* Meta info revealed on hover */}
                    <div
                      className={`absolute bottom-0 left-0 right-0 p-4 flex flex-col justify-end transition-opacity duration-300 pointer-events-none ${
                        isHovered ? "opacity-100" : "opacity-0"
                      }`}
                    >
                      <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--accent)] font-medium">
                        {photo.category}
                      </span>
                      <h2 className="font-['Bebas_Neue',sans-serif] text-2xl text-[var(--fg)] tracking-wide mt-0.5">
                        {photo.title}
                      </h2>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedPhoto && (
          <Lightbox
            photo={selectedPhoto}
            currentIndex={selectedIndex >= 0 ? selectedIndex : 0}
            totalCount={filteredPhotos.length}
            onClose={() => setSelectedPhoto(null)}
            onNext={handleNextPhoto}
            onPrev={handlePrevPhoto}
          />
        )}
      </AnimatePresence>
    </>
  );
}

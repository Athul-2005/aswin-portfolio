"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { Photo, Category, galleryPhotos } from "@/data/photos";
import Lightbox from "./Lightbox";
import { playShutterSound } from "@/lib/shutter";

const CATEGORIES: { label: string; value: Category | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Nature", value: "nature" },
  { label: "Wedding", value: "wedding" },
  { label: "Casual", value: "casual" },
];

export default function GalleryGrid() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const shouldReduceMotion = useReducedMotion();

  const currentCategory = (searchParams.get("category") || "all") as Category | "all";
  const [hoveredPhotoId, setHoveredPhotoId] = useState<string | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  // Filtered photos
  const filteredPhotos =
    currentCategory === "all"
      ? galleryPhotos
      : galleryPhotos.filter((p) => p.category === currentCategory);

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

      {/* Masonry Layout via CSS columns with 8px gap */}
      <motion.div
        layout
        className="columns-1 sm:columns-2 lg:columns-3 gap-[8px] space-y-[8px]"
      >
        <AnimatePresence>
          {filteredPhotos.map((photo, index) => {
            const isHovered = hoveredPhotoId === photo.id;
            const isAnyHovered = hoveredPhotoId !== null;

            return (
              <motion.div
                key={photo.id}
                layout
                data-cursor="view"
                initial={
                  shouldReduceMotion
                    ? { opacity: 1 }
                    : {
                        opacity: 0,
                        clipPath: "inset(0% 100% 0% 0%)",
                        scale: 1.15,
                      }
                }
                whileInView={
                  shouldReduceMotion
                    ? { opacity: 1 }
                    : {
                        opacity: 1,
                        clipPath: "inset(0% 0% 0% 0%)",
                        scale: 1,
                      }
                }
                viewport={{ once: true, amount: 0.15 }}
                transition={{
                  delay: shouldReduceMotion ? 0 : (index % 3) * 0.1,
                  duration: 0.8,
                  ease: [0.22, 1, 0.36, 1],
                }}
                onMouseEnter={() => setHoveredPhotoId(photo.id)}
                onMouseLeave={() => setHoveredPhotoId(null)}
                onClick={() => handlePhotoClick(photo)}
                className={`relative break-inside-avoid overflow-hidden cursor-pointer group transition-all duration-300 ${
                  isAnyHovered && !isHovered ? "opacity-40" : "opacity-100"
                }`}
                style={{
                  transform: isHovered && !shouldReduceMotion ? "scale(1.04)" : "scale(1)",
                  zIndex: isHovered ? 20 : 1,
                }}
              >
                <motion.div layoutId={`photo-${photo.id}`}>
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    width={photo.width}
                    height={photo.height}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="w-full h-auto object-cover block bg-[var(--bg-soft)] transition-transform duration-500 group-hover:brightness-105"
                  />
                </motion.div>

                {/* Hover Caption Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--accent)] font-semibold">
                    {photo.category}
                  </span>
                  <p className="text-sm font-medium text-[var(--fg)] mt-1">
                    {photo.title}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {/* Lightbox Modal */}
      <Lightbox
        photo={selectedPhoto}
        currentIndex={selectedIndex}
        totalCount={filteredPhotos.length}
        onClose={() => setSelectedPhoto(null)}
        onPrev={handlePrevPhoto}
        onNext={handleNextPhoto}
      />
    </>
  );
}

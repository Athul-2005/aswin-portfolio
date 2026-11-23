"use client";

import { useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { Photo } from "@/data/photos";
import { playShutterSound } from "@/lib/shutter";

interface LightboxProps {
  photo: Photo | null;
  currentIndex: number;
  totalCount: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export default function Lightbox({
  photo,
  currentIndex,
  totalCount,
  onClose,
  onPrev,
  onNext,
}: LightboxProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);

  const handleNext = useCallback(() => {
    playShutterSound();
    onNext();
  }, [onNext]);

  const handlePrev = useCallback(() => {
    playShutterSound();
    onPrev();
  }, [onPrev]);

  // Keyboard navigation & Esc key
  useEffect(() => {
    if (!photo) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowRight") {
        handleNext();
      } else if (e.key === "ArrowLeft") {
        handlePrev();
      } else if (e.key === "Tab") {
        // Focus trap inside the modal
        if (!overlayRef.current) return;
        const focusables = overlayRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          last.focus();
          e.preventDefault();
        } else if (!e.shiftKey && document.activeElement === last) {
          first.focus();
          e.preventDefault();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [photo, onClose, handleNext, handlePrev]);

  // Lock body scroll when open
  useEffect(() => {
    if (photo) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [photo]);

  // Swipe gesture for touch devices
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        handlePrev();
      } else {
        handleNext();
      }
    }
    touchStartX.current = null;
  };

  if (!photo) return null;

  const formattedIndex = String(currentIndex + 1).padStart(2, "0");
  const formattedTotal = String(totalCount).padStart(2, "0");

  return (
    <AnimatePresence>
      <motion.div
        ref={overlayRef}
        role="dialog"
        aria-modal="true"
        aria-label={`Photo lightbox: ${photo.title}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-8 select-none"
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between w-full max-w-[1440px] mx-auto z-20">
          <div className="flex items-center gap-3">
            <span className="text-xs uppercase tracking-[0.18em] text-[var(--accent)] font-medium">
              {photo.category}
            </span>
            <span className="text-[var(--muted)]">/</span>
            <span className="text-xs uppercase tracking-[0.18em] text-[var(--fg)]">
              {photo.title}
            </span>
          </div>

          <div className="flex items-center gap-6">
            <span className="font-['Bebas_Neue',sans-serif] text-lg sm:text-xl tracking-widest text-[var(--muted)]">
              {formattedIndex} / {formattedTotal}
            </span>
            <button
              type="button"
              onClick={onClose}
              className="text-xs uppercase tracking-[0.18em] text-[var(--muted)] hover:text-[var(--fg)] px-3 py-1.5 border border-[var(--line)] hover:border-[var(--fg)] transition-colors focus-visible:outline-1 focus-visible:outline-[var(--accent)]"
              aria-label="Close lightbox"
              autoFocus
            >
              Close [Esc]
            </button>
          </div>
        </div>

        {/* Center Main Image with Shared layoutId */}
        <div className="relative flex-1 w-full max-w-5xl mx-auto my-4 flex items-center justify-center">
          {/* Previous Button */}
          <button
            type="button"
            onClick={handlePrev}
            className="hidden sm:flex absolute left-2 z-30 w-12 h-12 items-center justify-center rounded-full bg-black/50 border border-[var(--line)] text-[var(--fg)] hover:text-[var(--accent)] hover:border-[var(--accent)] transition-all focus-visible:outline-1 focus-visible:outline-[var(--accent)]"
            aria-label="Previous photo"
          >
            ←
          </button>

          <motion.div
            layoutId={`photo-${photo.id}`}
            className="relative w-full h-full max-h-[75vh] flex items-center justify-center"
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              sizes="(max-width: 1024px) 95vw, 1200px"
              className="object-contain"
              priority
            />
          </motion.div>

          {/* Next Button */}
          <button
            type="button"
            onClick={handleNext}
            className="hidden sm:flex absolute right-2 z-30 w-12 h-12 items-center justify-center rounded-full bg-black/50 border border-[var(--line)] text-[var(--fg)] hover:text-[var(--accent)] hover:border-[var(--accent)] transition-all focus-visible:outline-1 focus-visible:outline-[var(--accent)]"
            aria-label="Next photo"
          >
            →
          </button>
        </div>

        {/* Bottom Details Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between w-full max-w-[1440px] mx-auto z-20 text-xs text-[var(--muted)] gap-2">
          <span>{photo.caption || photo.alt}</span>
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline">Use Arrow keys or swipe to navigate</span>
            <span>Credit: {photo.credit.name}</span>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

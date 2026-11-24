"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { Photo, heroPhotos as fallbackHeroPhotos } from "@/data/photos";
import { site } from "@/data/content";

interface HeroProps {
  photos?: Photo[];
}

export default function Hero({ photos = fallbackHeroPhotos }: HeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [firstImageLoaded, setFirstImageLoaded] = useState(() => !photos || photos.length === 0);
  const [imageErrorMap, setImageErrorMap] = useState<Record<string, boolean>>({});

  const displayPhotos = photos || [];
  const hasPhotos = displayPhotos.length > 0;
  const firstPhotoSrc = displayPhotos[0]?.src || "";
  const firstPhotoId = displayPhotos[0]?.id || "";

  // Live Toronto Clock (America/Toronto) rendered after mount to prevent hydration mismatch
  const [torontoTime, setTorontoTime] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      try {
        const timeString = new Intl.DateTimeFormat("en-US", {
          timeZone: "America/Toronto",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        }).format(new Date());
        setTorontoTime(timeString);
      } catch {
        const now = new Date();
        setTorontoTime(now.toTimeString().slice(0, 8));
      }
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Preload/check first hero image (if available)
  useEffect(() => {
    if (!firstPhotoSrc) return;
    if (typeof window === "undefined") return;

    const img = new window.Image();
    img.src = firstPhotoSrc;
    img.onload = () => setFirstImageLoaded(true);
    img.onerror = () => {
      // Mark as loaded so animations proceed, but record failure
      setFirstImageLoaded(true);
      if (firstPhotoId) {
        setImageErrorMap((prev) => ({ ...prev, [firstPhotoId]: true }));
      }
    };
  }, [firstPhotoSrc, firstPhotoId]);

  // Crossfade interval ~5s (respect reduced motion)
  useEffect(() => {
    if (shouldReduceMotion || displayPhotos.length <= 1) return;
    const interval = setInterval(() => {
      setActivePhotoIdx((prev) => (prev + 1) % displayPhotos.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [shouldReduceMotion, displayPhotos.length]);

  // Parallax: hero image moves down 0 to 15%, foreground fades as user scrolls out
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const parallaxY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const slideCounter = hasPhotos
    ? `${String(activePhotoIdx + 1).padStart(2, "0")} / ${String(
        displayPhotos.length
      ).padStart(2, "0")}`
    : "00 / 00";

  const isReady = shouldReduceMotion || firstImageLoaded;

  return (
    <section
      ref={containerRef}
      className="relative w-full min-h-svh flex flex-col justify-between overflow-hidden bg-black"
    >
      {/* 1. Fullscreen Hero Photos: Bright & High Contrast with Ken Burns */}
      <motion.div
        className="absolute inset-0 z-0 overflow-hidden bg-black"
        style={{ y: shouldReduceMotion ? "0%" : parallaxY }}
      >
        {displayPhotos.map((photo, index) => {
          const isActive = index === activePhotoIdx;
          const hasError = imageErrorMap[photo.id];

          if (hasError) {
            return (
              <div
                key={photo.id}
                className="absolute inset-0 bg-black z-0"
                aria-hidden="true"
              />
            );
          }

          return (
            <motion.div
              key={photo.id}
              className="absolute inset-0 z-0 bg-black"
              initial={false}
              animate={{
                opacity: isReady && isActive ? 1 : 0,
                scale: shouldReduceMotion
                  ? 1
                  : isActive
                  ? [1.06, 1.0]
                  : 1.06,
              }}
              transition={{
                opacity: {
                  duration: shouldReduceMotion ? 0 : 1.2,
                  ease: [0.22, 1, 0.36, 1],
                },
                scale: {
                  duration: shouldReduceMotion ? 0 : 6.5,
                  ease: "linear",
                },
              }}
            >
              <Image
                src={photo.src}
                alt=""
                aria-hidden="true"
                fill
                priority={index === 0}
                sizes="100vw"
                quality={90}
                className="object-cover object-center select-none"
                onError={() =>
                  setImageErrorMap((prev) => ({ ...prev, [photo.id]: true }))
                }
              />
            </motion.div>
          );
        })}

        {/* Empty state: If 0 photos, plain black background */}
        {!hasPhotos && (
          <div className="absolute inset-0 bg-black z-0" aria-hidden="true" />
        )}

        {/* 2. Film Grain Overlay (~6% opacity) */}
        <div
          aria-hidden="true"
          className="absolute inset-0 z-[1] pointer-events-none mix-blend-overlay opacity-[0.06]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* 3. Contrast Overlay: Subtle bottom gradient only for typography legibility */}
        <div
          aria-hidden="true"
          className="absolute inset-0 z-[2] pointer-events-none bg-gradient-to-t from-black/85 via-black/20 to-transparent"
        />
      </motion.div>

      {/* 4. Foreground Content */}
      <motion.div
        className="relative z-10 w-full min-h-svh flex flex-col justify-between p-4 sm:p-8 md:p-12 pointer-events-none"
        style={{ opacity: contentOpacity }}
      >
        {/* Top bar under the floating header */}
        <div className="flex justify-between items-start pt-20 md:pt-24">
          {/* Label under nav on the left */}
          <motion.div
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
            animate={
              isReady
                ? { opacity: 1 }
                : shouldReduceMotion
                ? { opacity: 1 }
                : { opacity: 0 }
            }
            transition={{
              duration: shouldReduceMotion ? 0 : 0.8,
              delay: shouldReduceMotion ? 0 : 1.2,
            }}
            className="flex flex-col gap-1 text-left"
          >
            <span className="text-[11px] sm:text-xs uppercase tracking-[0.2em] text-[#c8a96a] font-medium">
              01 / Welcome
            </span>
            <span className="text-[11px] sm:text-xs uppercase tracking-[0.18em] text-[#f2efe9]">
              {site.tagline}
            </span>
          </motion.div>

          {/* Top-Right: Toronto Coordinates + Live Clock */}
          <motion.div
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
            animate={
              isReady
                ? { opacity: 1 }
                : shouldReduceMotion
                ? { opacity: 1 }
                : { opacity: 0 }
            }
            transition={{
              duration: shouldReduceMotion ? 0 : 0.8,
              delay: shouldReduceMotion ? 0 : 1.2,
            }}
            className="flex flex-col items-end text-right gap-1"
          >
            <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.16em] text-[#8a8780] font-mono">
              43°39&apos;12&quot;N 79°22&apos;59&quot;W
            </span>
            <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.16em] text-[#f2efe9] font-mono">
              TORONTO {torontoTime ? `${torontoTime} EST` : ""}
            </span>
          </motion.div>
        </div>

        {/* Bottom Area: Name (ASWIN / KRISHNA) + Status + Slide Counter */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-2 sm:pb-4">
          {/* Aswin Krishna Name Reveal */}
          <div className="flex flex-col overflow-hidden text-left pl-4 sm:pl-0">
            <h1 className="font-['Bebas_Neue',sans-serif] leading-[0.84] text-[#f2efe9] tracking-tight flex flex-col select-none text-[clamp(4.5rem,min(19vw,26svh),17rem)]">
              {/* Line 1: ASWIN */}
              <span className="overflow-hidden block">
                <motion.span
                  className="block"
                  initial={
                    shouldReduceMotion ? { y: "0%" } : { y: "105%" }
                  }
                  animate={
                    isReady
                      ? { y: "0%" }
                      : shouldReduceMotion
                      ? { y: "0%" }
                      : { y: "105%" }
                  }
                  transition={{
                    duration: shouldReduceMotion ? 0 : 1.1,
                    delay: shouldReduceMotion ? 0 : 0.4,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  ASWIN
                </motion.span>
              </span>

              {/* Line 2: KRISHNA */}
              <span className="overflow-hidden block -mt-1 sm:-mt-3">
                <motion.span
                  className="block"
                  initial={
                    shouldReduceMotion ? { y: "0%" } : { y: "105%" }
                  }
                  animate={
                    isReady
                      ? { y: "0%" }
                      : shouldReduceMotion
                      ? { y: "0%" }
                      : { y: "105%" }
                  }
                  transition={{
                    duration: shouldReduceMotion ? 0 : 1.1,
                    delay: shouldReduceMotion ? 0 : 0.52,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  KRISHNA
                </motion.span>
              </span>
            </h1>

            {/* Bottom-left metadata: Available for bookings */}
            <motion.div
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
              animate={
                isReady
                  ? { opacity: 1 }
                  : shouldReduceMotion
                  ? { opacity: 1 }
                  : { opacity: 0 }
              }
              transition={{
                duration: shouldReduceMotion ? 0 : 0.8,
                delay: shouldReduceMotion ? 0 : 1.2,
              }}
              className="flex items-center gap-2 mt-4 text-[10px] sm:text-xs uppercase tracking-[0.18em] text-[#8a8780]"
            >
              <span
                className={`w-2 h-2 rounded-full bg-[#c8a96a] ${
                  shouldReduceMotion ? "" : "animate-pulse"
                }`}
                aria-hidden="true"
              />
              <span>Available for bookings · 2026/27</span>
            </motion.div>
          </div>

          {/* Bottom-Right: Slide Counter */}
          <motion.div
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
            animate={
              isReady
                ? { opacity: 1 }
                : shouldReduceMotion
                ? { opacity: 1 }
                : { opacity: 0 }
            }
            transition={{
              duration: shouldReduceMotion ? 0 : 0.8,
              delay: shouldReduceMotion ? 0 : 1.2,
            }}
            className="flex items-center gap-3 text-right self-end sm:self-auto text-xs uppercase tracking-[0.2em] font-mono text-[#8a8780]"
          >
            <span>{slideCounter}</span>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}

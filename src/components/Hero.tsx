"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { heroPhotos } from "@/data/photos";
import { site } from "@/data/content";

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [firstImageLoaded, setFirstImageLoaded] = useState(false);
  const [imageErrorMap, setImageErrorMap] = useState<Record<string, boolean>>({});

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

  // Preload/check first hero image
  useEffect(() => {
    if (typeof window === "undefined") return;
    const img = new window.Image();
    img.src = heroPhotos[0]?.src || "";
    img.onload = () => setFirstImageLoaded(true);
    img.onerror = () => {
      // Mark as loaded so animations proceed, but record failure
      setFirstImageLoaded(true);
      setImageErrorMap((prev) => ({ ...prev, [heroPhotos[0].id]: true }));
    };
  }, []);

  // Crossfade interval ~5s (respect reduced motion)
  useEffect(() => {
    if (shouldReduceMotion || heroPhotos.length <= 1) return;
    const interval = setInterval(() => {
      setActivePhotoIdx((prev) => (prev + 1) % heroPhotos.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [shouldReduceMotion]);

  // Parallax: hero image moves down 0 to 15%, foreground fades as user scrolls out
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const parallaxY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const slideCounter = `${String(activePhotoIdx + 1).padStart(2, "0")} / ${String(
    heroPhotos.length
  ).padStart(2, "0")}`;

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
        {heroPhotos.map((photo, index) => {
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
            <div
              key={photo.id}
              className={`absolute inset-0 ${
                shouldReduceMotion
                  ? isActive
                    ? "opacity-100 z-10"
                    : "opacity-0 z-0"
                  : `transition-opacity duration-1000 ease-in-out ${
                      isActive ? "opacity-100 z-10" : "opacity-0 z-0"
                    }`
              }`}
            >
              {/* Entrance: Fades from 0 to 1 over 1.2s with scale 1.06 to 1 on initial load */}
              <motion.div
                initial={
                  shouldReduceMotion
                    ? { opacity: 1, scale: 1 }
                    : { opacity: 0, scale: 1.06 }
                }
                animate={
                  isReady
                    ? { opacity: 1, scale: 1 }
                    : { opacity: 0, scale: 1.06 }
                }
                transition={{
                  duration: 1.2,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className={`relative w-full h-full ${
                  shouldReduceMotion
                    ? "scale-100"
                    : `transition-transform duration-[6000ms] ease-out ${
                        isActive ? "scale-100" : "scale-110"
                      }`
                }`}
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  priority={index === 0}
                  sizes="100vw"
                  onError={() =>
                    setImageErrorMap((prev) => ({ ...prev, [photo.id]: true }))
                  }
                  className="object-cover object-center contrast-[1.08] brightness-[1.02] saturate-[1.05]"
                />
              </motion.div>
            </div>
          );
        })}

        {/* Gradient ONLY at bottom for type legibility & marquee blend */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black via-black/50 to-transparent z-10 pointer-events-none"
        />

        {/* Subtle top shade to ensure nav and top metadata readability */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/60 to-transparent z-10 pointer-events-none"
        />
      </motion.div>

      {/* Subtle Film Grain Overlay (SVG noise, about 6% opacity) */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none z-20 opacity-[0.06] mix-blend-screen"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Foreground Content Container */}
      <motion.div
        className="relative z-30 flex flex-col justify-between flex-1 w-full max-w-[1440px] mx-auto px-4 sm:px-8 md:px-14 pt-24 pb-8 md:pb-12 pointer-events-none"
        style={{ opacity: shouldReduceMotion ? 1 : contentOpacity }}
      >
        {/* Top bar under nav: Left = Photography label; Right = Toronto Coordinates & Live Clock */}
        <div className="flex justify-between items-start gap-4">
          {/* Label "Photography / Toronto, Ontario" + 01 / Welcome */}
          <motion.div
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
            animate={isReady ? { opacity: 1 } : { opacity: 0 }}
            transition={{
              duration: 0.8,
              delay: shouldReduceMotion ? 0 : 0.8, // 0.8s after image load
              ease: "easeOut",
            }}
            className="flex flex-col gap-1"
          >
            <span className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-[var(--accent)] font-medium">
              01 / Welcome
            </span>
            <span className="text-xs sm:text-sm uppercase tracking-[0.18em] text-[var(--fg)] drop-shadow-md">
              {site.tagline}
            </span>
          </motion.div>

          {/* Corner Metadata: Toronto coordinates & Live Toronto clock */}
          <motion.div
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
            animate={isReady ? { opacity: 1 } : { opacity: 0 }}
            transition={{
              duration: 0.8,
              delay: shouldReduceMotion ? 0 : 0.8, // 0.8s after image load
              ease: "easeOut",
            }}
            className="flex flex-col items-end text-right font-mono text-[10px] sm:text-xs tracking-wider text-[var(--fg)]/90 drop-shadow"
          >
            <span className="uppercase text-[var(--muted)]">
              43°39&apos;12&quot; N · 79°22&apos;59&quot; W
            </span>
            <span className="text-[var(--accent)]">
              TORONTO {torontoTime ? `${torontoTime} EDT` : "..."}
            </span>
          </motion.div>
        </div>

        {/* Slide Counter on right edge */}
        <div className="flex justify-end w-full my-auto pt-8 sm:pt-12">
          <motion.div
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
            animate={isReady ? { opacity: 1 } : { opacity: 0 }}
            transition={{
              duration: 0.8,
              delay: shouldReduceMotion ? 0 : 0.8,
              ease: "easeOut",
            }}
            className="font-mono text-xs sm:text-sm tracking-widest text-[var(--fg)]/90 bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded border border-white/10"
          >
            <span className="text-[var(--accent)] font-semibold">{slideCounter.slice(0, 2)}</span>
            <span className="text-[var(--muted)]">{slideCounter.slice(2)}</span>
          </motion.div>
        </div>

        {/* Bottom area: Anchored bottom-left with at least 6rem space under nav */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mt-auto pt-12 sm:pt-16">
          {/* Name "ASWIN / KRISHNA" strictly left-aligned on mobile (px-4 = 1rem) */}
          <div className="flex flex-col items-start text-left select-none w-full md:w-auto">
            {/* "Available for bookings" with pulsing dot */}
            <motion.div
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
              animate={isReady ? { opacity: 1 } : { opacity: 0 }}
              transition={{
                duration: 0.8,
                delay: shouldReduceMotion ? 0 : 0.8,
                ease: "easeOut",
              }}
              className="flex items-center gap-2 mb-2 sm:mb-3"
            >
              <span className="relative flex h-2 w-2">
                {!shouldReduceMotion && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent)] opacity-75" />
                )}
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--accent)]" />
              </span>
              <span className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-[var(--fg)]/90 font-medium drop-shadow">
                Available for bookings
              </span>
            </motion.div>

            {/* Line 1: ASWIN (0.4s after image loaded, slides up from mask) */}
            <div className="overflow-hidden">
              <motion.h1
                initial={shouldReduceMotion ? { y: 0, opacity: 1 } : { y: "105%" }}
                animate={
                  isReady
                    ? { y: 0, opacity: 1 }
                    : { y: "105%", opacity: 0 }
                }
                transition={{
                  duration: 1.1,
                  delay: shouldReduceMotion ? 0 : 0.4,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="font-['Bebas_Neue',sans-serif] text-[clamp(4.5rem,min(19vw,26svh),17rem)] leading-[0.88] text-[var(--fg)] tracking-tight drop-shadow-2xl"
              >
                ASWIN
              </motion.h1>
            </div>

            {/* Line 2: KRISHNA (0.4s + 0.12s stagger = 0.52s) */}
            <div className="overflow-hidden">
              <motion.h1
                initial={shouldReduceMotion ? { y: 0, opacity: 1 } : { y: "105%" }}
                animate={
                  isReady
                    ? { y: 0, opacity: 1 }
                    : { y: "105%", opacity: 0 }
                }
                transition={{
                  duration: 1.1,
                  delay: shouldReduceMotion ? 0 : 0.52,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="font-['Bebas_Neue',sans-serif] text-[clamp(4.5rem,min(19vw,26svh),17rem)] leading-[0.88] text-[var(--fg)] tracking-tight drop-shadow-2xl"
              >
                KRISHNA
              </motion.h1>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

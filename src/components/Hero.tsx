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

  // Crossfade interval ~5s
  useEffect(() => {
    if (heroPhotos.length <= 1) return;
    const interval = setInterval(() => {
      setActivePhotoIdx((prev) => (prev + 1) % heroPhotos.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Parallax: hero image moves down 0 to 15%, name fades as user scrolls out
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const parallaxY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section
      ref={containerRef}
      className="relative w-full min-h-svh flex flex-col justify-between overflow-hidden bg-[var(--bg)]"
    >
      {/* Background Images with Crossfade & Ken Burns Zoom */}
      <motion.div
        className="absolute inset-0 z-0 overflow-hidden"
        style={{ y: shouldReduceMotion ? "0%" : parallaxY }}
      >
        {heroPhotos.map((photo, index) => {
          const isActive = index === activePhotoIdx;
          return (
            <div
              key={photo.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isActive ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
            >
              <div
                className={`relative w-full h-full transition-transform duration-[6000ms] ease-out ${
                  isActive && !shouldReduceMotion ? "scale-100" : "scale-110"
                }`}
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  priority={index === 0}
                  sizes="100vw"
                  className="object-cover object-center"
                />
              </div>
            </div>
          );
        })}

        {/* 35% black overlay for contrast and legibility */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-black/35 z-20 pointer-events-none"
        />
        {/* Subtle bottom vignette to blend seamlessly into marquee */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black to-transparent z-20 pointer-events-none"
        />
      </motion.div>

      {/* Foreground Content Container */}
      <motion.div
        className="relative z-30 flex flex-col justify-between flex-1 w-full max-w-[1440px] mx-auto px-4 sm:px-8 md:px-12 pt-8 pb-8 md:pb-12 pointer-events-none"
        style={{ opacity: shouldReduceMotion ? 1 : contentOpacity }}
      >
        {/* Top chapter indicator & location label */}
        <div className="flex justify-between items-start pt-6">
          <div className="flex flex-col gap-1">
            <span className="text-[11px] sm:text-xs uppercase tracking-[0.18em] text-[var(--accent)] font-medium">
              01 / Welcome
            </span>
            <span className="text-xs sm:text-sm uppercase tracking-[0.18em] text-[var(--fg)] drop-shadow-md">
              {site.tagline}
            </span>
          </div>
        </div>

        {/* Bottom area: Huge 2-line name & Scroll cue */}
        <div className="flex flex-col md:flex-row items-end justify-between gap-8 mt-auto">
          {/* Two-line Display Name with Overflow-Hidden Mask Entrance */}
          <div className="flex flex-col select-none">
            {/* Line 1: ASWIN */}
            <div className="overflow-hidden">
              <motion.h1
                initial={shouldReduceMotion ? { y: 0, opacity: 1 } : { y: "105%" }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  duration: 1.1,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="font-['Bebas_Neue',sans-serif] text-[clamp(4.5rem,19vw,17rem)] leading-[0.88] text-[var(--fg)] tracking-tight drop-shadow-lg"
              >
                ASWIN
              </motion.h1>
            </div>

            {/* Line 2: KRISHNA */}
            <div className="overflow-hidden">
              <motion.h1
                initial={shouldReduceMotion ? { y: 0, opacity: 1 } : { y: "105%" }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  delay: 0.12,
                  duration: 1.1,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="font-['Bebas_Neue',sans-serif] text-[clamp(4.5rem,19vw,17rem)] leading-[0.88] text-[var(--fg)] tracking-tight drop-shadow-lg"
              >
                KRISHNA
              </motion.h1>
            </div>
          </div>

          {/* Bottom-right: Scroll Cue */}
          <div className="flex flex-col items-center gap-3 self-end pb-2 md:pb-4 pointer-events-auto">
            <span className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-[var(--muted)] font-medium">
              Scroll
            </span>
            <div className="w-[1px] h-10 bg-[var(--line)] relative overflow-hidden">
              {!shouldReduceMotion && (
                <motion.div
                  className="w-full h-4 bg-[var(--accent)]"
                  animate={{
                    y: [0, 40],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 2,
                    ease: "easeInOut",
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

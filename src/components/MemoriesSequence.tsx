"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  MotionValue,
} from "motion/react";
import TransitionLink from "./TransitionLink";
import { memoriesPhotos } from "@/data/photos";
import { useIsMobile } from "@/hooks/useIsMobile";

interface SceneConfig {
  numeral: string;
  category: "nature" | "wedding" | "casual";
  title: string;
  caption: string;
  tintColor: string; // overlay under 15% opacity
}

const SCENES: SceneConfig[] = [
  {
    numeral: "I",
    category: "nature",
    title: "Nature & Travel",
    caption: "Where the light lands first.",
    tintColor: "rgba(31, 58, 43, 0.12)", // --tint-nature
  },
  {
    numeral: "II",
    category: "wedding",
    title: "Weddings",
    caption: "The in-between moments.",
    tintColor: "rgba(176, 141, 87, 0.14)", // --tint-wedding
  },
  {
    numeral: "III",
    category: "casual",
    title: "Everyday",
    caption: "Ordinary, until it isn't.",
    tintColor: "rgba(58, 58, 58, 0.14)", // --tint-casual
  },
];

interface SceneSlideProps {
  scene: SceneConfig;
  index: number;
  scrollYProgress: MotionValue<number>;
  isMobile: boolean;
  shouldReduceMotion: boolean | null;
}

function SceneSlide({
  scene,
  index,
  scrollYProgress,
  isMobile,
  shouldReduceMotion,
}: SceneSlideProps) {
  const photo = memoriesPhotos[scene.category];
  const s = index / 3;
  const e = (index + 1) / 3;

  // Scene 0 is visible from the beginning; scenes 1 and 2 wipe over previous
  // Clip path wipe: inset(0 100% 0 0) -> inset(0% 0% 0% 0%)
  const clipInsetRight = useTransform(
    scrollYProgress,
    [s, s + 0.1],
    index === 0 ? ["0%", "0%"] : ["100%", "0%"]
  );

  // Inner image scale: 1.3 -> 1.05 (desktop only for performance)
  const imageScale = useTransform(
    scrollYProgress,
    [s, s + 0.1, e],
    isMobile || shouldReduceMotion ? [1, 1, 1] : [1.3, 1.05, 1.0]
  );

  // Numeral: fades in and slides x: -40 to 0 over [s+0.05, s+0.14]
  const numOpacity = useTransform(
    scrollYProgress,
    [s + 0.05, s + 0.14],
    [0, 1]
  );
  const numX = useTransform(
    scrollYProgress,
    [s + 0.05, s + 0.14],
    [-40, 0]
  );

  // Title + Caption: slide up 40px, fade in over [s+0.10, s+0.20]
  const textOpacity = useTransform(
    scrollYProgress,
    [s + 0.1, s + 0.2],
    [0, 1]
  );
  const textY = useTransform(scrollYProgress, [s + 0.1, s + 0.2], [40, 0]);

  // Gallery Link: fade in over [s+0.16, s+0.24]
  const linkOpacity = useTransform(
    scrollYProgress,
    [s + 0.16, s + 0.24],
    [0, 1]
  );

  const clipPathValue = useTransform(
    clipInsetRight,
    (right) => `inset(0% ${right} 0% 0%)`
  );

  return (
    <motion.div
      style={{
        clipPath: shouldReduceMotion
          ? index === 0
            ? "inset(0% 0% 0% 0%)"
            : undefined
          : clipPathValue,
        zIndex: 10 + index,
      }}
      className="absolute inset-0 w-full h-full overflow-hidden bg-black flex flex-col justify-between"
    >
      {/* Background Image Container with Scale */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          style={{ scale: imageScale }}
          className="relative w-full h-full"
        >
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            sizes="100vw"
            className="object-cover object-center"
            priority={index === 0}
          />
        </motion.div>

        {/* 35% dark overlay for readability */}
        <div className="absolute inset-0 bg-black/40" />

        {/* Scene-specific tint (under 15% opacity) */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ backgroundColor: scene.tintColor }}
        />

        {/* Gradient vignettes */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/50" />
      </div>

      {/* Stage Content */}
      <div className="relative z-20 flex flex-col justify-between h-full w-full max-w-[1440px] mx-auto px-6 sm:px-10 md:px-16 py-8 md:py-12 pointer-events-none">
        {/* Top bar with Chapter label */}
        <div className="flex justify-between items-center">
          <span className="text-[11px] sm:text-xs uppercase tracking-[0.18em] text-[var(--accent)] font-medium">
            03 / Memories
          </span>
          <span className="text-[11px] sm:text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
            Scene {scene.numeral} · {scene.title}
          </span>
        </div>

        {/* Center / Left Content */}
        <div className="my-auto flex flex-col items-start max-w-xl">
          {/* Huge Outlined Numeral */}
          <motion.div
            style={{
              opacity: shouldReduceMotion ? 1 : numOpacity,
              x: shouldReduceMotion ? 0 : numX,
            }}
            className="font-['Bebas_Neue',sans-serif] text-[clamp(6rem,16vw,14rem)] leading-none text-transparent stroke-numeral select-none"
            style-stroke="1px var(--accent)"
          >
            <span
              className="text-transparent"
              style={{
                WebkitTextStroke: "1.5px var(--accent)",
              }}
            >
              {scene.numeral}
            </span>
          </motion.div>

          {/* Title and Caption */}
          <motion.div
            style={{
              opacity: shouldReduceMotion ? 1 : textOpacity,
              y: shouldReduceMotion ? 0 : textY,
            }}
            className="-mt-4 md:-mt-6"
          >
            <h2 className="font-['Bebas_Neue',sans-serif] text-[clamp(2.5rem,7vw,6.5rem)] leading-[0.9] text-[var(--fg)] tracking-tight">
              {scene.title}
            </h2>
            <p className="font-serif italic text-[clamp(1.2rem,2.8vw,2.2rem)] text-[var(--fg)] mt-3 leading-snug">
              &ldquo;{scene.caption}&rdquo;
            </p>
          </motion.div>

          {/* Gallery Link */}
          <motion.div
            style={{
              opacity: shouldReduceMotion ? 1 : linkOpacity,
            }}
            className="mt-6 md:mt-8 pointer-events-auto"
          >
            <TransitionLink
              href={`/gallery?category=${scene.category}`}
              className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-[var(--accent)] hover:text-[var(--fg)] border-b border-[var(--accent)] pb-1 transition-colors"
            >
              View the gallery →
            </TransitionLink>
          </motion.div>
        </div>

        {/* Empty bottom spacer to ensure balance */}
        <div className="h-8" />
      </div>
    </motion.div>
  );
}

export default function MemoriesSequence() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const shouldReduceMotion = useReducedMotion();
  const [activeSceneIdx, setActiveSceneIdx] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Track active scene indicator
  useEffect(() => {
    return scrollYProgress.on("change", (latest) => {
      if (latest < 0.33) {
        setActiveSceneIdx(0);
      } else if (latest < 0.66) {
        setActiveSceneIdx(1);
      } else {
        setActiveSceneIdx(2);
      }
    });
  }, [scrollYProgress]);

  return (
    <section
      ref={containerRef}
      className={`relative w-full ${
        isMobile ? "h-[600vh]" : "h-[900vh]"
      } bg-black`}
    >
      {/* Single Sticky Stage */}
      <div className="sticky top-0 h-svh w-full overflow-hidden">
        {/* Render the 3 scenes stacked */}
        {SCENES.map((scene, idx) => (
          <SceneSlide
            key={scene.numeral}
            scene={scene}
            index={idx}
            scrollYProgress={scrollYProgress}
            isMobile={isMobile}
            shouldReduceMotion={shouldReduceMotion}
          />
        ))}

        {/* Bottom-Center Scene Indicator: I · II · III */}
        <div
          aria-label="Scene progress indicator"
          className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-40 flex items-center gap-4 px-4 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-[var(--line)] text-xs uppercase tracking-widest pointer-events-none"
        >
          {SCENES.map((scene, idx) => {
            const isActive = activeSceneIdx === idx;
            return (
              <div key={scene.numeral} className="flex items-center gap-4">
                <span
                  className={`transition-colors duration-300 font-semibold ${
                    isActive
                      ? "text-[var(--accent)] scale-110"
                      : "text-[var(--muted)] opacity-60"
                  }`}
                >
                  {scene.numeral}
                </span>
                {idx < SCENES.length - 1 && (
                  <span className="w-1 h-1 rounded-full bg-[var(--line)]" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

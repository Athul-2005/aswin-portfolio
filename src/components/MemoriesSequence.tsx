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
import { Photo, Category, memoriesPhotos as fallbackMemoriesPhotos } from "@/data/photos";
import { useIsMobile } from "@/hooks/useIsMobile";

interface SceneConfig {
  numeral: string;
  category: Category;
  title: string;
  caption: string;
  tintColor: string;
}

const DEFAULT_SCENES: SceneConfig[] = [
  {
    numeral: "I",
    category: "nature",
    title: "Nature & Travel",
    caption: "Where the light lands first.",
    tintColor: "rgba(31, 58, 43, 0.12)",
  },
  {
    numeral: "II",
    category: "wedding",
    title: "Weddings",
    caption: "The in-between moments.",
    tintColor: "rgba(176, 141, 87, 0.14)",
  },
  {
    numeral: "III",
    category: "casual",
    title: "Everyday",
    caption: "Ordinary, until it isn't.",
    tintColor: "rgba(58, 58, 58, 0.14)",
  },
];

interface SceneSlideProps {
  scene: SceneConfig;
  photo: Photo;
  index: number;
  totalScenes: number;
  scrollYProgress: MotionValue<number>;
  isMobile: boolean;
  shouldReduceMotion: boolean | null;
}

function SceneSlide({
  scene,
  photo,
  index,
  totalScenes,
  scrollYProgress,
  isMobile,
  shouldReduceMotion,
}: SceneSlideProps) {
  const s = totalScenes > 0 ? index / totalScenes : 0;
  const e = totalScenes > 0 ? (index + 1) / totalScenes : 1;

  // Scene 0 is visible from the beginning; subsequent scenes wipe over previous
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

  // Numeral: fades in and slides x: -40 to 0
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

  // Title + Caption: slide up 40px, fade in
  const textOpacity = useTransform(
    scrollYProgress,
    [s + 0.1, s + 0.2],
    [0, 1]
  );
  const textY = useTransform(scrollYProgress, [s + 0.1, s + 0.2], [40, 0]);

  // Gallery Link: fade in
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
            Scene {scene.numeral} · {photo.title || scene.title}
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
              {photo.title || scene.title}
            </h2>
            <p className="font-serif italic text-[clamp(1.2rem,2.8vw,2.2rem)] text-[var(--fg)] mt-3 leading-snug">
              &ldquo;{photo.caption || scene.caption}&rdquo;
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

interface MemoriesSequenceProps {
  photos?: Record<Category, Photo | null>;
}

export default function MemoriesSequence({
  photos = fallbackMemoriesPhotos,
}: MemoriesSequenceProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const shouldReduceMotion = useReducedMotion();
  const [, setActiveSceneIdx] = useState(0);

  // Filter available scenes where photo is present (Rule 11: empty state - missing memory scene is skipped)
  const activeScenes = DEFAULT_SCENES.filter((scene) => !!photos?.[scene.category]).map(
    (scene, idx) => ({
      ...scene,
      numeral: ["I", "II", "III"][idx] || "I",
    })
  );

  const totalScenes = activeScenes.length;

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Track active scene indicator
  useEffect(() => {
    if (totalScenes === 0) return;
    return scrollYProgress.on("change", (latest) => {
      const idx = Math.min(
        Math.floor(latest * totalScenes),
        totalScenes - 1
      );
      setActiveSceneIdx(Math.max(0, idx));
    });
  }, [scrollYProgress, totalScenes]);

  if (totalScenes === 0) {
    return null;
  }

  const heightClass =
    totalScenes === 1
      ? "h-[200vh]"
      : totalScenes === 2
      ? isMobile
        ? "h-[400vh]"
        : "h-[600vh]"
      : isMobile
      ? "h-[600vh]"
      : "h-[900vh]";

  return (
    <section
      ref={containerRef}
      className={`relative w-full ${heightClass} bg-black`}
    >
      {/* Single Sticky Stage */}
      <div className="sticky top-0 h-svh w-full overflow-hidden">
        {activeScenes.map((scene, index) => {
          const photo = photos[scene.category]!;
          return (
            <SceneSlide
              key={scene.category}
              scene={scene}
              photo={photo}
              index={index}
              totalScenes={totalScenes}
              scrollYProgress={scrollYProgress}
              isMobile={isMobile}
              shouldReduceMotion={shouldReduceMotion}
            />
          );
        })}
      </div>
    </section>
  );
}

"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  MotionValue,
} from "motion/react";

interface QuoteRevealProps {
  chapterLabel?: string;
  text: string;
  author: string;
  bgImage?: string;
  bgAlt?: string;
}

interface WordSpanProps {
  word: string;
  index: number;
  total: number;
  scrollYProgress: MotionValue<number>;
  shouldReduceMotion: boolean | null;
}

function WordSpan({
  word,
  index,
  total,
  scrollYProgress,
  shouldReduceMotion,
}: WordSpanProps) {
  // Word i of n: scrubbed opacity 0.15 to 1 over [i/n * 0.8, i/n * 0.8 + 0.2]
  const start = (index / total) * 0.8;
  const end = Math.min(start + 0.2, 0.95);

  const opacity = useTransform(scrollYProgress, [start, end], [0.15, 1]);

  if (shouldReduceMotion) {
    return <span className="inline-block mr-[0.3em] opacity-100">{word}</span>;
  }

  return (
    <motion.span
      style={{ opacity }}
      className="inline-block mr-[0.3em] transition-colors"
    >
      {word}
    </motion.span>
  );
}

export default function QuoteReveal({
  chapterLabel = "02 / Spark",
  text,
  author,
  bgImage = "/photos/nature/emerald-lake.jpg",
  bgAlt = "Background image",
}: QuoteRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Background photo opacity: 0 to 0.25 over first 30% of scroll progress
  const bgOpacity = useTransform(scrollYProgress, [0, 0.3], [0, 0.25]);

  // Author line fades in over 0.85 to 1.0 of progress
  const authorOpacity = useTransform(scrollYProgress, [0.85, 1], [0, 1]);
  const authorY = useTransform(scrollYProgress, [0.85, 1], [15, 0]);

  const words = text.split(/\s+/).filter(Boolean);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[220vh] bg-[var(--bg)]"
    >
      {/* Sticky stage (sticky top-0 h-svh) */}
      <div className="sticky top-0 h-svh w-full overflow-hidden flex flex-col justify-between p-6 sm:p-12 md:p-16">
        {/* Background dimmed & heavily blurred image */}
        {bgImage && (
          <motion.div
            className="absolute inset-0 pointer-events-none z-0"
            style={{ opacity: shouldReduceMotion ? 0.2 : bgOpacity }}
          >
            <Image
              src={bgImage}
              alt={bgAlt}
              fill
              sizes="100vw"
              className="object-cover object-center filter blur-xl scale-105"
            />
            {/* Dark overlay for contrast */}
            <div className="absolute inset-0 bg-black/60" />
          </motion.div>
        )}

        {/* Chapter Numeral / Label in corner */}
        <div className="relative z-10 flex justify-between items-center w-full max-w-[1440px] mx-auto">
          <span className="text-[11px] sm:text-xs uppercase tracking-[0.18em] text-[var(--accent)] font-medium">
            {chapterLabel}
          </span>
          <span className="text-[11px] sm:text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
            Aswin Krishna
          </span>
        </div>

        {/* Center Quote Area */}
        <div className="relative z-10 max-w-[55ch] mx-auto text-center my-auto px-4">
          <blockquote className="font-serif italic text-[clamp(1.6rem,4.2vw,3.6rem)] leading-[1.25] text-[var(--fg)] tracking-normal">
            &ldquo;
            {words.map((word, i) => (
              <WordSpan
                key={`${word}-${i}`}
                word={word}
                index={i}
                total={words.length}
                scrollYProgress={scrollYProgress}
                shouldReduceMotion={shouldReduceMotion}
              />
            ))}
            &rdquo;
          </blockquote>

          {/* Author line */}
          <motion.div
            style={{
              opacity: shouldReduceMotion ? 1 : authorOpacity,
              y: shouldReduceMotion ? 0 : authorY,
            }}
            className="mt-8 flex items-center justify-center gap-4 text-xs uppercase tracking-[0.2em] text-[var(--muted)]"
          >
            <span className="w-8 h-[1px] bg-[var(--accent)]" />
            <span>{author}</span>
            <span className="w-8 h-[1px] bg-[var(--accent)]" />
          </motion.div>
        </div>

        {/* Bottom subtle progress hint */}
        <div className="relative z-10 flex justify-center items-center w-full max-w-[1440px] mx-auto">
          <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--muted)] opacity-60">
            Scroll to reveal
          </span>
        </div>
      </div>
    </div>
  );
}

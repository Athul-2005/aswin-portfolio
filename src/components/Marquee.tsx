"use client";

import { useReducedMotion } from "motion/react";
import { marqueePlaces } from "@/data/content";

export default function Marquee() {
  const shouldReduceMotion = useReducedMotion();

  // Create an extended repeated array for smooth infinite marquee
  const items = [...marqueePlaces, ...marqueePlaces, ...marqueePlaces, ...marqueePlaces];

  if (shouldReduceMotion) {
    return (
      <section
        aria-label="Locations"
        className="w-full py-8 border-y border-[var(--line)] bg-[var(--bg)] overflow-hidden"
      >
        <div className="flex flex-wrap justify-center gap-6 px-4 text-center">
          {marqueePlaces.map((place, idx) => (
            <span
              key={`${place}-${idx}`}
              className="font-['Bebas_Neue',sans-serif] text-2xl md:text-4xl uppercase tracking-wider text-[var(--muted)]"
            >
              {place}
            </span>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section
      aria-label="Locations Marquee"
      className="w-full py-6 md:py-8 border-y border-[var(--line)] bg-[var(--bg)] overflow-hidden select-none group"
    >
      <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused]">
        <div className="flex shrink-0 items-center gap-8 md:gap-12 pr-8 md:pr-12">
          {items.map((place, idx) => (
            <div key={`${place}-${idx}`} className="flex items-center gap-8 md:gap-12">
              <span
                className="font-['Bebas_Neue',sans-serif] text-4xl sm:text-6xl md:text-7xl lg:text-8xl uppercase tracking-wider text-transparent stroke-text hover:text-[var(--fg)] transition-colors duration-300"
                style={{
                  WebkitTextStroke: "1px var(--muted)",
                }}
              >
                {place}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] shrink-0 opacity-80" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

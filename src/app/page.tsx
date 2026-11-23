import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import QuoteReveal from "@/components/QuoteReveal";
import MemoriesSequence from "@/components/MemoriesSequence";
import { quotes } from "@/data/content";

export default function Home() {
  return (
    <main id="main" className="w-full flex flex-col">
      {/* Chapter 0: Welcome (Hero) */}
      <Hero />

      {/* Marquee Strip directly under the Hero */}
      <Marquee />

      {/* Chapter 1: Spark (opening quote) */}
      <QuoteReveal
        chapterLabel="02 / Spark"
        text={quotes.spark.text}
        author={quotes.spark.author}
        bgImage="/photos/nature/emerald-lake.jpg"
        bgAlt="Emerald lake misty scenery"
      />

      {/* Chapter 2: Memories (three scenes, continuous sequence) */}
      <MemoriesSequence />

      {/* Placeholder section for upcoming Chapters 3 and 4 */}
      <section className="py-24 px-4 sm:px-8 md:px-12 max-w-[1440px] mx-auto w-full text-center">
        <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)] mb-4">
          Chapter 04 / Next Phase: Promise & Say Hello
        </p>
        <span className="inline-block mt-2 text-xs uppercase tracking-[0.18em] text-[var(--accent)]">
          Phase 4: Memories Complete
        </span>
      </section>
    </main>
  );
}

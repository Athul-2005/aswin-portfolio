import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import QuoteReveal from "@/components/QuoteReveal";
import MemoriesSequence from "@/components/MemoriesSequence";
import SayHello from "@/components/SayHello";
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

      {/* Chapter 3: Promise (closing quote) */}
      <QuoteReveal
        chapterLabel="04 / Promise"
        text={quotes.promise.text}
        author={quotes.promise.author}
        bgImage="/photos/wedding/couple-dusk.jpg"
        bgAlt="Newlywed couple embrace at dusk"
      />

      {/* Chapter 4: Say hello (contact) */}
      <SayHello />
    </main>
  );
}

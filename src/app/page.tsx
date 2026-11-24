import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import QuoteReveal from "@/components/QuoteReveal";
import MemoriesSequence from "@/components/MemoriesSequence";
import SayHello from "@/components/SayHello";
import { quotes, site } from "@/data/content";
import { getPhotos, getMemoriesPhotos } from "@/lib/photos";

export default async function Home() {
  const [heroPhotos, memoriesPhotos] = await Promise.all([
    getPhotos("hero"),
    getMemoriesPhotos(),
  ]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "Aswin Krishna Photography",
    image: "https://aswinkrishna.photography/opengraph-image",
    description:
      "Story-driven photography portfolio by Aswin Krishna based in Toronto, Ontario. Nature, travel, weddings, and casual lifestyle captures.",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Toronto",
      addressRegion: "ON",
      addressCountry: "CA",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "43.6532",
      longitude: "-79.3832",
    },
    url: "https://aswinkrishna.photography",
    telephone: "",
    priceRange: "$$$",
    areaServed: [
      "Toronto",
      "Greater Toronto Area",
      "Mississauga",
      "Oakville",
      "Vaughan",
      "Markham",
      "Ontario",
      "Canada",
    ],
    sameAs: [site.instagram],
  };

  return (
    <main id="main" className="w-full flex flex-col">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Chapter 0: Welcome (Hero) */}
      <Hero photos={heroPhotos} />

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
      <MemoriesSequence photos={memoriesPhotos} />

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

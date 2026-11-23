import Image from "next/image";
import { recentArts } from "@/data/recent";
import { site } from "@/data/content";

export const metadata = {
  title: "Recent Arts | Aswin Krishna Photography Toronto",
  description:
    "Latest photography pieces and Instagram journal by Aswin Krishna in Toronto, Ontario.",
};

export default function RecentPage() {
  const featured = recentArts[0];
  const gridItems = recentArts.slice(1);

  return (
    <main
      id="main"
      className="pt-28 pb-20 px-4 sm:px-8 md:px-12 max-w-[1440px] mx-auto w-full min-h-svh flex flex-col"
    >
      {/* Header */}
      <header className="mb-12">
        <span className="text-xs uppercase tracking-[0.2em] text-[var(--accent)] font-medium">
          Latest work · October 2026
        </span>
        <h1 className="font-['Bebas_Neue',sans-serif] text-[clamp(3.5rem,12vw,9rem)] leading-[0.9] text-[var(--fg)] tracking-tight mt-2">
          RECENT ARTS
        </h1>
        <p className="text-xs sm:text-sm uppercase tracking-[0.18em] text-[var(--muted)] mt-4">
          Unfiltered captures, fleeting moments, and journal entries from Toronto and the road
        </p>
      </header>

      {/* Featured Piece (Full-bleed card) */}
      {featured && (
        <section aria-label="Featured Piece" className="mb-16 md:mb-24">
          <a
            href={featured.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group block relative w-full overflow-hidden border border-[var(--line)] bg-[var(--bg-soft)]"
          >
            <div className="relative w-full aspect-[16/9] md:aspect-[21/9] overflow-hidden">
              <Image
                src={featured.src}
                alt={featured.alt}
                fill
                priority
                sizes="(max-width: 1440px) 100vw, 1440px"
                className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <span className="text-xs uppercase tracking-[0.2em] text-[var(--accent)] font-medium">
                  Featured · {featured.date}
                </span>
                <h2 className="font-['Bebas_Neue',sans-serif] text-3xl sm:text-5xl text-[var(--fg)] mt-1 tracking-wide">
                  {featured.title}
                </h2>
              </div>
              <span className="text-xs uppercase tracking-[0.18em] text-[var(--fg)] group-hover:text-[var(--accent)] transition-colors inline-flex items-center gap-1.5 self-start sm:self-auto border-b border-transparent group-hover:border-[var(--accent)] pb-0.5">
                View on Instagram ↗
              </span>
            </div>
          </a>
        </section>
      )}

      {/* Staggered 2-Column Grid */}
      <section aria-label="Recent Gallery Grid" className="mb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">
          {gridItems.map((item, idx) => {
            // Second column (odd index in 0-indexed slice) is offset down by 6rem on desktop
            const isSecondColumn = idx % 2 === 1;

            return (
              <a
                key={item.id}
                href={item.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`group block border border-[var(--line)] bg-[var(--bg-soft)] overflow-hidden transition-all duration-300 hover:border-[var(--muted)] ${
                  isSecondColumn ? "md:mt-24" : ""
                }`}
              >
                <div className="relative w-full aspect-[4/3] overflow-hidden">
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
                </div>

                <div className="p-6 flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] uppercase tracking-[0.18em] text-[var(--accent)] font-medium">
                      {item.date}
                    </span>
                    <h3 className="font-['Bebas_Neue',sans-serif] text-2xl sm:text-3xl text-[var(--fg)] mt-1 tracking-wide">
                      {item.title}
                    </h3>
                  </div>

                  <div className="mt-6 pt-4 border-t border-[var(--line)] flex items-center justify-between text-xs uppercase tracking-[0.18em] text-[var(--muted)] group-hover:text-[var(--fg)]">
                    <span>Aswin Krishna</span>
                    <span className="text-[var(--accent)] group-hover:translate-x-1 transition-transform">
                      View on Instagram ↗
                    </span>
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </section>

      {/* Page Footer Action */}
      <section className="pt-12 pb-16 border-t border-[var(--line)] text-center flex flex-col items-center">
        <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)] mb-6">
          Follow along with the journey
        </p>
        <a
          href={site.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-10 py-5 border border-[var(--fg)] text-xs sm:text-sm uppercase tracking-[0.2em] font-medium text-[var(--fg)] hover:bg-[var(--fg)] hover:text-black transition-colors duration-300 focus-visible:outline-1 focus-visible:outline-[var(--accent)]"
        >
          Follow {site.instagramHandle} on Instagram ↗
        </a>
      </section>
    </main>
  );
}

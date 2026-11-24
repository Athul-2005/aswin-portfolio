import Image from "next/image";
import { getRecentPhotos } from "@/lib/photos";
import { site } from "@/data/content";

export const metadata = {
  title: "Recent Arts | Aswin Krishna Photography Toronto",
  description:
    "Latest photography pieces and Instagram journal by Aswin Krishna in Toronto, Ontario.",
};

export default async function RecentPage() {
  const arts = await getRecentPhotos();
  const hasArts = arts.length > 0;
  const featured = hasArts ? arts[0] : null;
  const gridItems = hasArts ? arts.slice(1) : [];

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

      {/* Empty State */}
      {!hasArts && (
        <div className="py-24 text-center border border-[var(--line)] bg-[var(--bg-soft)] p-8 my-auto">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
            No recent arts uploaded yet.
          </p>
          <a
            href={site.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block text-xs uppercase tracking-[0.18em] text-[var(--accent)] hover:text-[var(--fg)] underline transition-colors"
          >
            Follow on Instagram {site.instagramHandle} →
          </a>
        </div>
      )}

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
              <span className="text-xs uppercase tracking-[0.18em] text-[var(--accent)] group-hover:text-[var(--fg)] transition-colors inline-flex items-center gap-2">
                Open in Instagram ↗
              </span>
            </div>
          </a>
        </section>
      )}

      {/* Grid of Remaining Pieces */}
      {gridItems.length > 0 && (
        <section
          aria-label="Recent captures grid"
          className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-20"
        >
          {gridItems.map((item, idx) => (
            <article
              key={item.id}
              className="border border-[var(--line)] bg-[var(--bg-soft)] group flex flex-col overflow-hidden"
            >
              <div className="relative w-full aspect-[4/3] overflow-hidden bg-black">
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  loading={idx < 2 ? "eager" : "lazy"}
                  className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              <div className="p-6 flex flex-col justify-between flex-1 gap-4">
                <div className="flex justify-between items-start gap-4">
                  <h3 className="font-['Bebas_Neue',sans-serif] text-2xl sm:text-3xl text-[var(--fg)] tracking-wide">
                    {item.title}
                  </h3>
                  <span className="text-[11px] uppercase tracking-[0.18em] text-[var(--muted)] font-mono shrink-0">
                    {item.date}
                  </span>
                </div>

                <div className="pt-2 border-t border-[var(--line)] flex justify-between items-center text-xs uppercase tracking-[0.18em]">
                  <span className="text-[var(--muted)]">Journal entry</span>
                  <a
                    href={item.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--accent)] hover:text-[var(--fg)] transition-colors inline-flex items-center gap-1.5 focus-visible:outline-1 focus-visible:outline-[var(--accent)]"
                    aria-label={`View ${item.title} on Instagram`}
                  >
                    <span>View post</span>
                    <span aria-hidden="true">↗</span>
                  </a>
                </div>
              </div>
            </article>
          ))}
        </section>
      )}

      {/* Footer Note */}
      <div className="mt-auto pt-10 border-t border-[var(--line)] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
        <span>Follow for weekly frames & stories</span>
        <a
          href={site.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[var(--fg)] hover:text-[var(--accent)] transition-colors"
        >
          {site.instagramHandle}
        </a>
      </div>
    </main>
  );
}

import { galleryPhotos } from "@/data/photos";

export const metadata = {
  title: "Gallery | Aswin Krishna Photography Toronto",
  description: "Portfolio gallery of nature, wedding, and casual photography in Toronto and beyond.",
};

export default function GalleryPage() {
  return (
    <main id="main" className="pt-24 pb-12 px-4 sm:px-8 md:px-12 max-w-[1440px] mx-auto w-full min-h-svh">
      <section className="py-8">
        <h1 className="font-['Bebas_Neue',sans-serif] text-[clamp(3rem,11vw,9rem)] leading-[0.9] text-[var(--fg)] mb-6">
          GALLERY
        </h1>
        <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)] mb-8">
          Total items: {galleryPhotos.length} photos ready in catalog
        </p>
        <div className="flex flex-wrap gap-4 mb-12">
          {["All", "Nature", "Wedding", "Casual"].map((filter) => (
            <span
              key={filter}
              className="px-4 py-2 text-xs uppercase tracking-[0.18em] border border-[var(--line)] text-[var(--fg)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors cursor-pointer"
            >
              {filter}
            </span>
          ))}
        </div>
      </section>
    </main>
  );
}

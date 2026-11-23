import TransitionLink from "./TransitionLink";
import SoundToggle from "./SoundToggle";
import { site } from "@/data/content";

export default function Footer() {
  return (
    <footer className="w-full bg-[#000000] border-t border-[var(--line)] py-12 md:py-16 text-[var(--muted)]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 md:px-12">
        {/* Top Wordmark */}
        <div className="mb-12">
          <TransitionLink
            href="/"
            className="block font-['Bebas_Neue',sans-serif] text-[clamp(2.5rem,8vw,7rem)] leading-none text-[var(--fg)] hover:text-[var(--accent)] transition-colors"
          >
            ASWIN KRISHNA
          </TransitionLink>
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)] mt-2">
            {site.tagline}
          </p>
        </div>

        {/* Links & Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 py-8 border-y border-[var(--line)] text-xs uppercase tracking-[0.18em]">
          <div>
            <span className="text-[var(--fg)] block mb-3 font-semibold">Navigation</span>
            <ul className="space-y-2">
              <li>
                <TransitionLink href="/" className="hover:text-[var(--accent)] hover:underline">
                  Home
                </TransitionLink>
              </li>
              <li>
                <TransitionLink href="/gallery" className="hover:text-[var(--accent)] hover:underline">
                  Gallery
                </TransitionLink>
              </li>
              <li>
                <TransitionLink href="/recent" className="hover:text-[var(--accent)] hover:underline">
                  Recent Arts
                </TransitionLink>
              </li>
              <li>
                <TransitionLink href="/contact" className="hover:text-[var(--accent)] hover:underline">
                  Contact
                </TransitionLink>
              </li>
            </ul>
          </div>

          <div>
            <span className="text-[var(--fg)] block mb-3 font-semibold">Connect</span>
            <ul className="space-y-2">
              <li>
                <a
                  href={`mailto:${site.email}`}
                  className="hover:text-[var(--accent)] hover:underline lowercase tracking-normal"
                >
                  {site.email}
                </a>
              </li>
              <li>
                <a
                  href={site.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[var(--accent)] hover:underline"
                >
                  Instagram ↗
                </a>
              </li>
              <li>
                <a
                  href={site.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[var(--accent)] hover:underline"
                >
                  WhatsApp ↗
                </a>
              </li>
            </ul>
          </div>

          <div>
            <span className="text-[var(--fg)] block mb-3 font-semibold">Location</span>
            <p className="normal-case tracking-normal text-[var(--muted)] leading-relaxed">
              Based in Toronto, Ontario.<br />
              Available across GTA & travel worldwide.
            </p>
          </div>

          <div className="flex flex-col justify-start">
            <span className="text-[var(--fg)] block mb-3 font-semibold">Preferences</span>
            <SoundToggle />
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs uppercase tracking-widest text-[var(--muted)] gap-4">
          <span>© 2026 Aswin Krishna · All rights reserved</span>
          <span>Toronto, Ontario, Canada</span>
        </div>
      </div>
    </footer>
  );
}

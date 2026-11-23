# BRIEF: Aswin Krishna, Photography Portfolio (Next.js)

> Save this file in the project root as `BRIEF.md`.
> Start every Antigravity session with: **"Read BRIEF.md. Do Phase N only, then stop and report."**

---

## 0. Instructions for the agent (read first)

- Work in the **phases in section 11**. Do ONE phase per request, then STOP.
- Before finishing a phase: run the dev server, open it in the browser, screenshot at **390px and 1440px**, check for horizontal scroll and console errors, test with reduced motion on, fix problems, then suggest a git commit message.
- Do not add libraries beyond those listed in section 10 without asking.
- Never invent colors, fonts or spacing. Use the tokens in section 3.
- If something in this brief is ambiguous, pick the simplest option, say what you chose, and continue.
- Placeholder content is marked `[PLACEHOLDER]`. Keep it in one place (`src/data/content.ts`) so it is easy to replace.
- This project uses Next.js 16 and React 19. If unsure about an API, check the
  current Next.js docs (nextjs.org/docs) instead of relying on older patterns.
  Remember that params and searchParams are async in server components.
---

## 1. Project

**Client:** Aswin Krishna, photographer based in **Toronto, Ontario, Canada**.
**Genres:** nature and travel, weddings, casual/everyday.
**Goal:** a story-driven portfolio that feels like a short film as you scroll, then makes the visitor want to book Aswin.
**Tone:** warm, cinematic, personal. Not corporate, not a template.

**Reference:** flicksbykarol.com. Take the *feel*, not the content or layout one-to-one:
- Pure black page, full-bleed photography, huge confident type, almost no UI chrome
- Photos carry the design; text is minimal
- A looping marquee strip, numbered process steps (I to IV), a "copy email" action
- A small signature detail: a camera shutter sound with an on/off toggle
- "Skip to content" link, a minimal footer with socials

---

## 2. Design principles

1. **Photos first.** Every layout decision serves the image.
2. **One idea per screen.** Each scroll chapter has one emotion and one signature motion.
3. **Restraint.** Black, off-white, one warm accent. No gradients, no shadows, no boxed cards, no icon grids, no emoji.
4. **Slow and smooth.** Long eases, no bounce. Motion should feel like a camera move, not a UI animation.
5. **Mobile is the main device.** Design at 390px first.

---

## 3. Design system

### Color tokens
| Token | Value | Use |
|---|---|---|
| `--bg` | `#000000` | page background |
| `--bg-soft` | `#0b0b0b` | alternate sections |
| `--fg` | `#f2efe9` | primary text (warm off-white) |
| `--muted` | `#8a8780` | secondary text, labels |
| `--line` | `#26241f` | hairlines |
| `--accent` | `#c8a96a` | links, hover, small highlights (muted gold) |
| `--tint-nature` | `#1f3a2b` | scene tint, deep green |
| `--tint-wedding` | `#b08d57` | scene tint, warm gold |
| `--tint-casual` | `#3a3a3a` | scene tint, neutral gray |

Scene tints are overlays at **under 15% opacity**.

### Typography (load with `next/font/google`)
- **Display:** `Bebas Neue`, uppercase, tight leading (0.9). Name, page titles, chapter numerals.
- **Quote/serif:** `Cormorant Garamond`, italic, for quotes and captions.
- **UI/body:** `Inter`, 400/500, for nav, labels, paragraphs.

Fluid sizes (use `clamp()`):
- Name: `clamp(4.5rem, 19vw, 17rem)`
- Page title: `clamp(3rem, 11vw, 9rem)`
- Quote: `clamp(1.6rem, 4.2vw, 3.6rem)`
- Label: 0.75rem, uppercase, letter-spacing 0.18em, color `--muted`
- Body: 1rem to 1.125rem, line-height 1.6

### Layout
- Page side padding: `1rem` mobile, `2rem` tablet, `3rem` desktop
- Max content width for text: `60ch`; images may be full-bleed
- Gap between gallery images: `8px`
- Sections use `min-h-svh` (never `100vh`)

### Style details
- Links: underline on hover only, color shifts to `--accent`
- Buttons: 1px `--fg` outline, uppercase label, no radius; fill inverts on hover
- Selection color: `--accent` background, black text
- Custom scrollbar: thin, `--line` track
- Image placeholders: `--bg-soft` with a blur-up (`placeholder="blur"` or a tiny blurDataURL)

---

## 4. Sitemap

| Route | Page | Purpose |
|---|---|---|
| `/` | Home | The story (section 5) |
| `/gallery` | Gallery | All work, filter by category (`?category=nature\|wedding\|casual`) |
| `/recent` | Recent Arts | Latest pieces plus links to Instagram posts |
| `/contact` | Contact | How to reach Aswin, process, location |

**Nav (fixed top):** name/logo "AK" or "Aswin Krishna" on the left. Right: Home, Gallery, Recent Arts, Contact. On mobile, a "Menu" button opens a fullscreen overlay with large links that stagger in. Nav is transparent over the hero and gets a subtle blur background after scrolling 80px.

---

## 5. Home page: the story

A fixed thin **scroll progress line** runs down the right edge (1px, `--accent`), driven by `useScroll`. Each chapter has a tiny label in a corner, e.g. `01 / Welcome`, `02 / Spark`, `03 / Memories`, `04 / Promise`, `05 / Say hello`.

### Chapter 0: Welcome (hero)
- Fullscreen (`min-h-svh`). Background: 3 hero photos stacked, crossfading every ~5s, each with a slow Ken Burns zoom (scale 1.12 to 1). Darken with a 35% black overlay for legibility. First image uses `priority`.
- Huge display name on two lines: **ASWIN** / **KRISHNA**, overlapping the bottom-left edge of the hero. Each line slides up from an `overflow-hidden` mask, stagger 0.12s, 1.1s duration, ease `[0.22, 1, 0.36, 1]`.
- Top-left under the nav: label `Photography / Toronto, Ontario`.
- Bottom-right: scroll cue, a 1px vertical line with a looping opacity pulse and the word "Scroll".
- As the user scrolls out, the hero image moves down slightly (parallax, `y: 0 to 15%`) and the name fades.
- **Marquee strip** directly under the hero: infinite horizontal loop of Toronto-area places `[PLACEHOLDER]`: High Park · Scarborough Bluffs · Toronto Islands · Distillery District · Kensington Market · Niagara · Algonquin · Muskoka. Display font, large, outlined text, separators are small dots. Pauses on hover. Disabled for reduced motion.

### Chapter 1: Spark (opening quote)
- Wrapper `h-[220vh]`; inside it, a `sticky top-0 h-svh` stage. Black background that gradually reveals a heavily blurred, dimmed photo (opacity 0 to 0.25 over the first 30% of progress).
- Quote is centered in the serif italic. **Words reveal one by one, tied to scroll** (scrubbed): each word's opacity goes `0.15 to 1`; word `i` of `n` uses range `[i/n*0.8, i/n*0.8 + 0.2]` of `scrollYProgress`.
- After the last word, the author line fades in (progress 0.85 to 1).
- Build this as a reusable **`QuoteReveal`** component (props: `text`, `author`, `bgImage`). It is used again in Chapter 3 so the story feels bookended.

### Chapter 2: Memories (three scenes, one continuous sequence)
This is the heart of the site. One tall wrapper (`h-[900vh]` desktop, `h-[600vh]` mobile) containing a **single sticky stage** (`sticky top-0 h-svh overflow-hidden`). Three scenes are stacked inside it; each later scene wipes over the previous one so the sequence feels continuous.

| Scene | Numeral | Title | Mood | Caption `[PLACEHOLDER]` |
|---|---|---|---|---|
| 1 | I | Nature & Travel | deep green tint | "Where the light lands first." |
| 2 | II | Weddings | warm gold tint | "The in-between moments." |
| 3 | III | Everyday | neutral gray tint | "Ordinary, until it isn't." |

For scene `i` (0, 1, 2) with `s = i/3` and `e = (i+1)/3` of the wrapper's `scrollYProgress`:
- Image reveal (`clip-path: inset(0 100% 0 0)` to `inset(0)`, inner image scale 1.3 to 1.05): `[s, s+0.1]` (scene 1 enters from black)
- Numeral (huge, outlined display text, fades in and slides from x -40 to 0): `[s+0.05, s+0.14]`
- Title + caption (slide up 40px, fade in): `[s+0.10, s+0.20]`
- "View the gallery →" link (fade in), links to `/gallery?category=<slug>`: `[s+0.16, s+0.24]`
- Hold until `e`, then the next scene wipes over it.

A small indicator at the bottom-center shows I · II · III with the active one highlighted.
**Mobile (under 768px):** keep the same structure, but use a shorter wrapper and simpler transforms (no scale), for performance.

### Chapter 3: Promise (closing quote)
Reuse `QuoteReveal` with the closing quote and a different background photo.

### Chapter 4: Say hello (contact)
- Fullscreen. Display text: **LET'S MAKE A MEMORY.** (each word slides up on enter)
- Below: email with a **"Copy email"** button (shows "Copied" for 2s), Instagram link, WhatsApp link.
- A large **magnetic button** "Get in touch" linking to `/contact`.
- Footer slides up beneath (section 7).

---

## 6. Other pages

### `/gallery`
- Huge page title **GALLERY**, then filter chips: All · Nature · Wedding · Casual (active chip filled with `--fg`). Active filter lives in the URL (`?category=`). Wrap the `useSearchParams` usage in `<Suspense>`.
- Masonry via CSS columns (1 / 2 / 3 columns by breakpoint), 8px gap, images keep their natural aspect ratio.
- Images reveal on scroll (clip-path wipe, scale 1.2 to 1, stagger by `index % 3 * 0.1`).
- Desktop hover: hovered image scales 1.04, the others dim to 0.4, custom cursor shows "View".
- Filtering animates with Motion `layout` and `AnimatePresence`.
- **Lightbox:** click opens a fullscreen overlay using a shared `layoutId` transition from thumbnail to full image. Arrow keys and swipe navigate, Esc closes, focus is trapped, body scroll is locked. Shows title, category and a counter (`04 / 18`).

### `/recent` (Recent Arts)
- Title **RECENT ARTS**, label `Latest work · [month year]`.
- One large featured piece at the top (full-bleed), then a staggered 2-column grid (second column offset down by 6rem on desktop).
- Each item shows title and date; the whole card is a link to its `instagramUrl` in a new tab (`rel="noopener noreferrer"`) with a small "View on Instagram ↗" label.
- Footer of the page: large "Follow @[handle]" button.
- No live Instagram API for now. Data comes from `src/data/recent.ts`.

### `/contact`
- Title **CONTACT**, intro line in serif italic: "Tell me the date, the place and what matters most." `[PLACEHOLDER]`
- Email with Copy button, Instagram, WhatsApp, location line: "Based in Toronto, Ontario. Available across the Greater Toronto Area and for travel." `[PLACEHOLDER]`
- **Process** as numbered rows (I to IV), each fading up on scroll: Reach out, Plan, Shoot, Deliver, each with one short line.
- No form in v1 (mailto and WhatsApp links are more reliable).

---

## 7. Global components

- **Layout:** Nav, Footer, `SmoothScroll` (Lenis), `PageTransition`, `CustomCursor`, `SoundToggle`.
- **Skip link:** first focusable element, "Skip to content".
- **Footer:** big "ASWIN KRISHNA" wordmark, links to all pages, Instagram, email, `© 2026 Aswin Krishna`, Toronto, Ontario, and the **"Camera sounds: off / on"** toggle.
- **Smooth scroll:** Lenis at the app root, disabled for reduced motion. After navigation, reset scroll to the top immediately.
- **Page transition:** a black full-screen panel. On internal link click (use a `TransitionLink` wrapper): the panel wipes up over 0.5s, then `router.push`, and when the new pathname renders the panel wipes away over 0.5s. Keep this simple; do not fight the App Router with exit-animation hacks.
- **Custom cursor (desktop with hover only):** a 10px dot that follows the pointer with a spring, grows into a 72px circle labelled "View" over gallery images and "Open" over links. Hidden on touch devices.
- **Sound toggle:** off by default (browsers block autoplay anyway). When on, play a short **synthesized shutter click with the Web Audio API** (no audio file needed) on lightbox next/previous and on opening a photo. Persist nothing.
- **Magnetic button:** moves up to ~12px toward the pointer within 80px, with a soft spring, resets on leave.

---

## 8. Content

All copy lives in `src/data/content.ts`.

```ts
export const site = {
  name: "Aswin Krishna",
  tagline: "Photography / Toronto, Ontario",
  email: "hello@example.com",            // [PLACEHOLDER]
  instagram: "https://instagram.com/",   // [PLACEHOLDER]
  instagramHandle: "@aswin",             // [PLACEHOLDER]
  whatsapp: "https://wa.me/",            // [PLACEHOLDER]
  location: "Toronto, Ontario, Canada",
};

export const quotes = {
  spark: {
    text: "Curiosity makes me look twice. Passion makes me press the shutter.",
    author: "Aswin Krishna",
  },
  promise: {
    text: "Every frame is a memory I get to hand back to you.",
    author: "Aswin Krishna",
  },
};
```

Quote note: these are original placeholder lines (no attribution risk). If Aswin prefers a famous quote, verify the wording and source on a reliable site before using it.

**Process steps `[PLACEHOLDER]`:**
1. I. Reach out, "Send me the date, the place and what you have in mind."
2. II. Plan, "We choose the moments that matter and where I will be."
3. III. Shoot, "I stay present, quiet and ready for the split second."
4. IV. Deliver, "A carefully edited gallery, ready to share and keep."

---

## 9. Images (stock placeholders for now)

All images are **temporary stock**. Before launch they must be replaced with Aswin's own work. Do not present stock photos as his portfolio on a live site.

**Sourcing:**
- Use free-license sources only: **Unsplash** or **Pexels**. Use the browser to find suitable photos, and download them at about 2000px on the long edge.
- Save to `public/photos/nature/`, `public/photos/wedding/`, `public/photos/casual/`, `public/photos/hero/`, `public/photos/recent/`.
- Use descriptive file names, e.g. `algonquin-autumn-lake.jpg`.
- Do not guess image URLs. Only use files you actually downloaded or URLs you verified load. If downloading is not possible, use verified remote URLs and add the host to `images.remotePatterns` in `next.config`.
- Record every image in `src/data/photos.ts` with the photographer credit and source link.

**Quantities and subjects:**
| Where | Count | Subjects |
|---|---|---|
| Hero | 3 | moody wide landscape, golden-hour portrait, city at dusk (dark, high contrast works best) |
| Memories | 3 | one each: nature/travel, wedding couple, casual street moment |
| Gallery | 18 | 6 nature (lakes, forests, autumn, skyline, travel), 6 wedding (couple, rings, bouquet, candid, reception, detail), 6 casual (street, friends, cafe, streetcar, rain, portrait) |
| Recent | 6 | mixed, with one that works as the large featured image |
| Open Graph | 1 | 1200x630 crop of the best hero |

**Data shapes:**
```ts
type Category = "nature" | "wedding" | "casual";
type Photo = {
  id: string; src: string; title: string; category: Category;
  caption?: string; width: number; height: number; alt: string;
  credit: { name: string; url: string };
};
type RecentArt = {
  id: string; src: string; title: string; date: string;
  instagramUrl: string; width: number; height: number; alt: string;
};
```

**Later (real photos):** export from Lightroom as sRGB JPEG, long edge about 2400px, quality 80 to 85. Next.js will create the AVIF/WebP versions. Name files descriptively (e.g. `high-park-cherry-blossoms.jpg`) since file names help search.

---

## 10. Tech and engineering rules

**Stack:** Next.js (latest stable, App Router), TypeScript, Tailwind CSS (the version `create-next-app` installs; if v4, define tokens with `@theme` in `globals.css`), **Motion** (`import { motion, useScroll, useTransform, useSpring, useReducedMotion, AnimatePresence } from "motion/react"`), **Lenis** for smooth scroll. Nothing else without asking.

**Scaffold:**
```bash
npx create-next-app@latest aswin-portfolio --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
cd aswin-portfolio
npm install motion lenis
```

**Structure:**
```
src/
  app/ (layout.tsx, page.tsx, gallery/, recent/, contact/, sitemap.ts, robots.ts, opengraph-image)
  components/ (Nav, Footer, SmoothScroll, PageTransition, TransitionLink, CustomCursor,
               SoundToggle, MagneticButton, Marquee, QuoteReveal, MemoriesSequence,
               Lightbox, GalleryGrid, CopyEmail, ScrollProgress)
  data/ (content.ts, photos.ts, recent.ts)
  hooks/ (useIsDesktopHover.ts, useIsMobile.ts)
  lib/ (shutter.ts)
public/photos/...
```

**Rules:**
1. Server components by default. Add `"use client"` only to components that animate or use browser APIs.
2. Images: `next/image` always, with `fill` and an accurate `sizes`, or explicit width and height. Hero's first image has `priority`. Provide meaningful `alt` text.
3. Fonts: `next/font/google` only, with `display: swap`. No `<link>` tags.
4. Animate only `transform`, `opacity` and `clip-path`. Never width, height, top or left.
5. Scroll-driven values use motion values (`useScroll`, `useTransform`), never React state.
6. Easing `[0.22, 1, 0.36, 1]`, durations 0.6s to 1.2s. No bounce or overshoot.
7. **Reduced motion:** with `useReducedMotion()` true, disable Lenis, parallax, Ken Burns, marquee and scrubbed effects; use plain fades or no motion.
8. Hover effects only when `(hover: hover)` matches.
9. Mobile-first at 390px. No fixed pixel widths. No horizontal scroll at any width. Use `min-h-svh`.
10. Accessibility: visible focus states, keyboard-operable lightbox with focus trap, `aria-label`s on icon-only buttons, color contrast at least AA, nav is a `<nav>`, page content in `<main id="main">`.
11. SEO: per-page `metadata` (title and description mention "Toronto photographer"), Open Graph image, `sitemap.ts`, `robots.ts`, JSON-LD (`LocalBusiness` or `ProfessionalService`, with `areaServed`) on the home page.
12. Content comes from `src/data`, never hardcoded inside components.
13. Keep components small and typed. No `any`.

---

## 11. Build phases (one per request, then stop)

**Phase 0: Foundation**
Scaffold the project, set up fonts, Tailwind tokens from section 3, the folder structure, data files with placeholder content, and download the stock images (section 9). Create the four routes with simple placeholder headings. No animation.

**Phase 1: Global shell**
Nav (including the mobile overlay), Footer, skip link, Lenis smooth scroll, TransitionLink and PageTransition, CustomCursor, ScrollProgress, SoundToggle with the synthesized shutter sound.

**Phase 2: Hero (Chapter 0)**
Crossfading Ken Burns hero, name reveal, label, scroll cue, parallax, and the marquee strip.

**Phase 3: Spark (Chapter 1)**
Build the reusable `QuoteReveal` and use it with the opening quote.

**Phase 4: Memories (Chapter 2)**
Build `MemoriesSequence` exactly as specified in section 5, including the scene indicator and mobile adjustments.

**Phase 5: Promise and Say hello (Chapters 3 and 4)**
Closing `QuoteReveal`, the contact chapter with CopyEmail and MagneticButton, and footer integration.

**Phase 6: Gallery**
Filters tied to the URL, masonry grid, reveals, hover dimming, and the Lightbox with the shared-element transition and shutter sound.

**Phase 7: Recent Arts and Contact pages**
As specified in section 6.

**Phase 8: Polish and launch prep**
Audit: responsiveness at 390, 768 and 1440px, reduced motion, accessibility, console warnings, image sizes and `sizes` attributes, metadata, Open Graph, sitemap, robots, JSON-LD, favicon, Lighthouse (aim for 90+ on mobile performance). Fix everything and report what changed.

**At the end of every phase:** screenshot at 390px and 1440px, verify no horizontal scroll, test reduced motion, run `npm run build` and `npm run lint`, then propose a commit message and wait.

---

## 12. Acceptance checklist (final)

- [ ] Home plays as one story: Welcome, Spark, three Memories, Promise, Say hello
- [ ] Both quotes use the same scroll-scrubbed word reveal
- [ ] Memories wipe over each other continuously, with the I / II / III indicator
- [ ] Gallery filters work via URL and animate; lightbox is keyboard accessible
- [ ] Recent Arts items open their Instagram links in a new tab
- [ ] Contact has copy-email, Instagram, WhatsApp, process steps, location
- [ ] No horizontal scroll at 390px, 768px or 1440px
- [ ] Everything works with reduced motion enabled
- [ ] Sound toggle is off by default; shutter sound works when on
- [ ] `npm run build` passes with no errors; Lighthouse mobile performance 90+
- [ ] All `[PLACEHOLDER]` content listed for replacement; stock photos flagged for replacement

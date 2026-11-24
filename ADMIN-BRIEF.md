# ADMIN-BRIEF: Photo admin panel for the Aswin Krishna portfolio

> Save next to `BRIEF.md` in the project root.
> Start each Antigravity session with: **"Read BRIEF.md and ADMIN-BRIEF.md. Do Admin Phase X only, then stop and report."**
> `BRIEF.md` still rules the public site (design, motion, rules). This file only adds the admin and the data layer.

---

## 1. Goal and decisions

**Goal:** Aswin (non-technical) can log in on his phone or laptop, upload photos, edit titles and captions, reorder, and delete them. The public site updates within seconds. No code changes or redeploys for content.

**Why not just save files to the project folder?** Hosts like Vercel run the site on serverless functions with a read-only or temporary filesystem, so uploaded files would disappear. Photos need external storage and the metadata needs a database.

**Chosen stack: Supabase** (Postgres database + Storage bucket + Auth, one service). No other new services.
Alternative if this proves too heavy: Sanity (hosted CMS with a ready-made admin, almost no admin code).

**What the admin manages (one `photos` table, four collections):**
| Collection | What it is | Rules |
|---|---|---|
| `hero` | Home hero slides | 1 to 5 images, ordered |
| `memory` | The three Home memory scenes | Exactly one per category: nature, wedding, casual (replace, not add) |
| `gallery` | The Gallery page | Any number; each has a category |
| `recent` | Recent Arts page | Any number; optional `instagram_url`; ordered newest first |

---

## 2. One-time setup in the Supabase dashboard (human steps)

1. Create a Supabase account and a **New project**. Pick a region close to Toronto (e.g. Canada Central if offered). Save the database password.
2. **Authentication > Users > Add user**: create one user for Aswin and one for the developer (email and password, mark email as confirmed).
3. **Authentication > Sign In / Providers**: turn **off** "Allow new users to sign up". Only the users you created can ever log in.
4. **SQL Editor**: paste and run the SQL in section 3.
5. **Project Settings / Connect**: copy the **Project URL** and the **publishable key**. Put them in `.env.local` (section 4). Never use or expose the secret / service_role key in this project.
6. **Authentication > URL Configuration**: set the Site URL to the production domain once it exists (and `http://localhost:3000` for development).
7. In the project: `npm install @supabase/supabase-js @supabase/ssr`

---

## 3. SQL (run once in the SQL Editor)

```sql
-- Table
create table public.photos (
  id uuid primary key default gen_random_uuid(),
  collection text not null check (collection in ('hero','memory','gallery','recent')),
  category text check (category in ('nature','wedding','casual')),
  title text not null,
  alt text not null,
  caption text,
  storage_path text not null unique,
  width int not null,
  height int not null,
  blur_data_url text,
  instagram_url text,
  taken_on date,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  constraint category_required
    check (collection not in ('memory','gallery') or category is not null)
);

create unique index one_memory_per_category
  on public.photos (category) where collection = 'memory';
create index photos_collection_order
  on public.photos (collection, sort_order);

-- Row level security: anyone can read, only logged-in users can write
alter table public.photos enable row level security;

create policy "Public can read photos" on public.photos
  for select using (true);
create policy "Admins can insert photos" on public.photos
  for insert to authenticated with check (true);
create policy "Admins can update photos" on public.photos
  for update to authenticated using (true) with check (true);
create policy "Admins can delete photos" on public.photos
  for delete to authenticated using (true);

-- Storage bucket (public read through URLs, 5 MB limit per file)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('photos', 'photos', true, 5242880, array['image/jpeg','image/webp','image/png'])
on conflict (id) do nothing;

create policy "Admins can list photos bucket" on storage.objects
  for select to authenticated using (bucket_id = 'photos');
create policy "Admins can upload to photos bucket" on storage.objects
  for insert to authenticated with check (bucket_id = 'photos');
create policy "Admins can update photos bucket" on storage.objects
  for update to authenticated using (bucket_id = 'photos');
create policy "Admins can delete from photos bucket" on storage.objects
  for delete to authenticated using (bucket_id = 'photos');
```

Security model: signups are disabled, so "authenticated" means one of the accounts you created. If you ever need roles, add an `admins` table and tighten the policies.

---

## 4. Environment variables

`.env.local` (and the same two in the hosting dashboard). Also commit a `.env.example` with empty values.

```
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
```

Only these two. No secret or service_role key anywhere. If the dashboard still shows an "anon" key, its value works in the publishable-key variable during the transition.

---

## 5. Architecture rules

1. **Public reads use a cookie-less anon client** (`@supabase/supabase-js` `createClient`), never the session client. This keeps public pages cacheable and avoids any chance of leaking a session through a cache.
2. **Public pages use ISR** (`export const revalidate = 60`). Admin actions also call `revalidatePath` for `/`, `/gallery` and `/recent`, so changes appear immediately.
3. **Proxy:** Next.js 16 uses `proxy.ts` (not `middleware.ts`). Its matcher covers only `/admin/:path*`, so public pages never run auth code. It refreshes the session and redirects unauthenticated users to `/admin/login`.
4. **Do not rely on the proxy alone.** Every admin page, layout and server action must also verify the user on the server with `supabase.auth.getClaims()` (never `getSession()` for security checks) and reject if not signed in.
5. **Uploads go directly from the browser to Supabase Storage**, using the logged-in session. Do not send image files through Next.js server actions or API routes (hosting request-body limits are around 4.5 MB on Vercel, so large photos would fail).
6. **Resize in the browser before upload:** longest side max 2400px, convert to WebP (fallback JPEG) at quality about 0.85, target under 1.5 MB. Measure the final width and height. Generate a tiny blur placeholder (about 16px wide, base64) for `blur_data_url`.
7. **Server actions handle metadata only:** insert row, update row, delete (row first, then the storage object), reorder, replace memory. Each action validates input manually (no new validation library) and re-checks auth.
8. **Storage paths:** `<collection>/<uuid>.webp`. Never use user-supplied file names in paths.
9. **`src/lib/photos.ts`** exposes `getPhotos(collection, category?)` returning the same `Photo` shape the public components already use, with `src` built from `getPublicUrl`. Public components should not need to change except for importing from this function.
10. **Fallback:** use the static data in `src/data` only when the Supabase env vars are missing (local development without Supabase). When Supabase is configured, it is the source of truth.
11. **Empty states everywhere:** hero with 0 images shows plain black; a missing memory scene is skipped; empty gallery shows a short message. Nothing may crash.
12. **Images:** add the project's Supabase host to `images.remotePatterns` in `next.config` (path `/storage/v1/object/public/photos/**`). Keep using `next/image`.
13. **Admin is private and plain:** `/admin/**` has `robots: noindex`, is disallowed in `robots.ts`, is excluded from the sitemap, and does not load the public site's nav, custom cursor, smooth scroll or page transitions. It uses the same dark palette and fonts from `DESIGN`/`BRIEF.md`, but is functional, not decorative.
14. **Mobile first:** Aswin will likely use his phone. Big touch targets (44px+), single-column layout at 390px, file input with `accept="image/*"` and `multiple`.
15. No new libraries except `@supabase/supabase-js` and `@supabase/ssr`. Reordering uses up/down buttons (drag-and-drop can be a later upgrade).

---

## 6. Admin UI spec

**Routes**
- `/admin/login`: email and password, one button, clear error text. Server action `signInWithPassword`, then redirect to `/admin`.
- `/admin`: dashboard (protected).

**Dashboard layout**
- Header: "Photos" title, signed-in email, **Sign out**, a link "View site".
- Tabs: **Hero · Memories · Gallery · Recent Arts**.

**Upload (Hero, Gallery, Recent Arts)**
- Dropzone and "Choose photos" button (multiple files).
- For each selected file show a row: thumbnail preview, status (Resizing, Uploading, Saving, Done, Failed with a retry button) and a progress indicator.
- Fields per photo: **Title** (required), **Alt text** (required, short description of the image; prefill from title), **Category** (required for Gallery and Memories: Nature / Wedding / Casual), **Caption** (optional), and **Instagram link** + date (Recent Arts only).
- Show an "Upload all" button; failed items can be retried without re-picking files.
- Reject files that are not images, with a friendly message. If a HEIC file cannot be decoded in the browser, show "Please export as JPEG" instead of failing silently.

**Manage existing photos**
- Grid of thumbnails (2 columns on mobile, 4 on desktop) showing title and category.
- Per item: **Edit** (inline or modal for the same fields), **Move up / Move down**, **Delete**.
- Delete always asks for confirmation ("Delete 'title'? This removes it from the site.") and then removes the database row and the storage file.
- Gallery tab has category filter chips.

**Memories tab**
- Exactly three slots: Nature, Wedding, Everyday (casual). Each shows the current photo or "Empty". Actions: **Replace** (upload new image; old row and file are deleted after the new one is saved) and **Remove**. Title and caption are editable (the caption appears on the Home scene).

**Feedback**
- Toast messages for success and errors. After every change, the list refreshes. A link "Open page" jumps to the relevant public page.

---

## 7. Phases

**Admin Phase A: Supabase foundation and auth**
Install packages; add `src/lib/supabase/` clients (browser, server with cookies, public cookie-less); add `proxy.ts` limited to `/admin/:path*`; `/admin/login`; protected `/admin` placeholder with sign-out and server-side `getClaims()` check; `.env.example`; noindex and robots rules. Verify: logged-out visit to `/admin` redirects to login, wrong password shows an error, correct login reaches the dashboard.

**Admin Phase B: Data layer for the public site**
Create `src/lib/photos.ts` with `getPhotos`, ISR, fallback rule, `remotePatterns`, and empty-state handling. Switch Home, Gallery and Recent pages to use it. Verify the site still works with an empty table and with a few manually inserted rows (insert one test row through the Supabase table editor).

**Admin Phase C: Upload, edit, reorder, delete**
Build the dashboard per section 6, including client-side resizing, direct upload, server actions with auth checks and `revalidatePath`, and the Memories slots. Verify end to end: upload from a phone-sized viewport, see it on the public page within about a minute (immediately after revalidate), edit, reorder, delete.

**Admin Phase D: Hardening and polish**
Audit: every server action rejects when logged out; no secret keys in the repo or client bundle; RLS blocks writes from a logged-out client (test with a plain anon call); error and empty states; accessibility (labels, focus, keyboard); mobile layout at 390px; `npm run build` and `npm run lint` pass. Write a short `ADMIN-GUIDE.md` for Aswin with screenshots-free step-by-step instructions (log in, upload, delete, replace memories, tips for photo size and alt text).

**At the end of every phase:** run the build, test at 390px and 1440px, propose a commit message, and wait.

---

## 8. Acceptance checklist

- [ ] Only users created in Supabase can log in; sign-ups are disabled
- [ ] Logged-out users cannot reach `/admin` or run any admin action
- [ ] A logged-out client cannot insert, update or delete rows or files (RLS test)
- [ ] Uploading a 6 MB photo works (it is resized in the browser first)
- [ ] Hero, Memories, Gallery and Recent Arts each upload, edit, reorder and delete correctly
- [ ] Deleting removes both the database row and the storage file
- [ ] Public pages update after admin changes and never crash on empty data
- [ ] `/admin` is not indexed and not in the sitemap
- [ ] No service_role / secret key anywhere in the code or browser
- [ ] Works on a phone-sized screen

---

## 9. Operational notes

- **Free tier limits and pausing:** check Supabase's current free-plan storage limits and its policy on pausing inactive projects. A paused project would make the public site lose its photos, so for a client site consider a paid plan or a scheduled keep-alive request.
- **Keep originals:** Supabase holds resized web copies only. Aswin should keep his full-resolution originals in Lightroom or another backup.
- **Photo tips for Aswin:** upload JPEG or WebP, any size (the admin resizes), and write a short descriptive alt text for each photo (helps accessibility and search).
- **Passwords:** use strong unique passwords; consider enabling extra sign-in protections in Supabase if offered.

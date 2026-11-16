# C-BEEMS website

A modern React + Firebase rebuild of the original Wix site
(sb2111012.wixsite.com/beems), which helps Indian immigrant families in
Australia care for their children through bilingual (English/Hindi) video
lessons and practical resources.

## Stack

- **Frontend:** React 19 + TypeScript + React Router, built with Vite
- **Database:** Cloud Firestore (`lessons` collection for video content,
  `site` collection for the homepage intro video, `messages` collection
  for contact form submissions)
- **Media:** lesson videos and their poster images are hosted on Vimeo
  (Firebase Storage is unused)
- **Hosting:** Firebase Hosting

The site works out of the box with placeholder content and images even
before Firebase is connected - Firestore reads fall back to the static
content in [`src/data/lessons.ts`](src/data/lessons.ts), and images fall
back to the generated `PlaceholderImage` component. Once Firebase is
connected and seeded, real content takes over automatically.

## Local development

```bash
npm install
npm run dev
```

Open the printed local URL. The app works immediately with placeholder
content, no Firebase project required.

## Connecting Firebase

1. Create a project at [console.firebase.google.com](https://console.firebase.google.com).
2. In the project, enable:
   - **Firestore Database** (start in production mode - rules are provided below)
   - **Storage**
   - **Hosting**
3. Add a Web App (Project settings -> General -> Your apps -> `</>`) and copy
   the config values.
4. Copy `.env.example` to `.env.local` and paste in the values:

   ```bash
   cp .env.example .env.local
   ```

5. Install the Firebase CLI if you don't have it, and log in:

   ```bash
   npm install -g firebase-tools
   firebase login
   ```

6. Point this project at your Firebase project by editing `.firebaserc`
   (replace `REPLACE_WITH_YOUR_FIREBASE_PROJECT_ID`), or run:

   ```bash
   firebase use --add
   ```

7. Deploy the Firestore and Storage security rules:

   ```bash
   firebase deploy --only firestore:rules,storage
   ```

## Seeding Firestore with lesson content

`scripts/seed.ts` (run via `tsx`) writes the 8 lesson documents and the
homepage intro to Firestore, using
[Application Default Credentials](https://firebase.google.com/docs/admin/setup#initialize-sdk):

```bash
npm run seed
```

The script reads `VITE_FIREBASE_PROJECT_ID` from `.env.local` itself. For
credentials it uses `serviceAccountKey.json` in the project root if present
(download one from Project settings -> Service accounts; it's gitignored).
Otherwise run `gcloud auth application-default login` once first, or set
`GOOGLE_APPLICATION_CREDENTIALS` to a key file elsewhere.

Re-run the seed script any time you edit `src/data/lessons.ts` to keep
Firestore in sync.

### Lesson videos (Vimeo)

The homepage intro and all 8 lessons are hosted on Vimeo, in English and
Hindi. "Lived Experiences" is split into two parts in both languages, and
the Hindi "Four Ways of Acculturation" also has two parts. The player shows
a Part 1 / Part 2 picker whenever a language has more than one part.

The Vimeo player URLs live in [`src/data/lessons.ts`](src/data/lessons.ts)
(`videosEn`/`videosHi` per lesson, plus `homeIntro`). To change a video,
copy the `src="https://player.vimeo.com/video/…"` value out of Vimeo's
embed code, or call the `vimeo(id, hash)` helper there with the numbers from
a `https://vimeo.com/<id>/<hash>` link. Keep the hash, because the videos
are unlisted and won't play without it.

Lesson cards use each lesson's English (part 1) Vimeo poster frame as the
thumbnail. To get the image id for `vimeoPoster(...)`, open
`https://vimeo.com/api/oembed.json?url=https://vimeo.com/<id>/<hash>` and
copy the part of `thumbnail_url` between `/video/` and `-d_`. If you
change a video's poster on Vimeo, update that id. Then run `npm run seed` to copy
the change into Firestore. The site also reads the links directly from
that file, so they show even before you reseed.

On Vimeo, each video's **Privacy → Where can this be embedded?** setting
must allow your Firebase Hosting domain (and `localhost` for development).

## Build & deploy to Firebase Hosting

```bash
npm run build
firebase deploy --only hosting
```

`npm run build` runs `tsc -b` (typecheck, no emit — Vite handles the actual
transpilation) before `vite build`. Run `npm run typecheck` on its own any
time you just want the type errors without a full build.

Or deploy everything (hosting, rules) in one go:

```bash
npm run build
firebase deploy
```

## Project structure

```
src/
  components/   Reusable UI (Navbar, Footer, cards, video player, etc.)
  pages/        One file per route (Home, About, Videos, LessonDetail, Contact, Legal)
  data/         Static fallback content shared with the seed script
  hooks/        useLessons() - Firestore fetch with local fallback
  lib/          Firebase app initialization
  types.ts      Shared TypeScript interfaces (Lesson, HomeIntro, Theme, ...)
scripts/
  seed.ts       Seeds Firestore with lesson content and Vimeo links; run via `tsx`
firestore.rules   Public read on lessons, public create-only on messages
storage.rules     Public read on uploaded media, no public writes
```

## Content notes

The original site's About and Contact pages were unfinished Wix template
pages (no real copy), and its footer phone/email/address and social links
were still Wix's own placeholder values. This rebuild keeps that same
footer structure (address, phone, email, social icons, Privacy Policy,
Accessibility Statement, copyright) so it's easy to find and replace with
BEEMS' real details - see `src/components/Footer.tsx`.

The 8 lesson videos and the homepage intro video, on the other hand, were
real, working bilingual (English/Hindi) footage on the original site — see
"Real lesson videos" above for how they were migrated.

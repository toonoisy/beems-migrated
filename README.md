# C-BEEMS website

A modern React + Firebase rebuild of the original Wix site
(sb2111012.wixsite.com/beems), which helps Indian immigrant families in
Australia care for their children through bilingual (English/Hindi) video
lessons and practical resources.

## Stack

- **Frontend:** React 19 + React Router, built with Vite
- **Database:** Cloud Firestore (`lessons` collection for video content,
  `site` collection for the homepage intro video, `messages` collection
  for contact form submissions)
- **Media storage:** Firebase Storage (lesson thumbnails/video files)
- **Hosting:** Firebase Hosting

The site works out of the box with placeholder content and images even
before Firebase is connected - Firestore reads fall back to the static
content in [`src/data/lessons.js`](src/data/lessons.js), and images fall
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

## Seeding Firestore + Storage with placeholder lesson content

`scripts/seed.js` writes the 8 lesson documents to Firestore and uploads a
placeholder thumbnail image for each one to Storage, using
[Application Default Credentials](https://firebase.google.com/docs/admin/setup#initialize-sdk):

```bash
gcloud auth application-default login   # one-time, needs the gcloud CLI
export $(grep -v '^#' .env.local | xargs)   # loads VITE_FIREBASE_PROJECT_ID etc.
npm run seed
```

(Alternatively, download a service account key from Project settings ->
Service accounts, and set `GOOGLE_APPLICATION_CREDENTIALS` to its path
instead of running `gcloud auth`.)

Re-run the seed script any time you edit `src/data/lessons.js` to keep
Firestore in sync.

### Real lesson videos

The original site's videos (homepage intro + all 8 lessons, each in
English and Hindi — 18 files) were downloaded from Wix's CDN at 480p using
`scripts/download-source-videos.sh`, into `scripts/source-videos/`
(gitignored — 195 MB of binaries don't belong in git).

If that folder is present when you run `npm run seed`, the script uploads
each file to Storage and writes the resulting download URL onto the
matching Firestore document — `lessons/<id>.videoUrlEn`/`videoUrlHi` for
the 8 lessons, and `site/home.introVideoUrlEn`/`introVideoUrlHi` for the
homepage intro. If a video file is missing for a given lesson, that field
is simply left `null` and the site falls back to its "video coming soon"
placeholder player — nothing breaks either way.

To (re-)download the source videos from scratch:

```bash
./scripts/download-source-videos.sh
npm run seed
```

If you don't have `scripts/source-videos/` (e.g. on a fresh clone) and
have your own footage instead, drop `en.mp4`/`hi.mp4` files into
`scripts/source-videos/<lesson-id>/` (or `scripts/source-videos/home/` for
the homepage intro) using the lesson ids from
[`src/data/lessons.js`](src/data/lessons.js), then run `npm run seed`.

## Build & deploy to Firebase Hosting

```bash
npm run build
firebase deploy --only hosting
```

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
scripts/
  seed.js                     Seeds Firestore + Storage with lesson content (+ real videos if present)
  download-source-videos.sh   One-off: pulls the original site's real videos into source-videos/
  source-videos/              Downloaded source footage (gitignored, not in the repo)
firestore.rules   Public read on lessons, public create-only on messages
storage.rules     Public read on uploaded media, no public writes
```

## Content notes

The original site's About and Contact pages were unfinished Wix template
pages (no real copy), and its footer phone/email/address and social links
were still Wix's own placeholder values. This rebuild keeps that same
footer structure (address, phone, email, social icons, Privacy Policy,
Accessibility Statement, copyright) so it's easy to find and replace with
BEEMS' real details - see `src/components/Footer.jsx`.

The 8 lesson videos and the homepage intro video, on the other hand, were
real, working bilingual (English/Hindi) footage on the original site — see
"Real lesson videos" above for how they were migrated.

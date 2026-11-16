#!/usr/bin/env node
// Seeds Cloud Firestore's "lessons" and "site" collections from the
// shared content in src/data/lessons.ts so the client fallback and the
// live database agree, and writes each lesson's thumbnail SVG into
// public/thumbnails/ (deployed with the site; rebuild + deploy after).
// Nothing is stored in Firebase Storage.
//
// Videos are hosted on Vimeo; their player URLs live in src/data/lessons.ts
// and are written to each lesson's videosEn/videosHi fields (and to
// site/home for the homepage intro). Nothing is uploaded for them.
//
// Config: VITE_FIREBASE_PROJECT_ID is read from .env.local automatically;
// a value already set in the shell takes precedence.
//
// Auth: uses Application Default Credentials. If serviceAccountKey.json
// (downloaded from Firebase console > Project settings > Service accounts)
// is in the project root, it's used automatically. Otherwise run `gcloud
// auth application-default login` first, or set
// GOOGLE_APPLICATION_CREDENTIALS to a key file elsewhere.
//
// Usage:
//   npm run seed
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { initializeApp, applicationDefault } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { homeIntro, lessons } from '../src/data/lessons.ts';
import type { Lesson } from '../src/types.ts';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const ENV_FILE = path.join(ROOT, '.env.local');
const SERVICE_ACCOUNT_KEY = path.join(ROOT, 'serviceAccountKey.json');
const THUMBNAILS_DIR = path.join(ROOT, 'public', 'thumbnails');

if (existsSync(ENV_FILE)) process.loadEnvFile(ENV_FILE);
if (!process.env.GOOGLE_APPLICATION_CREDENTIALS && existsSync(SERVICE_ACCOUNT_KEY)) {
  process.env.GOOGLE_APPLICATION_CREDENTIALS = SERVICE_ACCOUNT_KEY;
}

const projectId = process.env.VITE_FIREBASE_PROJECT_ID || process.env.GCLOUD_PROJECT;

if (!projectId) {
  console.error(
    'Missing project id. Set VITE_FIREBASE_PROJECT_ID in .env.local (see .env.example) before running the seed script.',
  );
  process.exit(1);
}

initializeApp({
  credential: applicationDefault(),
  projectId,
});

const db = getFirestore();

function placeholderSvg(lesson: Lesson): string {
  const label = `Lesson ${lesson.order}`;
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="640" height="400" viewBox="0 0 640 400">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#1c4a5f"/>
      <stop offset="100%" stop-color="#0e2733"/>
    </linearGradient>
  </defs>
  <rect width="640" height="400" fill="url(#g)"/>
  <circle cx="320" cy="170" r="42" fill="#F5A623"/>
  <path d="M308 152l32 20-32 20z" fill="#0e2733"/>
  <text x="320" y="250" font-family="Poppins, sans-serif" font-size="22" font-weight="600" fill="#F4F1EA" text-anchor="middle">${label}</text>
  <text x="320" y="280" font-family="Inter, sans-serif" font-size="16" fill="#c9d6db" text-anchor="middle">${escapeXml(lesson.title)}</text>
</svg>`;
}

function escapeXml(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// Thumbnails are served from public/thumbnails/<lesson-id>.svg, which is
// where LessonCard looks for them.
function writeThumbnail(lesson: Lesson): void {
  mkdirSync(THUMBNAILS_DIR, { recursive: true });
  writeFileSync(path.join(THUMBNAILS_DIR, `${lesson.id}.svg`), placeholderSvg(lesson));
}

async function seedLessons(): Promise<void> {
  for (const lesson of lessons) {
    writeThumbnail(lesson);

    await db.collection('lessons').doc(lesson.id).set({
      order: lesson.order,
      title: lesson.title,
      summary: lesson.summary,
      videosEn: lesson.videosEn ?? [],
      videosHi: lesson.videosHi ?? [],
    });

    console.log(`  ✓ ${lesson.title}`);
  }
}

// The homepage's bilingual intro video isn't part of the lessons grid, so
// it's kept as its own "site/home" document instead.
async function seedHomeIntro(): Promise<void> {
  await db.collection('site').doc('home').set(homeIntro);
  console.log('  ✓ Home intro video');
}

async function seed(): Promise<void> {
  console.log(`Seeding project "${projectId}"…`);
  await seedLessons();
  await seedHomeIntro();
  console.log('Done. The Videos and Home pages will now read this content from Firestore.');
}

seed().catch((error) => {
  console.error('Seed failed:', error);
  process.exit(1);
});

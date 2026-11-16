#!/usr/bin/env node
// Seeds Cloud Firestore's "lessons" and "site" collections from the
// shared content in src/data/lessons.ts so the client fallback and the
// live database agree. Nothing is stored in Firebase Storage.
//
// Videos are hosted on Vimeo; their player URLs and poster images live in
// src/data/lessons.ts and are written to each lesson's videosEn/videosHi
// and thumbnailUrl fields (and to site/home for the homepage intro).
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
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { initializeApp, applicationDefault } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { homeIntro, lessons } from '../src/data/lessons.ts';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const ENV_FILE = path.join(ROOT, '.env.local');
const SERVICE_ACCOUNT_KEY = path.join(ROOT, 'serviceAccountKey.json');

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

async function seedLessons(): Promise<void> {
  for (const lesson of lessons) {
    await db.collection('lessons').doc(lesson.id).set({
      order: lesson.order,
      title: lesson.title,
      summary: lesson.summary,
      thumbnailUrl: lesson.thumbnailUrl ?? null,
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

#!/usr/bin/env node
// Seeds Cloud Firestore's "lessons" and "site" collections and Firebase
// Storage, using the shared content in src/data/lessons.ts so the client
// fallback and the live database agree.
//
// Videos are hosted on Vimeo; their player URLs live in src/data/lessons.ts
// and are written to each lesson's videosEn/videosHi fields (and to
// site/home for the homepage intro). Nothing is uploaded for them.
//
// Config: VITE_FIREBASE_PROJECT_ID (and optionally
// VITE_FIREBASE_STORAGE_BUCKET) are read from .env.local automatically;
// variables already set in the shell take precedence.
//
// Auth: uses Application Default Credentials. If serviceAccountKey.json
// (downloaded from Firebase console > Project settings > Service accounts)
// is in the project root, it's used automatically. Otherwise run `gcloud
// auth application-default login` first, or set
// GOOGLE_APPLICATION_CREDENTIALS to a key file elsewhere.
//
// Usage:
//   npm run seed
import { randomUUID } from 'node:crypto';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { initializeApp, applicationDefault } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';
import { homeIntro, lessons } from '../src/data/lessons.ts';
import type { Lesson } from '../src/types.ts';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const ENV_FILE = path.join(ROOT, '.env.local');
const SERVICE_ACCOUNT_KEY = path.join(ROOT, 'serviceAccountKey.json');

if (existsSync(ENV_FILE)) process.loadEnvFile(ENV_FILE);
if (!process.env.GOOGLE_APPLICATION_CREDENTIALS && existsSync(SERVICE_ACCOUNT_KEY)) {
  process.env.GOOGLE_APPLICATION_CREDENTIALS = SERVICE_ACCOUNT_KEY;
}

const projectId = process.env.VITE_FIREBASE_PROJECT_ID || process.env.GCLOUD_PROJECT;
const storageBucket = process.env.VITE_FIREBASE_STORAGE_BUCKET || (projectId ? `${projectId}.appspot.com` : undefined);

if (!projectId) {
  console.error(
    'Missing project id. Set VITE_FIREBASE_PROJECT_ID in .env.local (see .env.example) before running the seed script.',
  );
  process.exit(1);
}

initializeApp({
  credential: applicationDefault(),
  projectId,
  storageBucket,
});

const db = getFirestore();
const bucket = getStorage().bucket();

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

function downloadUrlFor(storagePath: string, token: string): string {
  const encodedPath = encodeURIComponent(storagePath);
  return `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodedPath}?alt=media&token=${token}`;
}

async function uploadThumbnail(lesson: Lesson): Promise<string> {
  const storagePath = `lessons/${lesson.id}/thumbnail.svg`;
  const token = randomUUID();

  await bucket.file(storagePath).save(placeholderSvg(lesson), {
    contentType: 'image/svg+xml',
    metadata: { metadata: { firebaseStorageDownloadTokens: token } },
  });

  return downloadUrlFor(storagePath, token);
}

async function seedLessons(): Promise<void> {
  for (const lesson of lessons) {
    const thumbnailUrl = await uploadThumbnail(lesson);

    await db.collection('lessons').doc(lesson.id).set({
      order: lesson.order,
      title: lesson.title,
      summary: lesson.summary,
      thumbnailUrl,
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
  console.log('Done. The Videos and Home pages will now read this content from Firestore/Storage.');
}

seed().catch((error) => {
  console.error('Seed failed:', error);
  process.exit(1);
});

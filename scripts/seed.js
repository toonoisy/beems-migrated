#!/usr/bin/env node
// Seeds Cloud Firestore's "lessons" collection and Firebase Storage with
// placeholder thumbnail images, using the shared content in
// src/data/lessons.js so the client fallback and the live database agree.
//
// Auth: uses Application Default Credentials. Run `gcloud auth
// application-default login` first, or set GOOGLE_APPLICATION_CREDENTIALS
// to a service account key JSON downloaded from
// Firebase console > Project settings > Service accounts.
//
// Usage:
//   node scripts/seed.js
import { randomUUID } from 'node:crypto';
import { initializeApp, applicationDefault } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';
import { lessons } from '../src/data/lessons.js';

const projectId = process.env.VITE_FIREBASE_PROJECT_ID || process.env.GCLOUD_PROJECT;
const storageBucket = process.env.VITE_FIREBASE_STORAGE_BUCKET || (projectId ? `${projectId}.appspot.com` : undefined);

if (!projectId) {
  console.error(
    'Missing project id. Set VITE_FIREBASE_PROJECT_ID (e.g. in .env.local and `export $(cat .env.local | xargs)`) before running the seed script.',
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

function placeholderSvg(lesson) {
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

function escapeXml(value) {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

async function uploadThumbnail(lesson) {
  const path = `lessons/${lesson.id}/thumbnail.svg`;
  const file = bucket.file(path);
  const token = randomUUID();

  await file.save(placeholderSvg(lesson), {
    contentType: 'image/svg+xml',
    metadata: { metadata: { firebaseStorageDownloadTokens: token } },
  });

  const encodedPath = encodeURIComponent(path);
  return `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodedPath}?alt=media&token=${token}`;
}

async function seed() {
  console.log(`Seeding project "${projectId}"…`);

  for (const lesson of lessons) {
    const thumbnailUrl = await uploadThumbnail(lesson);

    await db.collection('lessons').doc(lesson.id).set({
      order: lesson.order,
      title: lesson.title,
      summary: lesson.summary,
      thumbnailUrl,
      // Populate these with real Storage download URLs once footage is
      // uploaded; the site shows a placeholder player until then.
      videoUrlEn: null,
      videoUrlHi: null,
    });

    console.log(`  ✓ ${lesson.title}`);
  }

  console.log('Done. The Videos page will now read this content from Firestore.');
}

seed().catch((error) => {
  console.error('Seed failed:', error);
  process.exit(1);
});

#!/usr/bin/env node
// Seeds Cloud Firestore's "lessons" and "site" collections and Firebase
// Storage, using the shared content in src/data/lessons.js so the client
// fallback and the live database agree.
//
// Video uploads: if scripts/source-videos/<lesson-id>/en.mp4 and hi.mp4
// exist, they're uploaded to Storage and their download URLs are written
// to the lesson's videoUrlEn/videoUrlHi fields. Otherwise those fields
// stay null and the site shows the "video coming soon" placeholder.
// scripts/download-source-videos.sh populates that folder from the
// original site's real footage — see that file for details.
//
// Auth: uses Application Default Credentials. Run `gcloud auth
// application-default login` first, or set GOOGLE_APPLICATION_CREDENTIALS
// to a service account key JSON downloaded from
// Firebase console > Project settings > Service accounts.
//
// Usage:
//   node scripts/seed.js
import { randomUUID } from 'node:crypto';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { initializeApp, applicationDefault } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';
import { lessons } from '../src/data/lessons.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SOURCE_VIDEOS_DIR = path.join(__dirname, 'source-videos');

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

function downloadUrlFor(storagePath, token) {
  const encodedPath = encodeURIComponent(storagePath);
  return `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodedPath}?alt=media&token=${token}`;
}

async function uploadThumbnail(lesson) {
  const storagePath = `lessons/${lesson.id}/thumbnail.svg`;
  const token = randomUUID();

  await bucket.file(storagePath).save(placeholderSvg(lesson), {
    contentType: 'image/svg+xml',
    metadata: { metadata: { firebaseStorageDownloadTokens: token } },
  });

  return downloadUrlFor(storagePath, token);
}

// Uploads a local video file to Storage and returns its download URL, or
// null if the file doesn't exist locally (nothing to upload yet).
async function uploadVideoIfPresent(localPath, storagePath) {
  if (!existsSync(localPath)) return null;

  const token = randomUUID();
  await bucket.upload(localPath, {
    destination: storagePath,
    metadata: {
      contentType: 'video/mp4',
      metadata: { firebaseStorageDownloadTokens: token },
    },
  });

  return downloadUrlFor(storagePath, token);
}

async function seedLessons() {
  for (const lesson of lessons) {
    const thumbnailUrl = await uploadThumbnail(lesson);

    const videoUrlEn = await uploadVideoIfPresent(
      path.join(SOURCE_VIDEOS_DIR, lesson.id, 'en.mp4'),
      `lessons/${lesson.id}/en.mp4`,
    );
    const videoUrlHi = await uploadVideoIfPresent(
      path.join(SOURCE_VIDEOS_DIR, lesson.id, 'hi.mp4'),
      `lessons/${lesson.id}/hi.mp4`,
    );

    await db.collection('lessons').doc(lesson.id).set({
      order: lesson.order,
      title: lesson.title,
      summary: lesson.summary,
      thumbnailUrl,
      videoUrlEn,
      videoUrlHi,
    });

    const videoNote = videoUrlEn || videoUrlHi ? '' : ' (no video files found, placeholder player will show)';
    console.log(`  ✓ ${lesson.title}${videoNote}`);
  }
}

// The homepage's bilingual intro video isn't part of the lessons grid, so
// it's kept as its own "site/home" document instead.
async function seedHomeIntro() {
  const videoUrlEn = await uploadVideoIfPresent(
    path.join(SOURCE_VIDEOS_DIR, 'home', 'en.mp4'),
    'home/intro-en.mp4',
  );
  const videoUrlHi = await uploadVideoIfPresent(
    path.join(SOURCE_VIDEOS_DIR, 'home', 'hi.mp4'),
    'home/intro-hi.mp4',
  );

  if (!videoUrlEn && !videoUrlHi) {
    console.log('  – Skipping home intro video (no local files found)');
    return;
  }

  await db.collection('site').doc('home').set({ introVideoUrlEn: videoUrlEn, introVideoUrlHi: videoUrlHi });
  console.log('  ✓ Home intro video');
}

async function seed() {
  console.log(`Seeding project "${projectId}"…`);
  await seedLessons();
  await seedHomeIntro();
  console.log('Done. The Videos and Home pages will now read this content from Firestore/Storage.');
}

seed().catch((error) => {
  console.error('Seed failed:', error);
  process.exit(1);
});

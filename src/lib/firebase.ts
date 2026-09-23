import type { Firestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// The app renders fine with placeholder content even before these env vars
// are set — Firestore calls are wrapped so a missing config just falls
// back to local data instead of crashing the UI.
export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId,
);

let dbPromise: Promise<Firestore> | null = null;

// The Firebase SDK (~470KB) is dynamically imported here instead of at
// module scope. A static top-level import would get bundled into every
// route chunk that (transitively) uses Firestore, forcing React.lazy's
// Suspense boundary to wait for the whole SDK to download before a page
// can render at all — the exact "route changes but the page takes
// forever to actually show up" symptom this fixes. Deferring the import
// until a component actually needs data lets the page render immediately
// with its fallback content, then upgrade to live data once this resolves.
export function getDb(): Promise<Firestore> | null {
  if (!isFirebaseConfigured) return null;

  if (!dbPromise) {
    dbPromise = Promise.all([import('firebase/app'), import('firebase/firestore')]).then(
      ([{ initializeApp, getApps }, { getFirestore }]) => {
        const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
        return getFirestore(app);
      },
    );
  }

  return dbPromise;
}

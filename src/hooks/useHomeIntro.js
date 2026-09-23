import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../lib/firebase';

const FALLBACK = { introVideoUrlEn: null, introVideoUrlHi: null };

// Reads the homepage's bilingual intro video URLs from the "site/home"
// Firestore document. Falls back to null URLs (the BilingualVideo
// component then shows its placeholder) before Firebase is connected or
// seeded — see scripts/seed.js.
export function useHomeIntro() {
  const [intro, setIntro] = useState(FALLBACK);

  useEffect(() => {
    if (!isFirebaseConfigured) return;

    let cancelled = false;

    async function fetchIntro() {
      try {
        const snapshot = await getDoc(doc(db, 'site', 'home'));
        if (!cancelled && snapshot.exists()) {
          setIntro({ ...FALLBACK, ...snapshot.data() });
        }
      } catch (error) {
        console.warn('Falling back to placeholder home intro video:', error.message);
      }
    }

    fetchIntro();
    return () => {
      cancelled = true;
    };
  }, []);

  return intro;
}

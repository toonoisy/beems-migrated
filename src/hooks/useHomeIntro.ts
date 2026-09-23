import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../lib/firebase';
import type { HomeIntro } from '../types';

const FALLBACK: HomeIntro = { introVideoUrlEn: null, introVideoUrlHi: null };

// Reads the homepage's bilingual intro video URLs from the "site/home"
// Firestore document. Falls back to null URLs (the BilingualVideo
// component then shows its placeholder) before Firebase is connected or
// seeded — see scripts/seed.ts.
export function useHomeIntro(): HomeIntro {
  const [intro, setIntro] = useState<HomeIntro>(FALLBACK);

  useEffect(() => {
    if (!isFirebaseConfigured || !db) return;

    let cancelled = false;

    async function fetchIntro() {
      if (!db) return;
      try {
        const snapshot = await getDoc(doc(db, 'site', 'home'));
        if (!cancelled && snapshot.exists()) {
          setIntro({ ...FALLBACK, ...(snapshot.data() as Partial<HomeIntro>) });
        }
      } catch (error) {
        console.warn('Falling back to placeholder home intro video:', (error as Error).message);
      }
    }

    fetchIntro();
    return () => {
      cancelled = true;
    };
  }, []);

  return intro;
}

import { useEffect, useState } from 'react';
import type { Firestore } from 'firebase/firestore';
import { getDb, isFirebaseConfigured } from '../lib/firebase';
import { lessons as fallbackLessons } from '../data/lessons';
import type { Lesson } from '../types';

type LessonSource = 'fallback' | 'firestore';

export function useLessons() {
  const [lessons, setLessons] = useState<Lesson[]>(fallbackLessons);
  const [source, setSource] = useState<LessonSource>('fallback');
  const [loading, setLoading] = useState(isFirebaseConfigured);

  useEffect(() => {
    const dbPromise = getDb();
    if (!dbPromise) return;

    let cancelled = false;

    async function fetchLessons(pending: Promise<Firestore>) {
      try {
        const [db, { collection, getDocs, orderBy, query }] = await Promise.all([
          pending,
          import('firebase/firestore'),
        ]);
        if (cancelled) return;

        const q = query(collection(db, 'lessons'), orderBy('order', 'asc'));
        const snapshot = await getDocs(q);
        if (cancelled) return;

        if (!snapshot.empty) {
          const docs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Lesson);
          setLessons(docs);
          setSource('firestore');
        }
      } catch (error) {
        console.warn('Falling back to local lesson content:', (error as Error).message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchLessons(dbPromise);
    return () => {
      cancelled = true;
    };
  }, []);

  return { lessons, loading, source };
}

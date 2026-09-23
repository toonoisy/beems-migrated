import { useEffect, useState } from 'react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../lib/firebase';
import { lessons as fallbackLessons } from '../data/lessons';

export function useLessons() {
  const [lessons, setLessons] = useState(fallbackLessons);
  const [source, setSource] = useState('fallback');
  const [loading, setLoading] = useState(isFirebaseConfigured);

  useEffect(() => {
    if (!isFirebaseConfigured) return;

    let cancelled = false;

    async function fetchLessons() {
      try {
        const q = query(collection(db, 'lessons'), orderBy('order', 'asc'));
        const snapshot = await getDocs(q);
        if (cancelled) return;

        if (!snapshot.empty) {
          const docs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          setLessons(docs);
          setSource('firestore');
        }
      } catch (error) {
        console.warn('Falling back to local lesson content:', error.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchLessons();
    return () => {
      cancelled = true;
    };
  }, []);

  return { lessons, loading, source };
}

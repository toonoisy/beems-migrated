import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'beems-theme';

function systemPrefersDark() {
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
}

function getInitialTheme() {
  const stored = document.documentElement.getAttribute('data-theme');
  if (stored === 'light' || stored === 'dark') return stored;
  return systemPrefersDark() ? 'dark' : 'light';
}

// Tracks the effective light/dark theme and lets the user override the
// system preference. index.html applies any stored choice before first
// paint (avoiding a flash); this hook keeps React and the DOM in sync
// after that and persists future changes.
export function useTheme() {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    const media = window.matchMedia?.('(prefers-color-scheme: dark)');
    if (!media) return;

    function handleChange(event) {
      // Only follow the system when the user hasn't set an explicit choice.
      let hasStoredChoice = false;
      try {
        hasStoredChoice = localStorage.getItem(STORAGE_KEY) !== null;
      } catch {
        // ignore
      }
      if (!hasStoredChoice) setTheme(event.matches ? 'dark' : 'light');
    }

    media.addEventListener('change', handleChange);
    return () => media.removeEventListener('change', handleChange);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((current) => {
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch {
        // Private browsing / blocked storage — theme still applies for this load.
      }
      return next;
    });
  }, []);

  return { theme, toggleTheme };
}

import { useState } from 'react';
import './BilingualVideo.css';

type Lang = 'en' | 'hi';

interface BilingualVideoProps {
  title: string;
  videoUrlEn?: string | null;
  videoUrlHi?: string | null;
}

// The source site embeds a separate English and Hindi video per lesson.
// This renders those (once seeded to Firestore/Storage) with a language
// toggle, or a placeholder player if a URL hasn't been provided yet.
export default function BilingualVideo({ title, videoUrlEn, videoUrlHi }: BilingualVideoProps) {
  const [lang, setLang] = useState<Lang>('en');
  const activeUrl = lang === 'en' ? videoUrlEn : videoUrlHi;

  return (
    <div className="bilingual-video">
      <div className="bilingual-video__tabs" role="tablist" aria-label="Video language">
        <button
          type="button"
          role="tab"
          aria-selected={lang === 'en'}
          className={lang === 'en' ? 'is-active' : ''}
          onClick={() => setLang('en')}
        >
          English
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={lang === 'hi'}
          className={lang === 'hi' ? 'is-active' : ''}
          onClick={() => setLang('hi')}
        >
          हिन्दी Hindi
        </button>
      </div>

      <div className="bilingual-video__frame">
        {activeUrl ? (
          <video key={activeUrl} className="bilingual-video__player" controls src={activeUrl} />
        ) : (
          <div className="bilingual-video__placeholder">
            <span className="bilingual-video__play" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
                <path d="M8 5v14l11-7L8 5Z" />
              </svg>
            </span>
            <p>
              {title} <span>&middot; {lang === 'en' ? 'English' : 'Hindi'} version</span>
            </p>
            <small>Video coming soon — placeholder</small>
          </div>
        )}
      </div>
    </div>
  );
}

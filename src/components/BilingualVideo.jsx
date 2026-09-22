import { useState } from 'react';
import './BilingualVideo.css';

// The source site embeds a separate English and Hindi video per lesson.
// Real footage isn't available yet, so this renders a placeholder player
// with a language toggle in its place — swap `videoUrlEn` / `videoUrlHi`
// for real Firebase Storage download URLs once footage is uploaded.
export default function BilingualVideo({ title, videoUrlEn, videoUrlHi }) {
  const [lang, setLang] = useState('en');
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

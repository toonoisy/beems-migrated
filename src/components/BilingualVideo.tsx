import { useState } from 'react';
import './BilingualVideo.css';

type Lang = 'en' | 'hi';

interface BilingualVideoProps {
  title: string;
  videosEn?: string[] | null;
  videosHi?: string[] | null;
}

// Each lesson has a separate English and Hindi video on Vimeo, and some
// are split into parts. This embeds the Vimeo player with a language
// toggle (plus a part picker when there's more than one part), or a
// placeholder player if no video has been provided yet.
export default function BilingualVideo({ title, videosEn, videosHi }: BilingualVideoProps) {
  const [lang, setLang] = useState<Lang>('en');
  const [part, setPart] = useState(0);
  const videos = (lang === 'en' ? videosEn : videosHi) ?? [];
  const activeUrl = videos[part] ?? videos[0];
  const langLabel = lang === 'en' ? 'English' : 'Hindi';

  function selectLang(next: Lang) {
    setLang(next);
    setPart(0);
  }

  return (
    <div className="bilingual-video">
      <div className="bilingual-video__controls">
        <div className="bilingual-video__tabs" role="tablist" aria-label="Video language">
          <button
            type="button"
            role="tab"
            aria-selected={lang === 'en'}
            className={lang === 'en' ? 'is-active' : ''}
            onClick={() => selectLang('en')}
          >
            English
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={lang === 'hi'}
            className={lang === 'hi' ? 'is-active' : ''}
            onClick={() => selectLang('hi')}
          >
            हिन्दी Hindi
          </button>
        </div>

        {videos.length > 1 && (
          <div className="bilingual-video__tabs" role="tablist" aria-label="Video part">
            {videos.map((url, index) => (
              <button
                key={url}
                type="button"
                role="tab"
                aria-selected={part === index}
                className={part === index ? 'is-active' : ''}
                onClick={() => setPart(index)}
              >
                Part {index + 1}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="bilingual-video__frame">
        {activeUrl ? (
          <iframe
            key={activeUrl}
            className="bilingual-video__player"
            src={activeUrl}
            title={videos.length > 1 ? `${title} (${langLabel}, part ${part + 1})` : `${title} (${langLabel})`}
            allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        ) : (
          <div className="bilingual-video__placeholder">
            <span className="bilingual-video__play" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
                <path d="M8 5v14l11-7L8 5Z" />
              </svg>
            </span>
            <p>
              {title} <span>&middot; {langLabel} version</span>
            </p>
            <small>Video coming soon — placeholder</small>
          </div>
        )}
      </div>
    </div>
  );
}

import type { PlaceholderIcon, PlaceholderTone } from '../types';
import './PlaceholderImage.css';

const ICONS: Record<PlaceholderIcon, React.ReactNode> = {
  family: (
    <path d="M32 34a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm-22 26c0-11 9-18 22-18s22 7 22 18" />
  ),
  video: <path d="M14 18h26a4 4 0 0 1 4 4v20a4 4 0 0 1-4 4H14a4 4 0 0 1-4-4V22a4 4 0 0 1 4-4Zm34 8 10-6v28l-10-6" />,
  community: (
    <path d="M20 30a7 7 0 1 0 0-14 7 7 0 0 0 0 14Zm24 0a7 7 0 1 0 0-14 7 7 0 0 0 0 14ZM6 54c0-8.8 6.7-14 14-14s14 5.2 14 14M30 54c0-8.8 6.7-14 14-14s14 5.2 14 14" />
  ),
  message: <path d="M10 14h44a2 2 0 0 1 2 2v28a2 2 0 0 1-2 2H24l-10 8v-8h-4a2 2 0 0 1-2-2V16a2 2 0 0 1 2-2Z" />,
};

interface PlaceholderImageProps {
  icon?: PlaceholderIcon;
  label?: string;
  tone?: PlaceholderTone;
  className?: string;
}

export default function PlaceholderImage({ icon = 'family', label, tone = 'primary', className = '' }: PlaceholderImageProps) {
  return (
    <div className={`placeholder-image placeholder-image--${tone} ${className}`} role="img" aria-label={label || 'Placeholder image'}>
      <svg width="64" height="64" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        {ICONS[icon] || ICONS.family}
      </svg>
      {label ? <span>{label}</span> : null}
    </div>
  );
}

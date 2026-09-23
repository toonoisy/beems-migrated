export interface Lesson {
  id: string;
  order: number;
  title: string;
  summary: string;
  thumbnailUrl?: string | null;
  videoUrlEn?: string | null;
  videoUrlHi?: string | null;
}

export interface HomeIntro {
  introVideoUrlEn: string | null;
  introVideoUrlHi: string | null;
}

export type Theme = 'light' | 'dark';

export type PlaceholderTone = 'primary' | 'accent' | 'muted';

export type PlaceholderIcon = 'family' | 'video' | 'community' | 'message';

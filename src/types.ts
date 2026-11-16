export interface Lesson {
  id: string;
  order: number;
  title: string;
  summary: string;
  thumbnailUrl?: string | null;
  // Vimeo player URLs, one per part (most lessons have a single part).
  videosEn?: string[];
  videosHi?: string[];
}

export interface HomeIntro {
  introVideosEn: string[];
  introVideosHi: string[];
}

export type Theme = 'light' | 'dark';

export type PlaceholderTone = 'primary' | 'accent' | 'muted';

export type PlaceholderIcon = 'family' | 'video' | 'community' | 'message';

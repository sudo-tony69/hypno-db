// src/utils/audio.ts
export interface Track {
  id: string;
  title: string;
  artist: string;
  duration: string;
  bpm?: string;
  key?: string;
  format?: string;
  bitrate?: string;
  fileSize?: string;
  releaseDate: string;
  audience: string;
  tags: string[];
  description: string;
  audioUrl: string;
  artwork: string;
}

export interface Artist {
  name: string;
  bio: string;
  genre: string;
  avatar: string;
  banner: string;
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}
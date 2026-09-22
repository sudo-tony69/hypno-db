// src/utils/audio.ts
export interface Track {
  id: string;
  slug: string;
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

export interface ArtistSocials {
  website?: string;
  spotify?: string;
  bandcamp?: string;
}

export interface Artist {
  id: string;
  slug: string;
  name: string;
  bio: string;
  genre: string;
  avatar: string;
  banner: string;
  socials?: ArtistSocials;
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function normalizeArtists(rawArtists: unknown): Artist[] {
  const artists = Array.isArray(rawArtists) ? rawArtists : rawArtists ? [rawArtists] : [];

  return artists
    .filter(Boolean)
    .map((artist: any, index: number) => {
      const name = typeof artist?.name === 'string' && artist.name.trim() ? artist.name.trim() : `Artist ${index + 1}`;
      const id = typeof artist?.id === 'string' && artist.id.trim() ? artist.id.trim() : slugify(name) || `artist-${index + 1}`;
      const slug = typeof artist?.slug === 'string' && artist.slug.trim() ? artist.slug.trim() : slugify(id) || `artist-${index + 1}`;

      return {
        id,
        slug,
        name,
        genre: typeof artist?.genre === 'string' ? artist.genre : 'Unspecified genre',
        bio: typeof artist?.bio === 'string' ? artist.bio : 'No bio available.',
        avatar: typeof artist?.avatar === 'string' ? artist.avatar : '/favicon.svg',
        banner: typeof artist?.banner === 'string' ? artist.banner : '/favicon.svg',
        socials: {
          website: artist?.socials?.website ?? '',
          spotify: artist?.socials?.spotify ?? '',
          bandcamp: artist?.socials?.bandcamp ?? ''
        }
      } satisfies Artist;
    });
}

export function normalizeTracks(rawTracks: unknown): Track[] {
  const tracks = Array.isArray(rawTracks) ? rawTracks : rawTracks ? [rawTracks] : [];

  return tracks
    .filter(Boolean)
    .map((track: any, index: number) => {
      const title = typeof track?.title === 'string' && track.title.trim() ? track.title.trim() : `Track ${index + 1}`;
      const slug = typeof track?.slug === 'string' && track.slug.trim() ? track.slug.trim() : slugify(title) || `track-${index + 1}`;

      return {
        id: typeof track?.id === 'string' && track.id.trim() ? track.id : `track-${index + 1}`,
        slug,
        title,
        artist: typeof track?.artist === 'string' ? track.artist : 'Unknown Artist',
        duration: typeof track?.duration === 'string' ? track.duration : '0:00',
        bpm: track?.bpm,
        key: track?.key,
        format: track?.format,
        bitrate: track?.bitrate,
        fileSize: track?.fileSize,
        releaseDate: typeof track?.releaseDate === 'string' ? track.releaseDate : '',
        audience: typeof track?.audience === 'string' ? track.audience : 'General',
        tags: Array.isArray(track?.tags) ? track.tags.filter(Boolean).map(String) : [],
        description: typeof track?.description === 'string' ? track.description : '',
        audioUrl: typeof track?.audioUrl === 'string' ? track.audioUrl : '',
        artwork: typeof track?.artwork === 'string' ? track.artwork : '/favicon.svg'
      } satisfies Track;
    });
}

export function resolveArtistSlug(name: string | undefined, artists: Artist[] = []): string {
  const safeName = name?.trim();
  if (!safeName) return 'unknown-artist';

  const exactMatch = artists.find((artist) => artist.name.toLowerCase() === safeName.toLowerCase());
  if (exactMatch) return exactMatch.slug || exactMatch.id || slugify(safeName);

  const slugMatch = artists.find((artist) => artist.slug === slugify(safeName));
  if (slugMatch) return slugMatch.slug;

  return slugify(safeName) || 'unknown-artist';
}
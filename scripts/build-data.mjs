import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const dataDir = path.join(rootDir, 'public', 'data');
const sourcePath = path.join(dataDir, 'catalog.json');

function slugify(value) {
  return String(value)
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function normalizeAssetPath(value, fallback = '/favicon.svg') {
  const raw = String(value ?? '').trim();
  if (!raw) return fallback;
  if (/^(https?:|data:|\/)/.test(raw)) return raw;
  return `/${raw.replace(/^\.?\//, '')}`;
}

const source = JSON.parse(readFileSync(sourcePath, 'utf8'));
const artists = Array.isArray(source.artists) ? source.artists : [];
const tracks = Array.isArray(source.tracks) ? source.tracks : [];

const normalizedArtists = artists.map((artist, index) => ({
  id: String(artist.id || artist.slug || slugify(artist.name) || `artist-${index + 1}`),
  slug: String(artist.slug || slugify(artist.name) || `artist-${index + 1}`),
  name: String(artist.name || `Artist ${index + 1}`),
  genre: String(artist.genre || 'Unspecified genre'),
  bio: String(artist.bio || 'No bio available.'),
  avatar: normalizeAssetPath(artist.avatar),
  banner: normalizeAssetPath(artist.banner),
  socials: {
    website: artist.socials?.website ?? '',
    spotify: artist.socials?.spotify ?? '',
    bandcamp: artist.socials?.bandcamp ?? ''
  }
}));

const normalizedTracks = tracks.map((track, index) => ({
  id: String(track.id || `track-${index + 1}`),
  slug: String(track.slug || slugify(track.title) || `track-${index + 1}`),
  title: String(track.title || `Track ${index + 1}`),
  artist: String(track.artist || 'Unknown Artist'),
  artwork: normalizeAssetPath(track.artwork),
  audioUrl: String(track.audioUrl || ''),
  description: String(track.description || ''),
  duration: String(track.duration || '0:00'),
  releaseDate: String(track.releaseDate || ''),
  audience: String(track.audience || 'General'),
  tags: Array.isArray(track.tags) ? track.tags.filter(Boolean).map(String) : [],
  triggers: Array.isArray(track.triggers) ? track.triggers.filter(Boolean).map(String) : [],
  fileSize: String(track.fileSize || ''),
  bitrate: String(track.bitrate || ''),
  bpm: String(track.bpm || ''),
  key: String(track.key || ''),
  format: String(track.format || '')
}));

const tagCounts = new Map();
for (const track of normalizedTracks) {
  for (const tag of track.tags) {
    tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
  }
}
const tags = [...tagCounts.entries()]
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([name, count]) => ({
    name,
    slug: slugify(name),
    count
  }));

const triggerCounts = new Map();
for (const track of normalizedTracks) {
  for (const trigger of track.triggers) {
    triggerCounts.set(trigger, (triggerCounts.get(trigger) || 0) + 1);
  }
}
const triggers = [...triggerCounts.entries()]
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([name, count]) => ({
    name,
    slug: slugify(name),
    count
  }));

mkdirSync(dataDir, { recursive: true });
writeFileSync(path.join(dataDir, 'artist.json'), `${JSON.stringify(normalizedArtists, null, 2)}\n`);
writeFileSync(path.join(dataDir, 'tracks.json'), `${JSON.stringify(normalizedTracks, null, 2)}\n`);
writeFileSync(path.join(dataDir, 'tags.json'), `${JSON.stringify(tags, null, 2)}\n`);
writeFileSync(path.join(dataDir, 'triggers.json'), `${JSON.stringify(triggers, null, 2)}\n`);

console.log(`Generated data files from ${sourcePath}`);
console.log(`Artists: ${normalizedArtists.length}`);
console.log(`Tracks: ${normalizedTracks.length}`);
console.log(`Tags: ${tags.length}`);
console.log(`Triggers: ${triggers.length}`);

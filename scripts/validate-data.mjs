import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const sourcePath = path.join(rootDir, 'public', 'data', 'catalog.json');
const schemaPath = path.join(rootDir, 'public', 'data', 'catalog.schema.json');

const schema = JSON.parse(readFileSync(schemaPath, 'utf8'));

const source = JSON.parse(readFileSync(sourcePath, 'utf8'));
const artists = Array.isArray(source.artists) ? source.artists : [];
const tracks = Array.isArray(source.tracks) ? source.tracks : [];

const fail = (message) => {
  throw new Error(`Data validation failed: ${message}`);
};

const validateSchemaNode = (value, schemaNode, path = '$') => {
  if (!schemaNode || typeof schemaNode !== 'object') return;

  if (schemaNode.type) {
    if (schemaNode.type === 'object' && (value === null || typeof value !== 'object' || Array.isArray(value))) {
      fail(`${path} must be an object`);
    }
    if (schemaNode.type === 'array' && !Array.isArray(value)) {
      fail(`${path} must be an array`);
    }
    if (schemaNode.type === 'string' && typeof value !== 'string') {
      fail(`${path} must be a string`);
    }
    if (schemaNode.type === 'number' && typeof value !== 'number') {
      fail(`${path} must be a number`);
    }
  }

  if (schemaNode.required && typeof value === 'object' && value && !Array.isArray(value)) {
    for (const requiredKey of schemaNode.required) {
      if (!(requiredKey in value)) {
        fail(`${path} is missing required property: ${requiredKey}`);
      }
    }
  }

  if (schemaNode.pattern && typeof value === 'string' && !new RegExp(schemaNode.pattern).test(value)) {
    fail(`${path} does not match required pattern: ${schemaNode.pattern}`);
  }

  if (schemaNode.minLength && typeof value === 'string' && value.length < schemaNode.minLength) {
    fail(`${path} must be at least ${schemaNode.minLength} characters`);
  }

  if (schemaNode.properties && value && typeof value === 'object' && !Array.isArray(value)) {
    for (const [key, propertySchema] of Object.entries(schemaNode.properties)) {
      if (key in value) {
        validateSchemaNode(value[key], propertySchema, `${path}.${key}`);
      }
    }
  }

  if (schemaNode.items && Array.isArray(value)) {
    value.forEach((item, index) => validateSchemaNode(item, schemaNode.items, `${path}[${index}]`));
  }

  if (schemaNode.$ref) {
    const refTarget = schemaNode.$ref.replace(/^#\//, '').split('/').reduce((ref, segment) => ref[segment], schema);
    validateSchemaNode(value, refTarget, path);
  }
};

if (!artists.length) fail('catalog.json must contain at least one artist');
if (!tracks.length) fail('catalog.json must contain at least one track');

validateSchemaNode(source, schema, '$');

const isSlug = (value) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(String(value ?? ''));
const hasOnlyRootAssetPaths = (value) => typeof value === 'string' && /^(?:\/|https?:|data:)/.test(value);

const artistIds = new Set();
for (const [index, artist] of artists.entries()) {
  if (!artist || typeof artist !== 'object') fail(`Artist at index ${index} is invalid`);
  const id = String(artist.id || '').trim();
  const name = String(artist.name || '').trim();
  const slug = String(artist.slug || '').trim();

  if (!id) fail(`Artist at index ${index} is missing an id`);
  if (!name) fail(`Artist "${id}" is missing a name`);
  if (!slug || !isSlug(slug)) fail(`Artist "${id}" has an invalid slug: ${artist.slug}`);
  if (artistIds.has(id)) fail(`Duplicate artist id: ${id}`);
  if (typeof artist.avatar === 'string' && artist.avatar.startsWith('./')) {
    fail(`Artist "${id}" uses a route-relative avatar path. Use "/images/..." instead.`);
  }
  if (typeof artist.banner === 'string' && artist.banner.startsWith('./')) {
    fail(`Artist "${id}" uses a route-relative banner path. Use "/images/..." instead.`);
  }
  if (!hasOnlyRootAssetPaths(artist.avatar)) fail(`Artist "${id}" avatar must start with "/", "https://", or "data:"`);
  if (!hasOnlyRootAssetPaths(artist.banner)) fail(`Artist "${id}" banner must start with "/", "https://", or "data:"`);
  artistIds.add(id);
}

const trackIds = new Set();
for (const [index, track] of tracks.entries()) {
  if (!track || typeof track !== 'object') fail(`Track at index ${index} is invalid`);
  const id = String(track.id || '').trim();
  const slug = String(track.slug || '').trim();
  const title = String(track.title || '').trim();
  const artist = String(track.artist || '').trim();
  const audioUrl = String(track.audioUrl || '').trim();

  if (!id) fail(`Track at index ${index} is missing an id`);
  if (!slug || !isSlug(slug)) fail(`Track "${id}" has an invalid slug: ${track.slug}`);
  if (!title) fail(`Track "${id}" is missing a title`);
  if (!artist) fail(`Track "${title}" is missing an artist`);
  if (!audioUrl) fail(`Track "${title}" is missing an audioUrl`);
  if (typeof track.artwork === 'string' && track.artwork.startsWith('./')) {
    fail(`Track "${title}" uses a route-relative artwork path. Use "/images/..." instead.`);
  }
  if (!hasOnlyRootAssetPaths(track.artwork)) fail(`Track "${title}" artwork must start with "/", "https://", or "data:"`);
  if (!hasOnlyRootAssetPaths(track.audioUrl)) fail(`Track "${title}" audioUrl must start with "/", "https://", or "data:"`);
  if (!artists.some((artistItem) => artistItem.name === artist || artistItem.id === artist)) {
    fail(`Track "${title}" references unknown artist: ${artist}`);
  }
  if (trackIds.has(id)) fail(`Duplicate track id: ${id}`);
  trackIds.add(id);
}

console.log(`Validated ${artists.length} artists and ${tracks.length} tracks in ${sourcePath}`);

# Hypno DB

Hypno DB is a lightweight Astro catalog for ambient, synth-driven, and cinematic music releases. It surfaces artist pages, file details, tag filters, and an in-page audio player while keeping the data model easy to maintain.

## Project goals

- Browse a curated catalog of audio files and artist profiles
- Expose tags and triggers as navigable discovery layers
- Display release metadata clearly without relying on a backend
- Keep content data easy to edit in JSON files

## Tech stack

- Astro
- Static JSON content
- Vanilla CSS within Astro layout/style blocks

## Local development

```bash
npm install
npm run dev
```

Then open the local Astro URL shown in the terminal.

## Production build

```bash
npm run build
npm run preview
```

## Data structure

The editable source of truth is:

- `public/data/catalog.json`

This file is compiled into generated JSON files used by the site:

- `public/data/artist.json`
- `public/data/tracks.json`
- `public/data/tags.json`
- `public/data/triggers.json`

The schema is defined in:

- `public/data/catalog.schema.json`

A ready-to-copy starter template is available at:

- `public/data/catalog.template.json`

### Editing workflow

1. Copy the template or edit the master catalog.
2. Keep `id` and `slug` values stable and lowercase-hyphenated.
3. Use root-relative asset paths such as `/images/...`.
4. Run `npm run build` to regenerate derived JSON files.

Example record:

```json
{
  "id": "aetheria",
  "slug": "aetheria",
  "name": "Aetheria",
  "genre": "Ambient / Electronic / Soundscapes",
  "bio": "...",
  "avatar": "/images/artists/aetheria-avatar.svg",
  "banner": "/images/artists/aetheria-banner.svg",
  "socials": {
    "website": "https://example.com",
    "spotify": "",
    "bandcamp": ""
  }
}
```

Tracks should also include a stable `slug` and use root-relative image paths.

## Recommended next improvements

- Add schema validation for JSON content
- Split inline styles into reusable components and CSS files
- Add tests for static routes and data normalization
- Replace placeholder artist links with real URLs
- Expand the catalog with more real releases and metadata


# Jayanti Nagari 7 — Community Magazine

Angular 20 quarterly magazine for a residential community. Published content is version-controlled JSON bundled with the static site; no database or content SDK is required.

## Run locally
1. Install Node.js 20+.
2. In this folder run `npm install`.
3. Start the app with `npm start`.
4. Open the local Angular URL shown in the terminal.

## Project overview
- Magazine-style landing page and issue layout
- Editorial stories with category filters
- Events and community updates
- Photo gallery with masonry layout and image viewer
- Resident and neighbourhood profiles
- Community services and local business listings
- Archive pages for past editions
- Responsive layout for desktop and mobile
- Strict TypeScript and standalone Angular components

## Content publishing workflow
1. Add a new edition JSON file under `src/assets/data/editions/` using an ID such as `2026-q4.json`.
2. Follow the existing edition structure: metadata (`id`, `title`, `quarter`, `year`, `published`) plus arrays for `stories`, `events`, `community`, `articles`, `gallery`, `announcements`, and `advertisements`.
3. Add the edition metadata to `src/assets/data/manifest.json` and set `currentEdition` to the edition that should show on the site.
4. Put images in `src/assets/images/gallery/` and let the generator rebuild the `gallery` array automatically.
5. Commit and push the JSON changes. The static-site deployment workflow rebuilds and publishes the app.

## Automatic gallery sync
This project includes a gallery generator that keeps the JSON and image folder aligned.

Commands:
- `node scripts/generate-gallery.mjs` or `npm run generate-gallery` — rebuild the `gallery` array from the image folder.
- `node scripts/generate-gallery.mjs --preview` or `npm run generate-gallery:preview` — preview the generated entries without writing the JSON file.
- `node scripts/generate-gallery.mjs --watch` or `npm run generate-gallery:watch` — watch the gallery folder and sync changes automatically as images are added, replaced, or removed.

Behavior:
- Reads the active edition from `src/assets/data/manifest.json`.
- Uses the images in `src/assets/images/gallery/` as the source of truth.
- Generates `title`, `category`, and `url` for each image entry.
- Auto-classifies images based on common folder naming patterns such as `cricket`, `festival`, `ganesh`, and `community`.
- Keeps the edition JSON in sync without manually editing the gallery section.

## Notes
- The `gallery` array is generated from the image folder, so if you add or delete a file, the next sync updates the site content automatically.
- The manifest and edition files are loaded through Angular `HttpClient` from `assets/data/`.
- Missing files, invalid IDs, or malformed edition JSON are surfaced in the app instead of being silently replaced by mock data.
- In some Windows environments, PowerShell script execution policies may block `npm` commands. If that happens, run the generator directly with Node instead: `node scripts/generate-gallery.mjs`.

# Jayanti Nagari 7 — Community Magazine

Angular 20 quarterly magazine for a residential community. Published content is version-controlled JSON bundled with the static site; no database or content SDK is required.

## Run
1. Install Node.js 20+.
2. In this folder run `npm install`.
3. Run `npm start`.
4. Open the local Angular URL shown in the terminal.

## Current MVP
- Magazine-style home page
- Stories with category filters
- Events
- Photo gallery
- People / resident stories
- Community corner: jobs, businesses and trusted services
- Magazine archive
- Contribution modal
- Responsive mobile layout
- Strict TypeScript and standalone Angular components

## Content publishing
1. Add an edition JSON file under `src/assets/data/editions/`, using an ID such as `2026-q4.json`.
2. Follow the existing edition structure: metadata (`id`, `title`, `quarter`, `year`, `published`) and arrays for `stories`, `events`, `community`, `articles`, `gallery`, `announcements`, and `advertisements`.
3. Add the edition metadata to `src/assets/data/manifest.json`. Set `currentEdition` to the ID of the edition that should appear on the home page.
4. Commit and push the JSON changes. The existing static-site deployment workflow rebuilds and publishes the site.

The manifest and edition files are loaded with Angular `HttpClient` from `assets/data/`. Missing files, unavailable edition IDs, and invalid JSON structures are surfaced in the site rather than silently replaced with mock content.

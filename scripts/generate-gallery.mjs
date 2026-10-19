import fs from 'node:fs';
import path from 'node:path';

const args = new Set(process.argv.slice(2));
const watchMode = args.has('--watch');
const previewMode = args.has('--preview');
const editionOverride = [...args].find((arg) => arg.startsWith('--edition='));

const rootDir = process.cwd();
const galleryDir = path.join(rootDir, 'src/assets/images/gallery');
const manifestPath = path.join(rootDir, 'src/assets/data/manifest.json');

const categoryMap = [
  { pattern: /ganesh|ganpati|utsav|festival|puja|bappa|garba|dancer|dance|aarti|idol|mandap|prasad|visarjan/i, category: 'Ganesh Utsav' },
  { pattern: /cricket|team|tournament|players|fans|victory|boundary|huddle|league|captain|score|stadium/i, category: 'Cricket' },
  { pattern: /community|society|people|meeting|gathering|residents|neighbours|night|jayanti|nagari|cha|raja|life|family|friends|portrait|child|young|moment/i, category: 'Society Life' },
  { pattern: /achievement|achievements|topper|student|kids|junior|youth/i, category: 'Community Gallery' }
];

function readJson(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(raw);
}

function toTitle(value) {
  return value
    .replace(/[-_]+/g, ' ')
    .replace(/\.[^.]+$/, '')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function getCategory(fileName) {
  const name = fileName.toLowerCase();
  const match = categoryMap.find(({ pattern }) => pattern.test(name));
  return match ? match.category : 'Community Gallery';
}

function getEditionFile() {
  const manifest = readJson(manifestPath);
  const editionId = editionOverride ? editionOverride.split('=')[1] : manifest.currentEdition;

  if (!editionId || typeof editionId !== 'string') {
    throw new Error('No current edition is configured in src/assets/data/manifest.json.');
  }

  const editionFile = path.join(rootDir, 'src/assets/data/editions', `${editionId}.json`);
  if (!fs.existsSync(editionFile)) {
    throw new Error(`Edition file not found: ${editionFile}`);
  }

  return editionFile;
}

function buildGalleryEntries() {
  if (!fs.existsSync(galleryDir)) {
    throw new Error(`Gallery directory not found: ${galleryDir}`);
  }

  const files = fs.readdirSync(galleryDir)
    .filter((file) => /\.(jpe?g|png|webp|gif)$/i.test(file))
    .sort((a, b) => a.localeCompare(b));

  return files.map((file) => ({
    title: toTitle(file),
    category: getCategory(file),
    url: `assets/images/gallery/${file}`
  }));
}

function updateGallery() {
  const editionFile = getEditionFile();
  const gallery = buildGalleryEntries();
  const edition = readJson(editionFile);

  if (!edition || typeof edition !== 'object' || !Array.isArray(edition.gallery)) {
    throw new Error(`Edition file does not contain a gallery array: ${editionFile}`);
  }

  const nextContent = `${JSON.stringify({ ...edition, gallery }, null, 2)}\n`;
  const previousContent = fs.readFileSync(editionFile, 'utf8');

  if (previewMode) {
    console.log(`Preview for ${path.basename(editionFile)} (${gallery.length} image(s)):`);
    console.log(JSON.stringify(gallery.slice(0, 10), null, 2));
    return;
  }

  if (previousContent !== nextContent) {
    fs.writeFileSync(editionFile, nextContent);
  }

  console.log(`Gallery synced: ${gallery.length} image(s) in ${path.basename(editionFile)}.`);
}

updateGallery();

if (watchMode && !previewMode) {
  let timer;

  const scheduleRefresh = () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      try {
        updateGallery();
      } catch (error) {
        console.error(error.message);
      }
    }, 150);
  };

  fs.watch(galleryDir, { persistent: true }, (eventType, filename) => {
    if (!filename) return;

    const isImage = /\.(jpe?g|png|webp|gif)$/i.test(filename);
    if (eventType === 'rename' || eventType === 'change') {
      if (isImage || filename === 'gallery') {
        scheduleRefresh();
      }
    }
  });

  console.log(`Watching ${galleryDir} for image changes...`);
}


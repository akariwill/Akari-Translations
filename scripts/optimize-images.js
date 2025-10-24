const fs = require('fs').promises;
const path = require('path');
const sharp = require('sharp');

const MANGA_DIR = path.join(process.cwd(), 'public', 'manga');
const MAX_WIDTH = 1200; // Maximum width for the images
const QUALITY = 80; // Quality for WebP conversion (0-100)

async function optimizeImage(filePath) {
  try {
    const originalBuffer = await fs.readFile(filePath);
    const image = sharp(originalBuffer);

    const metadata = await image.metadata();

    // Only resize if the image is wider than MAX_WIDTH
    if (metadata.width && metadata.width > MAX_WIDTH) {
      image.resize({ width: MAX_WIDTH });
    }

    // Convert to WebP and compress
    const webpBuffer = await image.webp({ quality: QUALITY }).toBuffer();

    // Determine the new file path with .webp extension
    const parsedPath = path.parse(filePath);
    const newFilePath = path.join(parsedPath.dir, `${parsedPath.name}.webp`);

    await fs.writeFile(newFilePath, webpBuffer);

    // If the new file is different from the old one, remove the old one
    if (newFilePath !== filePath) {
      await fs.unlink(filePath);
    }

    console.log(`Optimized: ${filePath} -> ${newFilePath}`);
    return true;
  } catch (error) {
    console.error(`Failed to optimize ${filePath}:`, error);
    return false;
  }
}

async function findAndOptimizeImages(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await findAndOptimizeImages(fullPath);
    } else if (/\.(jpg|jpeg|png|gif)$/i.test(entry.name)) {
      await optimizeImage(fullPath);
    }
  }
}

async function main() {
  console.log('Starting image optimization process...');
  console.log(`Max width: ${MAX_WIDTH}px`);
  console.log(`WebP quality: ${QUALITY}`);
  console.log('------------------------------------');

  await findAndOptimizeImages(MANGA_DIR);

  console.log('------------------------------------');
  console.log('Image optimization complete.');
  console.log('You may need to update the generate-manga-data.js script to look for .webp files if you haven\'t already.');
}

main();

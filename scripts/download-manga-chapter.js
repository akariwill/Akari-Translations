const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch').default;

const EXTENSIONS = ['png', 'jpg', 'jpeg', 'webp'];

const MANGA_METADATA = {
  "Chitose-Kun-wa-Ramune-Bin-no-Naka": {
    baseUrl: "https://ytimgf.youtube-anime.com/images133/aFReNYSRgNwNvyCjq/",
  },
  // "Another-Manga-Title": {
  //   baseUrl: "https://example.com/manga/another-manga-title",
  // },
};

// Define your download jobs here
const DOWNLOAD_JOBS = [
  {
    mangaTitle: "Chitose-Kun-wa-Ramune-Bin-no-Naka",
    // Specify chapter number and its configuration
    chapters: {
      "21": { imageCount: 45, sub: "sub_1728494838" },
      "22": { imageCount: 45, sub: "sub_1728494858" },
      "23": { imageCount: 45, sub: "sub_1728494883" },
      "24": { imageCount: 48, sub: "sub_1728494903" },
      "24.5": { imageCount: 6, sub: "sub_1750715765" },
      "25": { imageCount: 63, sub: "sub_1756736182" },
      "26": { imageCount: 65, sub: "sub_1756810559" },
      "27": { imageCount: 52, sub: "sub_1756810605" },
      "28": { imageCount: 52, sub: "sub_1756810645" },
      "28.5": { imageCount: 4, sub: "sub_1756810686" },
    },
  },
  // {
  //   mangaTitle: "Another-Manga-Title",
  //   chapters: {
  //     "10": { imageCount: 20 },
  //     "11": { imageCount: 22, sub: "custom_sub" },
  //   },
  // },
];



async function downloadImage(imageUrl, filePath) {
  try {
    const response = await fetch(imageUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    if (response.ok) {
      const buffer = await response.buffer();
      fs.writeFileSync(filePath, buffer);
      console.log(`Downloaded: ${filePath}`);
      return true;
    }
    if (response.status === 404) {
      return false; // Image not found
    }
    console.warn(`Failed to download ${imageUrl}: Status ${response.status}`);
    return false;
  } catch (error) {
    console.error(`Error downloading ${imageUrl}:`, error.message);
    return false;
  }
}

async function downloadMangaChapter(mangaTitle, chapterNumber, baseUrl, imageCount, sub = 'sub') {
  const chapterFolderName = `Chapter ${chapterNumber}`;
  const targetDir = path.join(process.cwd(), 'public', 'manga', mangaTitle, chapterFolderName);

  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
    console.log(`Created directory: ${targetDir}`);
  }

  console.log(`\nStarting download for ${mangaTitle} - Chapter ${chapterNumber} (${imageCount} images)`);

  for (let i = 1; i <= imageCount; i++) {
    let downloaded = false;
    for (const ext of EXTENSIONS) {
      const imageUrl = `${baseUrl}/${chapterNumber}/${sub}/${i}.${ext}`;
      const fileName = `${String(i).padStart(3, '0')}.${ext}`;
      const filePath = path.join(targetDir, fileName);

      if (await downloadImage(imageUrl, filePath)) {
        downloaded = true;
        break;
      }
    }
    if (!downloaded) {
      console.warn(`Could not download page ${i} for ${mangaTitle} - Chapter ${chapterNumber}.`);
    }
  }
  console.log(`Finished downloading ${mangaTitle} - Chapter ${chapterNumber}.`);
}

async function main() {
  if (!DOWNLOAD_JOBS || DOWNLOAD_JOBS.length === 0) {
    console.log('No download jobs found in the configuration.');
    return;
  }

  console.log(`Found ${DOWNLOAD_JOBS.length} download job(s).`);

  for (const job of DOWNLOAD_JOBS) {
    const { mangaTitle, chapters } = job;

    if (!mangaTitle || !chapters) {
      console.error(`Skipping invalid job: ${JSON.stringify(job)}. Each job must have "mangaTitle" and "chapters".`);
      continue;
    }

    const mangaMetadata = MANGA_METADATA[mangaTitle];
    if (!mangaMetadata) {
      console.error(`Manga title "${mangaTitle}" not found in MANGA_METADATA.`);
      continue;
    }

    const chapterEntries = Object.entries(chapters);
    if (chapterEntries.length === 0) {
      console.error(`No chapters specified for job "${mangaTitle}".`);
      continue;
    }

    console.log(`\nProcessing job for "${mangaTitle}"...`);

    for (const [chapterNum, chapterData] of chapterEntries) {
      // Handle both object and direct number for chapterData for backward compatibility
      const imageCount = typeof chapterData === 'object' ? chapterData.imageCount : chapterData;
      const sub = typeof chapterData === 'object' ? chapterData.sub : undefined;

      if (!imageCount) {
        console.error(`Skipping chapter ${chapterNum} for "${mangaTitle}" due to missing imageCount.`);
        continue;
      }

      await downloadMangaChapter(
        mangaTitle,
        chapterNum,
        mangaMetadata.baseUrl,
        imageCount,
        sub // Pass sub; it will be undefined if not present, and the default will be used
      );
    }
  }

  console.log("\nAll download jobs have been processed.");
}

main();

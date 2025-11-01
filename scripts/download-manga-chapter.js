const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch').default;

const EXTENSIONS = ['png', 'jpg', 'jpeg', 'webp'];

const MANGA_METADATA = {
  "Kono-Kaisha-ni-Suki-na-Hito-ga-Imasu": {
    baseUrl: "https://ytimgf.youtube-anime.com/images133/BTjTvDthEgWAGWtQt/",
    version: "v1",
    defaultSub: "sub"
  },
  // "Sensei-wa-Koi-wo-Oshierarenai": {
  //   baseUrl: "https://ytimgf.youtube-anime.com/images7/yTX9xTpQqPLaKJckB/47/",
  //   version: "v2"
  // },
};

// Define your download jobs here
const DOWNLOAD_JOBS = [
  {
    mangaTitle: "Kono-Kaisha-ni-Suki-na-Hito-ga-Imasu",
    startChapter: 41,
    endChapter: 50,
    // You can still define specific subs for chapters if needed
    chapters: {
      // "51": { sub: "sub_1759530565"},
      // "45": { sub: "sub_1759530565"},
      // "46": { sub: "sub_1759530565"},
      // "47": { sub: "sub_1759530565"},
      // "48": { sub: "sub_1759530565"},
      // "49": { sub: "sub_1759530565"},
      // "50": { sub: "sub_1759530565"},
    },
  },
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

async function downloadMangaChapter(mangaTitle, chapterNumber, baseUrl, sub) {
  const chapterFolderName = `Chapter ${chapterNumber}`;
  const targetDir = path.join(process.cwd(), 'public', 'manga', mangaTitle, chapterFolderName);

  if (fs.existsSync(targetDir)) {
    const files = fs.readdirSync(targetDir);
    if (files.length > 0) {
      console.log(`Chapter ${chapterNumber} for ${mangaTitle} already exists and is not empty. Skipping download.`);
      return; // Skip download if chapter directory exists and is not empty
    }
  } else {
    fs.mkdirSync(targetDir, { recursive: true });
    console.log(`Created directory: ${targetDir}`);
  }

  console.log(`
Starting download for ${mangaTitle} - Chapter ${chapterNumber}`);

  let i = 1;
  while (true) {
    let downloaded = false;
    for (const ext of EXTENSIONS) {
      const imageUrl = sub 
        ? `${baseUrl}/${chapterNumber}/${sub}/${i}.${ext}`
        : `${baseUrl}/${chapterNumber}/${i}.${ext}`;
      const fileName = `${String(i).padStart(3, '0')}.${ext}`;
      const filePath = path.join(targetDir, fileName);

      if (await downloadImage(imageUrl, filePath)) {
        downloaded = true;
        break;
      }
    }
    if (downloaded) {
      i++;
    } else {
      console.log(`Could not find more images for ${mangaTitle} - Chapter ${chapterNumber} after image ${i - 1}.`);
      break;
    }
  }
  console.log(`Finished downloading ${mangaTitle} - Chapter ${chapterNumber}.`);
}

async function downloadMangaChapterV2(mangaTitle, chapterNumber, baseUrl, sub) {
  const chapterFolderName = `Chapter ${chapterNumber}`;
  const targetDir = path.join(process.cwd(), 'public', 'manga', mangaTitle, chapterFolderName);

  if (fs.existsSync(targetDir)) {
    const files = fs.readdirSync(targetDir);
    if (files.length > 0) {
      console.log(`Chapter ${chapterNumber} for ${mangaTitle} already exists and is not empty. Skipping download.`);
      return; // Skip download if chapter directory exists and is not empty
    }
  } else {
    fs.mkdirSync(targetDir, { recursive: true });
    console.log(`Created directory: ${targetDir}`);
  }

  console.log(`
Starting download for ${mangaTitle} - Chapter ${chapterNumber}`);

  let i = 1;
  while (true) {
    let downloaded = false;
    for (const ext of EXTENSIONS) {
      const imageUrl = sub
        ? `${baseUrl}${chapterNumber}/${sub}_${i}.${ext}`
        : `${baseUrl}${chapterNumber}/${i}.${ext}`;
      const fileName = `${String(i).padStart(3, '0')}.${ext}`;
      const filePath = path.join(targetDir, fileName);

      if (await downloadImage(imageUrl, filePath)) {
        downloaded = true;
        break;
      }
    }
    if (downloaded) {
      i++;
    } else {
      console.log(`Could not find more images for ${mangaTitle} - Chapter ${chapterNumber} after image ${i - 1}.`);
      break;
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
    const { mangaTitle, startChapter, endChapter, chapters } = job;

    if (!mangaTitle || !startChapter || !endChapter) {
      console.error(`Skipping invalid job: ${JSON.stringify(job)}. Each job must have "mangaTitle", "startChapter", and "endChapter".`);
      continue;
    }

    const mangaMetadata = MANGA_METADATA[mangaTitle];
    if (!mangaMetadata) {
      console.error(`Manga title "${mangaTitle}" not found in MANGA_METADATA.`);
      continue;
    }

    console.log(`
Processing job for "${mangaTitle}" from chapter ${startChapter} to ${endChapter}...`);

    for (let chapterNum = startChapter; chapterNum <= endChapter; chapterNum++) {
      const chapterStr = String(chapterNum);
      const chapterData = chapters ? chapters[chapterStr] : undefined;
      let sub = chapterData ? chapterData.sub : undefined;
      if (sub === undefined && mangaMetadata.defaultSub) {
        sub = mangaMetadata.defaultSub;
      }

      if (mangaMetadata.version === 'v2') {
        await downloadMangaChapterV2(
          mangaTitle,
          chapterStr,
          mangaMetadata.baseUrl,
          sub
        );
      } else {
        await downloadMangaChapter(
          mangaTitle,
          chapterStr,
          mangaMetadata.baseUrl,
          sub
        );
      }
    }
  }

  console.log("All download jobs have been processed.");}

main();

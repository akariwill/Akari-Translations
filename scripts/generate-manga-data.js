const fs = require('fs');
const path = require('path');

const mangaDir = path.join(process.cwd(), 'public', 'manga');
const outputFilePath = path.join(process.cwd(), 'manga-data.json');

async function generateMangaData() {
  if (!fs.existsSync(mangaDir)) {
    console.warn('No manga folder found at', mangaDir);
    fs.writeFileSync(outputFilePath, JSON.stringify([]));
    return;
  }

  const mangaFolders = fs.readdirSync(mangaDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  const mangaData = mangaFolders.map(mangaFolder => {
    const mangaPath = path.join(mangaDir, mangaFolder);
    const filesInMangaFolder = fs.readdirSync(mangaPath, { withFileTypes: true });

    const coverFile = filesInMangaFolder.find(dirent => dirent.isFile() && dirent.name.toLowerCase().includes('cover'));
    const synopsisFile = filesInMangaFolder.find(dirent => dirent.isFile() && dirent.name === 'synopsis.json');

    let synopsis = null;
    if (synopsisFile) {
      const synopsisPath = path.join(mangaPath, synopsisFile.name);
      const synopsisContent = fs.readFileSync(synopsisPath, 'utf-8');
      try {
        synopsis = JSON.parse(synopsisContent).synopsis;
      } catch (e) {
        console.error(`Error parsing synopsis for ${mangaFolder}:`, e);
      }
    }

    const chapterFolders = filesInMangaFolder
        .filter(dirent => dirent.isDirectory() && dirent.name.startsWith('Chapter '))
      .map(dirent => dirent.name)
      .sort((a, b) => {
        const numA = parseFloat(a.replace('Chapter ', ''));
        const numB = parseFloat(b.replace('Chapter ', ''));
        return numA - numB;
      }); // Sort chapters numerically

    const chapters = chapterFolders.map(chapterFolder => {
      const chapterPath = path.join(mangaPath, chapterFolder);
      const imageFiles = fs.readdirSync(chapterPath, { withFileTypes: true })
        .filter(dirent => dirent.isFile() && /\.(jpg|jpeg|png|gif|webp)$/i.test(dirent.name))
        .map(dirent => `/manga/${mangaFolder}/${chapterFolder}/${dirent.name}`)
        .sort(); // Sort images to ensure correct page order

      return {
        title: chapterFolder.replace('Chapter ', ''), // Extract chapter number
        images: imageFiles,
      };
    });

    return {
      title: mangaFolder.replace(/[-_]/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '), // Format manga title nicely
      cover: coverFile ? `/manga/${mangaFolder}/${coverFile.name}` : null,
      synopsis: synopsis,
      chapters: chapters,
    };
  });

  fs.writeFileSync(outputFilePath, JSON.stringify(mangaData, null, 2));
  console.log('Generated manga-data.json');
}

generateMangaData();

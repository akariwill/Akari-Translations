
const fs = require('fs');
const path = require('path');

const animeDir = path.join(process.cwd(), 'public', 'anime');
const outputFilePath = path.join(process.cwd(), 'anime-data.json');

async function generateAnimeData() {
  if (!fs.existsSync(animeDir)) {
    console.warn('No anime folder found at', animeDir);
    fs.writeFileSync(outputFilePath, JSON.stringify([]));
    return;
  }

  const animeFolders = fs.readdirSync(animeDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)
    .sort();

  const animeData = animeFolders.map(animeFolder => {
    const animePath = path.join(animeDir, animeFolder);
    const filesInAnimeFolder = fs.readdirSync(animePath, { withFileTypes: true });

    const coverFile = filesInAnimeFolder.find(dirent => dirent.isFile() && dirent.name.toLowerCase().includes('cover'));
    const synopsisFile = filesInAnimeFolder.find(dirent => dirent.isFile() && dirent.name === 'synopsis.json');

    let synopsis = null;
    if (synopsisFile) {
      const synopsisPath = path.join(animePath, synopsisFile.name);
      const synopsisContent = fs.readFileSync(synopsisPath, 'utf-8');
      try {
        synopsis = JSON.parse(synopsisContent).synopsis;
      } catch (e) {
        console.error(`Error parsing synopsis for ${animeFolder}:`, e);
      }
    }

    const episodeFiles = filesInAnimeFolder
      .filter(dirent => dirent.isFile() && dirent.name.endsWith('.mp4'))
      .map(dirent => dirent.name)
      .sort((a, b) => {
        const numA = parseFloat(a.replace(/[^0-9.]/g, ''));
        const numB = parseFloat(b.replace(/[^0-9.]/g, ''));
        return numA - numB;
      });

    const episodes = episodeFiles.map(episodeFile => {
      return {
        title: episodeFile.replace('.mp4', ''),
        file: `/anime/${animeFolder}/${episodeFile}`,
      };
    });

    return {
      title: animeFolder.replace(/[-_]/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
      cover: coverFile ? `/anime/${animeFolder}/${coverFile.name}` : null,
      synopsis: synopsis,
      episodes: episodes,
    };
  });

  fs.writeFileSync(outputFilePath, JSON.stringify(animeData, null, 2));
  console.log('Generated anime-data.json');
}

generateAnimeData();

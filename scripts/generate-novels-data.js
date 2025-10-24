const fs = require('fs');
const path = require('path');

const novelsDir = path.join(process.cwd(), 'public', 'novels');
const outputFilePath = path.join(process.cwd(), 'novels-data.json');

async function generateNovelsData() {
  if (!fs.existsSync(novelsDir)) {
    console.warn('No novels folder found at', novelsDir);
    fs.writeFileSync(outputFilePath, JSON.stringify([]));
    return;
  }

  const novelFolders = fs.readdirSync(novelsDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  const novelsData = novelFolders.map(folder => {
    const novelPath = path.join(novelsDir, folder);
    const files = fs.readdirSync(novelPath);

    const cover = files.find(f => f.toLowerCase().includes('cover'));
    const volumes = files.filter(f => f.endsWith('.pdf'));
    const synopsisFile = files.find(f => f === 'synopsis.json');

    let synopsis = null;
    if (synopsisFile) {
      const synopsisPath = path.join(novelPath, synopsisFile);
      const synopsisData = fs.readFileSync(synopsisPath, 'utf-8');
      try {
        synopsis = JSON.parse(synopsisData).synopsis;
      } catch (e) {
        console.error(`Error parsing synopsis for ${folder}:`, e);
      }
    }

    return {
      title: folder,
      cover: cover ? `/novels/${folder}/${cover}` : null,
      volumes: volumes.map(v => `/novels/${folder}/${v}`),
      synopsis: synopsis,
    };
  });

  fs.writeFileSync(outputFilePath, JSON.stringify(novelsData, null, 2));
  console.log('Generated novels-data.json');
}

generateNovelsData();

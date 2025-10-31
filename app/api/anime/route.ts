
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const animeDataPath = path.join(process.cwd(), 'anime-data.json');

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get('title');

  try {
    const animeData = JSON.parse(fs.readFileSync(animeDataPath, 'utf-8'));

    if (title) {
      const decodedTitle = decodeURIComponent(title);
      const anime = animeData.find((a: any) => a.title === decodedTitle);
      if (anime) {
        return NextResponse.json(anime);
      }
      return NextResponse.json({ message: 'Anime not found' }, { status: 404 });
    }

    return NextResponse.json(animeData);
  } catch (error) {
    console.error('Error reading anime data:', error);
    return NextResponse.json({ message: 'Error fetching anime data' }, { status: 500 });
  }
}

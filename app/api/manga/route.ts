import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const mangaDataPath = path.join(process.cwd(), 'manga-data.json');

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get('title');

  try {
    const mangaData = JSON.parse(fs.readFileSync(mangaDataPath, 'utf-8'));

    if (title) {
      const decodedTitle = decodeURIComponent(title);
      const manga = mangaData.find((m: any) => m.title === decodedTitle);
      if (manga) {
        return NextResponse.json(manga);
      }
      return NextResponse.json({ message: 'Manga not found' }, { status: 404 });
    }

    return NextResponse.json(mangaData);
  } catch (error) {
    console.error('Error reading manga data:', error);
    return NextResponse.json({ message: 'Error fetching manga data' }, { status: 500 });
  }
}

'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

interface Chapter {
  title: string;
  images: string[];
}

interface Manga {
  title: string;
  cover: string;
  synopsis: string;
  chapters: Chapter[];
}

export default function MangaDetails() {
  const { title } = useParams();
  const router = useRouter();
  const [manga, setManga] = useState<Manga | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMangaDetails() {
      if (!title) return;

      try {
        const response = await fetch(`/api/manga?title=${encodeURIComponent(title as string)}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setManga(data);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }

    fetchMangaDetails();
  }, [title]);

  if (loading) {
    return <div className="container mx-auto p-4 text-white">Loading manga details...</div>;
  }

  if (error) {
    return <div className="container mx-auto p-4 text-red-500">Error: {error}</div>;
  }

  if (!manga) {
    return <div className="container mx-auto p-4 text-white">Manga not found.</div>;
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col">
      <header className="bg-gray-800 shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">
            <a href="/">📖 Akari Translations</a>
          </h1>
          <nav>
            <a href="/about" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">About</a>
            <a href="/novels" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Novels</a>
            <a href="/manga" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Manga</a>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 flex-grow">
        <div className="max-w-5xl mx-auto">
          <button
            onClick={() => router.push('/manga')}
            className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded mb-8"
          >
            &larr; Back to Manga List
          </button>
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/3">
              <Image
                src={manga.cover}
                alt={manga.title}
                width={400}
                height={600}
                objectFit="cover"
                className="rounded-lg shadow-lg"
              />
            </div>
            <div className="md:w-2/3">
              <h1 className="text-4xl font-bold mb-4">{manga.title}</h1>
              <p className="text-gray-400 mb-6">{manga.synopsis}</p>

              <h2 className="text-2xl font-bold mb-4">Chapters</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {manga.chapters.map((chapter, index) => (
                  <Link
                    key={index}
                    href={`/manga/${encodeURIComponent(manga.title)}/${encodeURIComponent(chapter.title)}`}
                    className="bg-gray-800 rounded-lg shadow-lg p-4 text-center hover:bg-gray-700 transition-colors duration-300 block"
                  >
                    {chapter.title}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-gray-800 mt-12 py-6">
        <div className="container mx-auto px-4 text-center text-gray-400">
          <p>&copy; 2025 Akari Translations. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Manga {
  title: string;
  cover: string;
  synopsis: string;
}

export default function MangaList() {
  const [manga, setManga] = useState<Manga[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchManga() {
      try {
        const response = await fetch('/api/manga');
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

    fetchManga();
  }, []);

  if (loading) {
    return <div className="container mx-auto p-4 text-white">Loading manga...</div>;
  }

  if (error) {
    return <div className="container mx-auto p-4 text-red-500">Error: {error}</div>;
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
        <h1 className="text-3xl font-bold mb-6 text-white">Manga Series</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {manga.map((m) => (
            <Link
              key={m.title}
              href={`/manga/${encodeURIComponent(m.title)}`}
              className="group block bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 hover:border-gray-500 h-80 relative"
            >
              <div className="w-full h-full">
                <Image
                  src={m.cover || "/placeholder.jpg"}
                  alt={m.title}
                  layout="fill"
                  objectFit="cover"
                  className="w-full h-full"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent"></div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-lg font-bold truncate group-hover:text-white transition-colors duration-300">{m.title}</h3>
              </div>
            </Link>
          ))}
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

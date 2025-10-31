'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

interface MediaItem {
  title: string;
  cover: string;
  type: 'anime' | 'manga' | 'novel';
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('q') || '';

  const [results, setResults] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function performSearch() {
      if (!searchQuery) {
        setResults([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const [animeRes, mangaRes, novelsRes] = await Promise.all([
          fetch('/api/anime'),
          fetch('/api/manga'),
          fetch('/api/novels'),
        ]);

        const animeData = animeRes.ok ? await animeRes.json() : [];
        const mangaData = mangaRes.ok ? await mangaRes.json() : [];
        const novelsData = novelsRes.ok ? await novelsRes.json() : [];

        const allMedia: MediaItem[] = [
          ...animeData.map((item: any) => ({ ...item, type: 'anime' })),
          ...mangaData.map((item: any) => ({ ...item, type: 'manga' })),
          ...novelsData.map((item: any) => ({ ...item, type: 'novel' })),
        ];

        const filteredResults = allMedia.filter(item =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase())
        );

        setResults(filteredResults);
      } catch (e: any) {
        console.error('Error during search:', e);
        setError('Failed to perform search. Please try again.');
      } finally {
        setLoading(false);
      }
    }

    performSearch();
  }, [searchQuery]);

  return (
    <div className="container mx-auto px-4 py-8 flex-grow">
      <h1 className="text-3xl font-bold mb-6">Search Results for "{searchQuery}"</h1>

      {loading && <p className="text-center text-gray-400">Searching...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {!loading && !error && results.length === 0 && searchQuery && (
        <p className="text-center text-gray-400">No results found for "{searchQuery}".</p>
      )}
      {!loading && !error && results.length === 0 && !searchQuery && (
        <p className="text-center text-gray-400">Please enter a search query.</p>
      )}

      {!loading && results.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {results.map((item) => (
            <Link
              key={`${item.type}-${item.title}`}
              href={`/${item.type}/${encodeURIComponent(item.title)}`}
              className="group block bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 hover:border-gray-500 h-80 relative"
            >
              <div className="w-full h-full relative">
                <Image
                  src={item.cover || "/placeholder.jpg"}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  style={{ objectFit: "cover" }}
                  className="w-full h-full"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent"></div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-lg font-bold truncate group-hover:text-white transition-colors duration-300">{item.title}</h3>
                <p className="text-sm text-gray-400 capitalize">{item.type}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

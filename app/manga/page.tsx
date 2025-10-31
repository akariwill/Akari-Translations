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

  const [searchQuery, setSearchQuery] = useState('');

  const [sortOrder, setSortOrder] = useState('default');



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



  const filteredManga = manga.filter(m => m.title.toLowerCase().includes(searchQuery.toLowerCase()));



  const sortedManga = [...filteredManga].sort((a, b) => {

    if (sortOrder === 'asc') {

      return a.title.localeCompare(b.title);

    } else if (sortOrder === 'desc') {

      return b.title.localeCompare(a.title);

    }

    return 0;

  });



  if (loading) {

    return <div className="container mx-auto p-4 text-white">Loading manga...</div>;

  }



  if (error) {

    return <div className="container mx-auto p-4 text-red-500">Error: {error}</div>;

  }



  return (

      <main className="container mx-auto px-4 py-8 flex-grow">

        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">

          <h1 className="text-3xl font-bold text-white text-center sm:text-left">Manga Series</h1>

          <div className="flex flex-col sm:flex-row gap-4 items-center w-full sm:w-auto">

            <input

              type="text"

              placeholder="Search manga..."

              value={searchQuery}

              onChange={(e) => setSearchQuery(e.target.value)}

              className="bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"

            />

            <div className="flex gap-2">

              <button onClick={() => setSortOrder('asc')} className={`px-3 py-1 rounded-md text-sm font-medium ${sortOrder === 'asc' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}>A-Z</button>

              <button onClick={() => setSortOrder('desc')} className={`px-3 py-1 rounded-md text-sm font-medium ${sortOrder === 'desc' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}>Z-A</button>

            </div>

          </div>

        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">

          {sortedManga.map((m, index) => (

            <Link

              key={m.title}

              href={`/manga/${encodeURIComponent(m.title)}`}

              className="group block bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 hover:border-gray-500 h-80 relative"

            >

              <div className="w-full h-full relative">

                <Image

                  src={m.cover || "/placeholder.jpg"}

                  alt={m.title}

                  fill

                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"

                  style={{ objectFit: "cover" }}

                  className="w-full h-full"

                  priority={index === 0}

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

  );

}

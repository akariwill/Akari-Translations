'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Item {
  title: string;
  cover: string;
}

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<{ manga: string[], novel: string[], anime: string[] }>({ manga: [], novel: [], anime: [] });
  const [manga, setManga] = useState<Item[]>([]);
  const [novels, setNovels] = useState<Item[]>([]);
  const [anime, setAnime] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const favs = JSON.parse(localStorage.getItem('favorites') || '{}');
    setFavorites(favs);

    async function fetchData() {
      try {
        const [mangaRes, novelsRes, animeRes] = await Promise.all([
          fetch('/api/manga'),
          fetch('/api/novels'),
          fetch('/api/anime'),
        ]);
        const mangaData = await mangaRes.json();
        const novelsData = await novelsRes.json();
        const animeData = await animeRes.json();
        setManga(mangaData);
        setNovels(novelsData);
        setAnime(animeData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const favoriteManga = manga.filter(m => favorites.manga?.includes(m.title));
  const favoriteNovels = novels.filter(n => favorites.novel?.includes(n.title));
  const favoriteAnime = anime.filter(a => favorites.anime?.includes(a.title));

  if (loading) {
    return <div className="container mx-auto p-4 text-white">Loading favorites...</div>;
  }

  return (
      <main className="container mx-auto px-4 py-8 flex-grow">
        <h1 className="text-3xl font-bold mb-6 text-white">Your Favorites</h1>

        {favoriteManga.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4 text-white">Favorite Manga</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {favoriteManga.map((item, index) => (
                <Link key={item.title} href={`/manga/${encodeURIComponent(item.title)}`} className="group block bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 hover:border-gray-500 h-80 relative">
                  <div className="w-full h-full relative">
                    <Image src={item.cover || "/placeholder.jpg"} alt={item.title} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" style={{ objectFit: "cover" }} className="w-full h-full" priority={index === 0} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent"></div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-lg font-bold truncate group-hover:text-white transition-colors duration-300">{item.title}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {favoriteNovels.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4 text-white">Favorite Novels</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {favoriteNovels.map((item, index) => (
                <Link key={item.title} href={`/novel/${encodeURIComponent(item.title)}`} className="group block bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 hover:border-gray-500 h-80 relative">
                  <div className="w-full h-full relative">
                    <Image src={item.cover || "/placeholder.jpg"} alt={item.title} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" style={{ objectFit: "cover" }} className="w-full h-full" priority={index === 0} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent"></div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-lg font-bold truncate group-hover:text-white transition-colors duration-300">{item.title}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {favoriteAnime.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-4 text-white">Favorite Anime</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {favoriteAnime.map((item, index) => (
                <Link key={item.title} href={`/anime/${encodeURIComponent(item.title)}`} className="group block bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 hover:border-gray-500 h-80 relative">
                  <div className="w-full h-full relative">
                    <Image src={item.cover || "/placeholder.jpg"} alt={item.title} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" style={{ objectFit: "cover" }} className="w-full h-full" priority={index === 0} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent"></div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-lg font-bold truncate group-hover:text-white transition-colors duration-300">{item.title}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {favoriteManga.length === 0 && favoriteNovels.length === 0 && favoriteAnime.length === 0 && (
          <p className="text-center text-gray-400">You haven't added any favorites yet.</p>
        )}
      </main>
  );
}
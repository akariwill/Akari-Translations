'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

interface Episode {
  title: string;
}

interface Anime {
  title: string;
  cover: string;
  synopsis: string;
  episodes: Episode[];
}

export default function AnimeDetails() {
  const { title } = useParams();
  const router = useRouter();
  const [anime, setAnime] = useState<Anime | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);

  const history = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('animeHistory') || '{}') : {};
  const lastWatchedEpisode = title && history[title as string] ? history[title as string] : null;

  useEffect(() => {
    async function fetchAnimeDetails() {
      if (!title) return;

      try {
        const response = await fetch(`/api/anime?title=${encodeURIComponent(title as string)}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setAnime(data);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }

    fetchAnimeDetails();
  }, [title]);

  useEffect(() => {
    if (anime) {
      const favorites = JSON.parse(localStorage.getItem('favorites') || '{}');
      if (favorites.anime && favorites.anime.includes(anime.title)) {
        setIsFavorite(true);
      }
    }
  }, [anime]);

  useEffect(() => {
    if (anime) {
      let recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
      // Remove if already exists to move it to the front
      recentlyViewed = recentlyViewed.filter((item: any) => item.title !== anime.title || item.type !== 'anime');
      // Add current anime to the front
      recentlyViewed.unshift({ type: 'anime', title: anime.title, cover: anime.cover });
      // Limit to 5 items
      recentlyViewed = recentlyViewed.slice(0, 5);
      localStorage.setItem('recentlyViewed', JSON.stringify(recentlyViewed));
    }
  }, [anime]);

  const toggleFavorite = () => {
    if (!anime) return;
    const favorites = JSON.parse(localStorage.getItem('favorites') || '{}');
    if (!favorites.anime) {
      favorites.anime = [];
    }
    const animeIndex = favorites.anime.indexOf(anime.title);
    if (animeIndex > -1) {
      favorites.anime.splice(animeIndex, 1);
      setIsFavorite(false);
    } else {
      favorites.anime.push(anime.title);
      setIsFavorite(true);
    }
    localStorage.setItem('favorites', JSON.stringify(favorites));
  };

  if (loading) {
    return <div className="container mx-auto p-4 text-white">Loading anime details...</div>;
  }

  if (error) {
    return <div className="container mx-auto p-4 text-red-500">Error: {error}</div>;
  }

  if (!anime) {
    return <div className="container mx-auto p-4 text-white">Anime not found.</div>;
  }

  return (
      <main className="container mx-auto px-4 py-8 flex-grow">
        <div className="max-w-5xl mx-auto">
          <button
            onClick={() => router.push('/anime')}
            className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded mb-8"
          >
            &larr; Back to Anime List
          </button>
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/3">
              <Image
                src={anime.cover}
                alt={anime.title}
                width={400}
                height={600}
                style={{ objectFit: "cover" }}
                className="rounded-lg shadow-lg"
                priority
              />
            </div>
            <div className="md:w-2/3">
              <div className="flex justify-between items-center mb-4">
                <h1 className="text-4xl font-bold">{anime.title}</h1>
                <button onClick={toggleFavorite} className={`px-4 py-2 rounded-md font-bold ${isFavorite ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'}`}>
                  {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                </button>
              </div>
              {lastWatchedEpisode && (
                <Link
                  href={`/anime/${encodeURIComponent(anime.title)}/${encodeURIComponent(lastWatchedEpisode)}`}
                  className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
                >
                  Continue Watching: {lastWatchedEpisode}
                </Link>
              )}
              <p className="text-gray-400 mb-6">{anime.synopsis}</p>

              <h2 className="text-2xl font-bold mb-4">Episodes</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {anime.episodes.map((episode, index) => {
                  const isLastWatched = episode.title === lastWatchedEpisode;
                  return (
                    <Link
                      key={index}
                      href={`/anime/${encodeURIComponent(anime.title)}/${encodeURIComponent(episode.title)}`}
                      className={`rounded-lg shadow-lg p-4 text-center transition-colors duration-300 block ${
                        isLastWatched
                          ? 'bg-blue-800 hover:bg-blue-700 font-bold'
                          : 'bg-gray-800 hover:bg-gray-700'
                      }`}
                    >
                      {episode.title}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </main>
  );
}
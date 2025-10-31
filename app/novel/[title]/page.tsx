'use client';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import NovelReader from './NovelReader';
import Link from 'next/link';
import Image from 'next/image';

export default function NovelPage() {
  const { title } = useParams();
  const router = useRouter();
  const [novel, setNovel] = useState<any>(null);
  const [selectedVolume, setSelectedVolume] = useState<string | null>(null);
  const [lastReadVolume, setLastReadVolume] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (title) {
      const history = JSON.parse(localStorage.getItem('novelHistory') || '{}');
      if (history[title as string]) {
        setLastReadVolume(history[title as string]);
      }
    }
  }, [title]);

  useEffect(() => {
    if (title) {
      fetch('/api/novels')
        .then((res) => res.json())
        .then((novels) => {
          const currentNovel = novels.find((n: any) => n.title === title);
          setNovel(currentNovel);
        });
    }
  }, [title]);

  useEffect(() => {
    if (novel) {
      const favorites = JSON.parse(localStorage.getItem('favorites') || '{}');
      if (favorites.novel && favorites.novel.includes(novel.title)) {
        setIsFavorite(true);
      }
    }
  }, [novel]);

  useEffect(() => {
    if (novel) {
      let recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
      // Remove if already exists to move it to the front
      recentlyViewed = recentlyViewed.filter((item: any) => item.title !== novel.title || item.type !== 'novel');
      // Add current novel to the front
      recentlyViewed.unshift({ type: 'novel', title: novel.title, cover: novel.cover });
      // Limit to 5 items
      recentlyViewed = recentlyViewed.slice(0, 5);
      localStorage.setItem('recentlyViewed', JSON.stringify(recentlyViewed));
    }
  }, [novel]);

  const toggleFavorite = () => {
    if (!novel) return;
    const favorites = JSON.parse(localStorage.getItem('favorites') || '{}');
    if (!favorites.novel) {
      favorites.novel = [];
    }
    const novelIndex = favorites.novel.indexOf(novel.title);
    if (novelIndex > -1) {
      favorites.novel.splice(novelIndex, 1);
      setIsFavorite(false);
    } else {
      favorites.novel.push(novel.title);
      setIsFavorite(true);
    }
    localStorage.setItem('favorites', JSON.stringify(favorites));
  };

  if (!novel) {
    return <div>Loading...</div>;
  }

  if (selectedVolume) {
    return <NovelReader novel={novel} selectedVolume={selectedVolume} setSelectedVolume={setSelectedVolume} />;
  }

  return (
      <main className="container mx-auto px-4 py-8 flex-grow">
        <div className="max-w-5xl mx-auto">
          <button
            onClick={() => router.push('/novels')}
            className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded mb-8"
          >
            &larr; Back to Novels List
          </button>
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/3">
              <Image
                src={novel.cover}
                alt={novel.title}
                width={400}
                height={600}
                style={{ objectFit: "cover" }}
                className="rounded-lg shadow-lg"
                priority
              />
            </div>
            <div className="md:w-2/3">
              <div className="flex justify-between items-center mb-4">
                <h1 className="text-4xl font-bold">{novel.title}</h1>
                <button onClick={toggleFavorite} className={`px-4 py-2 rounded-md font-bold ${isFavorite ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'}`}>
                  {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                </button>
              </div>
              {lastReadVolume && (
                <button
                  onClick={() => setSelectedVolume(lastReadVolume)}
                  className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
                >
                  Continue Reading: {lastReadVolume.split('/').pop()?.replace('.pdf', '')}
                </button>
              )}
              <p className="text-gray-400 mb-6">
                {novel.synopsis || "No synopsis available."}
              </p>
              <h2 className="text-2xl font-bold mb-4">Volumes</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {novel.volumes.map((volume: string) => (
                  <button
                    key={volume}
                    onClick={() => setSelectedVolume(volume)}
                    className="bg-gray-800 rounded-lg shadow-lg p-4 text-center hover:bg-gray-700 transition-colors duration-300"
                  >
                    {volume.split('/').pop()?.replace('.pdf', '')}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
  );
}

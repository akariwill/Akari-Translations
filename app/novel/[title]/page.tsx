'use client';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import NovelReader from './NovelReader';

export default function NovelPage() {
  const { title } = useParams();
  const router = useRouter();
  const [novel, setNovel] = useState<any>(null);
  const [selectedVolume, setSelectedVolume] = useState<string | null>(null);

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

  if (!novel) {
    return <div>Loading...</div>;
  }

  if (selectedVolume) {
    return <NovelReader novel={novel} selectedVolume={selectedVolume} setSelectedVolume={setSelectedVolume} />;
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen p-8">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={() => router.push('/')}
          className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded mb-8"
        >
          &larr; Back to Home
        </button>
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/3">
            <img src={novel.cover} alt={novel.title} className="w-full rounded-lg shadow-lg" />
          </div>
          <div className="md:w-2/3">
            <h1 className="text-4xl font-bold mb-4">{novel.title}</h1>
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
    </div>
  );
}

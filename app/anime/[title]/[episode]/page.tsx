'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function AnimePlayer() {
  const params = useParams();
  const router = useRouter();
  const [animeData, setAnimeData] = useState<any>(null);

  const title = params.title ? decodeURIComponent(params.title as string) : '';
  const episode = params.episode ? decodeURIComponent(params.episode as string) : '';



  useEffect(() => {
    if (params.title && episode) {
      const history = JSON.parse(localStorage.getItem('animeHistory') || '{}');
      history[params.title as string] = episode;
      localStorage.setItem('animeHistory', JSON.stringify(history));
    }
  }, [params.title, episode]);

  useEffect(() => {
    async function fetchAnimeDetails() {
      if (!title) return;
      try {
        const response = await fetch(`/api/anime?title=${encodeURIComponent(title as string)}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        data.episodes.sort((a: any, b: any) => a.episode - b.episode);
        setAnimeData(data);
      } catch (e: any) {
        console.error("Error fetching anime details:", e);
      }
    }
    fetchAnimeDetails();
  }, [title]);

  const currentEpisodeIndex = animeData?.episodes.findIndex((ep: any) => ep.title === episode);
  const currentEpisode = animeData?.episodes[currentEpisodeIndex];
  const prevEpisode = currentEpisodeIndex > 0 ? animeData.episodes[currentEpisodeIndex - 1] : null;
  const nextEpisode = currentEpisodeIndex < animeData?.episodes.length - 1 ? animeData.episodes[currentEpisodeIndex + 1] : null;

  return (
      <main className="container mx-auto px-4 py-8 flex-grow">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => router.push(`/anime/${encodeURIComponent(title)}`)}
            className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded mb-8"
          >
            &larr; Back to Episode List
          </button>

          <h1 className="text-3xl font-bold mb-4">{title.replace(/-/g, ' ')} - {episode}</h1>

          {currentEpisode && (
            currentEpisode.file.includes('drive.google.com/file/d/') && currentEpisode.file.includes('/preview') ? (
              <iframe
                src={currentEpisode.file}
                className="w-full rounded-lg shadow-lg"
                style={{ height: '500px' }} // You might want to adjust the height
                allowFullScreen
                title={`${title} - ${episode}`}
              ></iframe>
            ) : (
              <video controls src={currentEpisode.file} className="w-full rounded-lg shadow-lg">
                Your browser does not support the video tag.
              </video>
            )
          )}

          <div className="flex justify-between items-center mt-4">
            <button
              onClick={() => router.push(`/anime/${encodeURIComponent(title)}/${encodeURIComponent(prevEpisode.title)}`)}
              disabled={!prevEpisode}
              className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
            >
              &larr; Previous Episode
            </button>
            <button
              onClick={() => router.push(`/anime/${encodeURIComponent(title)}/${encodeURIComponent(nextEpisode.title)}`)}
              disabled={!nextEpisode}
              className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
            >
              Next Episode &rarr;
            </button>
          </div>
        </div>
      </main>
  );
}
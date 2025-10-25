'use client';

import { useParams } from 'next/navigation';
import { useEffect } from 'react';
import MangaReader from './MangaReader';

export default function MangaChapterPage() {
  const params = useParams();
  const mangaTitle = Array.isArray(params.title) ? params.title[0] : params.title;
  const chapterTitle = Array.isArray(params.chapter) ? params.chapter[0] : params.chapter;

  useEffect(() => {
    if (mangaTitle) {
      const history = JSON.parse(localStorage.getItem('mangaHistory') || '{}');
      history[mangaTitle] = chapterTitle;
      localStorage.setItem('mangaHistory', JSON.stringify(history));
    }
  }, [mangaTitle, chapterTitle]);

  if (!mangaTitle || !chapterTitle) {
    return <div className="container mx-auto p-4 text-white">Loading chapter...</div>;
  }

  return (
    <MangaReader mangaTitle={mangaTitle as string} chapterTitle={chapterTitle as string} />
  );
}

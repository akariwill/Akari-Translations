'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface MangaReaderProps {
  mangaTitle: string;
  chapterTitle: string;
}

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

export default function MangaReader({ mangaTitle, chapterTitle }: MangaReaderProps) {
  const [mangaData, setMangaData] = useState<Manga | null>(null);
  const [chapterImages, setChapterImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [isScrollMode, setIsScrollMode] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    async function fetchMangaData() {
      setLoading(true);
      try {
        const response = await fetch(`/api/manga?title=${mangaTitle}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: Manga = await response.json();
        setMangaData(data);
        const chapter = data.chapters.find(c => c.title === chapterTitle);

        if (chapter) {
          setChapterImages(chapter.images);
          setPageNumber(1);
        } else {
          setError('Chapter not found.');
        }
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }

    fetchMangaData();
  }, [mangaTitle, chapterTitle]);

  const decodedMangaTitle = mangaTitle ? decodeURIComponent(mangaTitle) : '';

  if (loading) {
    return <div className="fixed inset-0 bg-gray-900 flex items-center justify-center text-white">Loading chapter...</div>;
  }

  if (error) {
    return <div className="fixed inset-0 bg-gray-900 flex items-center justify-center text-red-500">Error: {error}</div>;
  }

  if (!mangaData || chapterImages.length === 0) {
    return <div className="fixed inset-0 bg-gray-900 flex items-center justify-center text-white">No images found for this chapter.</div>;
  }

  const currentChapterIndex = mangaData.chapters.findIndex(c => c.title === chapterTitle);
  const prevChapter = currentChapterIndex > 0 ? mangaData.chapters[currentChapterIndex - 1] : null;
  const nextChapter = currentChapterIndex < mangaData.chapters.length - 1 ? mangaData.chapters[currentChapterIndex + 1] : null;

  const handlePrevChapter = () => {
    if (prevChapter) {
      router.push(`/manga/${mangaTitle}/${prevChapter.title}`);
    }
  };

  const handleNextChapter = () => {
    if (nextChapter) {
      router.push(`/manga/${mangaTitle}/${nextChapter.title}`);
    }
  };

  const handleExit = () => {
    router.push(`/manga/${mangaTitle}`);
  };

  const numPages = chapterImages.length;

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      {/* Top Bar */}
      <div className="fixed top-0 left-0 right-0 bg-gray-800 bg-opacity-80 backdrop-blur-sm p-4 z-10 flex justify-between items-center">
        <h1 className="text-xl font-bold text-center truncate">
          {decodedMangaTitle} - Chapter {chapterTitle}
        </h1>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevChapter}
            disabled={!prevChapter}
            className="px-3 py-2 bg-gray-700 rounded-lg disabled:opacity-50 hover:bg-gray-600 transition-colors"
          >
            Prev
          </button>
          <button
            onClick={handleNextChapter}
            disabled={!nextChapter}
            className="px-3 py-2 bg-gray-700 rounded-lg disabled:opacity-50 hover:bg-gray-600 transition-colors"
          >
            Next
          </button>
          <button
            onClick={handleExit}
            className="px-3 py-2 bg-red-700 rounded-lg hover:bg-red-600 transition-colors"
          >
            Exit
          </button>
        </div>
      </div>

      {/* Image Content */}
      <div className="pt-24 pb-24 flex flex-col items-center space-y-2">
        {isScrollMode ? (
          chapterImages.map((imageUrl, index) => (
            <div key={index} className="relative w-full max-w-4xl h-auto">
              <Image
                src={imageUrl}
                alt={`${decodedMangaTitle} page ${index + 1}`}
                layout="responsive"
                width={800}
                height={1200}
                objectFit="contain"
                className="rounded-md"
              />
            </div>
          ))
        ) : (
          <div className="relative w-full max-w-4xl h-auto">
            {chapterImages[pageNumber - 1] && (
              <Image
                src={chapterImages[pageNumber - 1]}
                alt={`${decodedMangaTitle} page ${pageNumber}`}
                layout="responsive"
                width={800}
                height={1200}
                objectFit="contain"
                className="rounded-md"
              />
            )}
          </div>
        )}
      </div>

      {/* Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-800 bg-opacity-80 backdrop-blur-sm p-4 z-10 flex justify-center items-center gap-4">
        {!isScrollMode && (
          <>
            <button
              onClick={() => setPageNumber((p) => Math.max(p - 1, 1))}
              disabled={pageNumber <= 1}
              className="px-4 py-2 bg-gray-700 rounded-lg disabled:opacity-50 hover:bg-gray-600 transition-colors"
            >
              Previous
            </button>
            <p className="text-lg font-semibold">
              {pageNumber} / {numPages}
            </p>
            <button
              onClick={() => setPageNumber((p) => Math.min(p + 1, numPages))}
              disabled={pageNumber >= numPages}
              className="px-4 py-2 bg-gray-700 rounded-lg disabled:opacity-50 hover:bg-gray-600 transition-colors"
            >
              Next
            </button>
          </>
        )}
        <button
          onClick={() => setIsScrollMode(!isScrollMode)}
          className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-500 transition-colors"
        >
          {isScrollMode ? 'Paginated' : 'Scroll'}
        </button>
      </div>
    </div>
  );
}

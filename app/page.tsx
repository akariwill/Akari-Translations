"use client";
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function Home() {
  const [recentlyViewed, setRecentlyViewed] = useState<any[]>([]);

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
    setRecentlyViewed(items);
  }, []);

  return (
      <main className="container mx-auto px-4 py-8 flex-grow flex flex-col items-center justify-center text-center">
        <h2 className="text-5xl font-extrabold mb-4">Welcome to Akari Translations</h2>
        <p className="text-xl text-gray-400 mb-8">Your source for high-quality light novel and manga translations.</p>
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 mb-8">
          <Link href="/novels" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300 text-lg">
            Explore Novels
          </Link>
          <Link href="/manga" className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300 text-lg">
            Read Manga
          </Link>
          <Link href="/anime" className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300 text-lg">
            Watch Anime
          </Link>
        </div>

        {recentlyViewed.length > 0 && (
          <section className="w-full max-w-5xl mx-auto mt-12">
            <h2 className="text-3xl font-bold mb-6 text-white text-center">Recently Viewed</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {recentlyViewed.map((item: any, index: number) => (
                <Link
                  key={item.title}
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
                      priority={index === 0}
                    />
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

        <div className="mt-6">
          <a
            href="https://drive.google.com/drive/folders/1R8LU_KOc1XRyZMZ_M1eqrNN1aCsaK7-A?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300 inline-flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M13 10V3L4 10h7v7L13 10z"></path></svg>
            Download Novels & Manga (Google Drive)
          </a>
        </div>
      </main>
  );
}

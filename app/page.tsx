"use client";
import Link from 'next/link';

export default function Home() {
  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col">
      <header className="bg-gray-800 shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">
            <a href="/">📖 Akari Translations</a>
          </h1>
          <nav>
            <a href="/about" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">About</a>
            <a href="/novels" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Novels</a>
            <a href="/manga" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Manga</a>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 flex-grow flex flex-col items-center justify-center text-center">
        <h2 className="text-5xl font-extrabold mb-4">Welcome to Akari Translations</h2>
        <p className="text-xl text-gray-400 mb-8">Your source for high-quality light novel and manga translations.</p>
        <div className="flex space-x-6 mb-8">
          <Link href="/novels" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300 text-lg">
            Explore Novels
          </Link>
          <Link href="/manga" className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300 text-lg">
            Read Manga
          </Link>
        </div>
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

      <footer className="bg-gray-800 mt-12 py-6">
        <div className="container mx-auto px-4 text-center text-gray-400">
          <p>&copy; 2025 Akari Translations. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
}
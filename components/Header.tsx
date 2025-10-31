'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Header() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="bg-gray-800 shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          <a href="/">📖 Akari Translations</a>
        </h1>
        <nav className="hidden md:flex items-center flex-wrap justify-center space-x-4">
          <a href="/about" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">About</a>
          <a href="/novels" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Novels</a>
          <a href="/manga" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Manga</a>
          <a href="/anime" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Anime</a>
          <a href="/favorites" title="Favorites" className="flex items-center text-gray-300 hover:text-red-500 px-3 py-2 rounded-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 20.364l-7.682-7.682a4.5 4.5 0 010-6.364z" />
            </svg>
          </a>
          {/* Search Input */}
          <form onSubmit={handleSearch} className="flex items-center">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="px-3 py-2 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button type="submit" className="ml-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md">
              Search
            </button>
          </form>
        </nav>
        <div className="md:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-300 hover:text-white focus:outline-none">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"} />
            </svg>
          </button>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden">
          <nav className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a href="/about" className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">About</a>
            <a href="/novels" className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Novels</a>
            <a href="/manga" className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Manga</a>
            <a href="/anime" className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Anime</a>
            <a href="/favorites" title="Favorites" className="flex items-center text-gray-300 hover:text-red-500 px-3 py-2 rounded-md">
              <svg xmlns="http://wwww3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 20.364l-7.682-7.682a4.5 4.5 0 010-6.364z" />
              </svg>
            </a>
          </nav>
          <div className="px-5 pb-3">
            <form onSubmit={handleSearch} className="flex items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="w-full px-3 py-2 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button type="submit" className="ml-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md">
                Search
              </button>
            </form>
          </div>
        </div>
      )}
    </header>
  );
}

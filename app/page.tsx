"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const [novels, setNovels] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/novels")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setNovels(data);
        } else {
          console.error("API returned non-array data:", data);
          setNovels([]); // Ensure novels is always an array
        }
      })
      .catch((error) => {
        console.error("Error fetching novels:", error);
        setNovels([]); // Ensure novels is always an array on error
      });
  }, []);

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col">
      <header className="bg-gray-800 shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">
            <a href="/">📖 Akari Translations</a>
          </h1>
          <nav>
            <a href="/about" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">About</a>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 flex-grow">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold">Welcome to Akari Translations</h2>
          <p className="text-lg text-gray-400 mt-2">Your source for high-quality light novel translations.</p>
          <div className="mt-6">
            <a
              href="https://drive.google.com/drive/folders/1iCn5w1qr3x_R07dIp0cjiETt-JWl_sZ5?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300 inline-flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M13 10V3L4 10h7v7L13 10z"></path></svg>
              Download Novels (Google Drive)
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {novels.map((n) => (
            <a
              key={n.title}
              href={`/novel/${n.title}`}
              className="group block bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 hover:border-gray-500 h-80 relative"
            >
              <div className="w-full h-full">
                <img
                  src={n.cover || "/placeholder.jpg"}
                  alt={n.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent"></div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-lg font-bold truncate group-hover:text-white transition-colors duration-300">{n.title}</h3>
              </div>
            </a>
          ))}
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

import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col">
      <header className="bg-gray-800 shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">
            <a href="/">📖 Akari Translations</a>
          </h1>
          <nav>
            <a href="/" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Home</a>
            <a href="/about" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">About</a>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 flex-grow">
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold mb-6 text-center">About Akari Translations</h1>
          <div className="prose prose-invert lg:prose-xl mx-auto">
            <p>
              Akari Translations is a passion project dedicated to bringing high-quality light novel translations to a wider audience. Our mission is to provide a comfortable and enjoyable reading experience for all light novel enthusiasts.
            </p>
            <p>
              We believe that stories are a powerful way to connect people and cultures. Through our translations, we hope to share the amazing worlds and characters created by talented authors with readers from all around the globe.
            </p>
            <p>
              Thank you for visiting Akari Translations. We hope you enjoy your time here!
            </p>
          </div>
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-4 text-center">Contact Us</h2>
            <div className="text-center">
              <p>If you have any questions, feedback, or suggestions, feel free to reach out to us:</p>
              <p className="mt-4">
                <strong>Email:</strong> <a href="mailto:mwildjrs23@gmail.com" className="text-blue-400 hover:underline">mwildjrs23@gmail.com</a>
              </p>
              <p>
                <strong>GitHub:</strong> <a href="https://github.com/akariwill/Akari-Translations" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">https://github.com/akariwill/Akari-Translations</a>
              </p>
            </div>
          </div>
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

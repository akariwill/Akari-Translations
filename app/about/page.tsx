import Link from 'next/link';

export default function AboutPage() {
  return (
      <main className="container mx-auto px-4 py-8 flex-grow">
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold mb-6 text-center">About Akari Translations</h1>
          <div className="prose prose-invert lg:prose-xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
            <p>
              Our mission is to provide high-quality light novel, manga, and anime translations to a wider audience, fostering a global community of enthusiasts and making diverse stories accessible to everyone.
            </p>

            <h2 className="text-2xl font-bold mb-4 mt-8">Our Team</h2>
            <p>
              Akari Translations is a solo passion project. I am the sole programmer and data scraping specialist dedicated to bringing you this content.
            </p>

            <h2 className="text-2xl font-bold mb-4 mt-8">Project History & Milestones</h2>
            <ul className="list-disc list-inside ml-4">
              <li><strong>Early 2025:</strong> Project inception and initial development.</li>
              <li><strong>Mid 2025:</strong> Launch of manga and novel translation services.</li>
              <li><strong>Late 2025:</strong> Introduction of anime streaming and community features.</li>
              <li><strong>Future:</strong> Continuous expansion of content and features.</li>
            </ul>

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
        </div>
      </main>
  );
}
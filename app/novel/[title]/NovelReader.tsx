'use client';
import { useState, useRef, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `/pdf.worker.min.mjs`;

export default function NovelReader({ novel, selectedVolume, setSelectedVolume }: { novel: any, selectedVolume: string, setSelectedVolume: (volume: string | null) => void }) {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const [isScrollMode, setIsScrollMode] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  useEffect(() => {
    function updateWidth() {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    }

    window.addEventListener('resize', updateWidth);
    updateWidth();

    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col items-center p-4 sm:p-8">
      <div className="w-full max-w-4xl" ref={containerRef}>
        <Document file={selectedVolume} onLoadSuccess={onDocumentLoadSuccess}>
          {isScrollMode ? (
            Array.from(new Array(numPages), (el, index) => (
              <Page
                key={`page_${index + 1}`}
                pageNumber={index + 1}
                renderTextLayer={false}
                renderAnnotationLayer={false}
                width={containerWidth}
              />
            ))
          ) : (
            <Page
              pageNumber={pageNumber}
              renderTextLayer={false}
              renderAnnotationLayer={false}
              width={containerWidth}
            />
          )}
        </Document>
      </div>
      <div className="flex items-center gap-4 mt-4">
        <button
          onClick={() => setIsScrollMode(!isScrollMode)}
          className="px-4 py-2 bg-gray-700 rounded-lg"
        >
          {isScrollMode ? 'Paginated View' : 'Scroll View'}
        </button>
      </div>
      {!isScrollMode && (
        <div className="flex items-center gap-4 mt-4">
          <button
            onClick={() => setPageNumber((p) => Math.max(p - 1, 1))}
            disabled={pageNumber <= 1}
            className="px-4 py-2 bg-gray-700 rounded-lg disabled:opacity-50"
          >
            Previous Page
          </button>
          <p>
            Page {pageNumber} of {numPages}
          </p>
          <button
            onClick={() => setPageNumber((p) => Math.min(p + 1, numPages))}
            disabled={pageNumber >= numPages}
            className="px-4 py-2 bg-gray-700 rounded-lg disabled:opacity-50"
          >
            Next Page
          </button>
        </div>
      )}
      <div className="flex items-center gap-4 mt-4">
        <button
          onClick={() => setSelectedVolume(null)}
          className="px-4 py-2 bg-red-700 rounded-lg"
        >
          Exit
        </button>
      </div>
    </div>
  );
}

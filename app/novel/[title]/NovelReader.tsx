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
    setPageNumber(1); // Reset to first page on new document load
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

  const currentVolumeIndex = novel.volumes.findIndex((v: string) => v === selectedVolume);
  const prevVolume = currentVolumeIndex > 0 ? novel.volumes[currentVolumeIndex - 1] : null;
  const nextVolume = currentVolumeIndex < novel.volumes.length - 1 ? novel.volumes[currentVolumeIndex + 1] : null;

  const handlePrevVolume = () => {
    if (prevVolume) {
      setSelectedVolume(prevVolume);
    }
  };

  const handleNextVolume = () => {
    if (nextVolume) {
      setSelectedVolume(nextVolume);
    }
  };

  const handleExit = () => {
    setSelectedVolume(null);
  };

  const volumeDisplayName = selectedVolume.split('/').pop()?.replace('.pdf', '') || '';

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      {/* Top Bar */}
      <div className="fixed top-0 left-0 right-0 bg-gray-800 bg-opacity-80 backdrop-blur-sm p-4 z-10 flex justify-between items-center">
        <h1 className="text-xl font-bold text-center truncate" title={`${novel.title} - ${volumeDisplayName}`}>
          {novel.title} - {volumeDisplayName}
        </h1>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevVolume}
            disabled={!prevVolume}
            className="px-3 py-2 bg-gray-700 rounded-lg disabled:opacity-50 hover:bg-gray-600 transition-colors"
          >
            Prev Vol
          </button>
          <button
            onClick={handleNextVolume}
            disabled={!nextVolume}
            className="px-3 py-2 bg-gray-700 rounded-lg disabled:opacity-50 hover:bg-gray-600 transition-colors"
          >
            Next Vol
          </button>
          <button
            onClick={handleExit}
            className="px-3 py-2 bg-red-700 rounded-lg hover:bg-red-600 transition-colors"
          >
            Exit
          </button>
        </div>
      </div>

      {/* PDF Content */}
      <div className="pt-24 pb-24 flex justify-center" ref={containerRef}>
        <Document file={selectedVolume} onLoadSuccess={onDocumentLoadSuccess} className="flex flex-col items-center">
          {isScrollMode ? (
            Array.from(new Array(numPages), (el, index) => (
              <Page
                key={`page_${index + 1}`}
                pageNumber={index + 1}
                renderTextLayer={false}
                renderAnnotationLayer={false}
                width={containerWidth ? Math.min(containerWidth, 800) : undefined}
                className="mb-2"
              />
            ))
          ) : (
            <Page
              pageNumber={pageNumber}
              renderTextLayer={false}
              renderAnnotationLayer={false}
              width={containerWidth ? Math.min(containerWidth, 800) : undefined}
            />
          )}
        </Document>
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

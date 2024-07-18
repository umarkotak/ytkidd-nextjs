import React, { useState, useRef } from 'react';
import { Viewer, Worker, SpecialZoomLevel } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';

// Import styles
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

const PDFViewer = ({ pdfUrl }) => {
  const [numPages, setNumPages] = useState(null);
  const containerRef = useRef(null);
  const viewerRef = useRef(null);
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  const handleDocumentLoad = (e) => {
    setNumPages(e.doc.numPages);
  };

  const handlePagesRendered = () => {
    if (viewerRef.current && containerRef.current && numPages) {
      const page = viewerRef.current.pageRef(0);
      if (page) {
        const pageWidth = page.clientWidth;
        const pageHeight = page.clientHeight;
        const containerWidth = containerRef.current.clientWidth;
        const containerHeight = containerRef.current.clientHeight;

        const widthScale = containerWidth / pageWidth;
        const heightScale = containerHeight / pageHeight;
        const optimalScale = Math.min(widthScale, heightScale, 1); // Limit to 100% max

        viewerRef.current.setPageScale(optimalScale);
      }
    }
  };

  return (
    <div ref={containerRef} className='w-full min-h-screen'>
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
        <Viewer
          fileUrl={pdfUrl}
          plugins={[]}
          onDocumentLoad={handleDocumentLoad}
          onPagesRendered={handlePagesRendered}
          defaultScale={SpecialZoomLevel.ActualSize}
          ref={viewerRef}
        />
      </Worker>
    </div>
  );
};

export default PDFViewer;
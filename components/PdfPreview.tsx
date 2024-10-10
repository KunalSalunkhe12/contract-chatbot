"use client";

import React, { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  RotateCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface PDFViewerProps {
  file: string | File;
}

export default function PDFViewer({ file }: PDFViewerProps) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pdfError, setPdfError] = useState<Error | null>(null);
  const [scale, setScale] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);

  useEffect(() => {
    setPageNumber(1);
    setPdfError(null);
    setScale(1);
    setRotation(0);
  }, [file]);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }): void => {
    setNumPages(numPages);
    setPageNumber(1);
  };

  const changePage = (offset: number) => {
    setPageNumber((prevPageNumber) =>
      Math.max(1, Math.min(prevPageNumber + offset, numPages || 1))
    );
  };

  const changeScale = (delta: number) => {
    setScale((prevScale) => Math.max(0.1, Math.min(prevScale + delta, 3)));
  };

  const rotate = () => {
    setRotation((prevRotation) => (prevRotation + 90) % 360);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-3xl mx-auto">
      <div className="w-full bg-background rounded-lg shadow-lg overflow-hidden">
        <div className="h-[calc(100vh-9rem)] overflow-auto custom-scrollbar">
          <Document
            file={file}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={(error: Error) => setPdfError(error)}
            className="flex justify-center"
            loading={<div className="text-white">Loading PDF...</div>}
          >
            {pdfError ? (
              <div className="text-red-500 p-4" role="alert">
                Error loading PDF: {pdfError.message}
              </div>
            ) : (
              <Page
                pageNumber={pageNumber}
                scale={scale}
                rotate={rotation}
                className="max-w-full"
                renderTextLayer={true}
                renderAnnotationLayer={true}
              />
            )}
          </Document>
        </div>
      </div>
      {!pdfError && numPages && (
        <div className="flex items-center justify-between w-full mt-4 px-4">
          <div className="flex items-center space-x-2 text-white">
            <Button onClick={() => changeScale(-0.1)} size="sm">
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium">
              {Math.round(scale * 100)}%
            </span>
            <Button onClick={() => changeScale(0.1)} size="sm">
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button onClick={rotate} size="sm">
              <RotateCw className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-x-4">
            <Button
              onClick={() => changePage(-1)}
              disabled={pageNumber <= 1}
              size="icon"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Previous page</span>
            </Button>
            <span className="text-sm font-medium text-white">
              Page {pageNumber} of {numPages}
            </span>
            <Button
              onClick={() => changePage(1)}
              disabled={pageNumber >= (numPages || 1)}
              size="icon"
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Next page</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import React, { useState, useRef, DragEvent } from "react";
import { Upload } from "lucide-react";
import PDFViewer from "./PdfPreview";
import { uploadFile } from "@/app/actions/upload-file";

export default function PDFSection() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (typeof window !== "undefined" && !pdfFile) {
    localStorage.removeItem("threadId");
  }

  const handleFileUpload = async (file: File) => {
    if (file.type === "application/pdf") {
      const formData = new FormData();
      formData.append("file", file);
      setPdfFile(file);
      try {
        const file = await uploadFile(formData);
        const res = await fetch("/api/create-thread", {
          method: "POST",
          body: JSON.stringify({
            filePath: file.path,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();
        console.log(data);
        localStorage.setItem("threadId", data.thread.id);
      } catch (error) {
        console.error("File upload failed:", error);
      }
    } else {
      alert("Please upload a PDF file.");
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFileUpload(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  return (
    <div className="w-full md:w-1/2 bg-gray-800 p-4 border-r border-gray-700">
      {pdfFile ? (
        <div className="h-full">
          <h2 className="text-xl font-semibold text-gray-200 mb-4">
            {pdfFile.name}
          </h2>
          {pdfFile && <PDFViewer file={URL.createObjectURL(pdfFile)} />}
        </div>
      ) : (
        <div
          className={`h-full flex flex-col items-center justify-center border-2 border-dashed rounded-lg ${
            isDragging
              ? "border-purple-500 bg-purple-500 bg-opacity-10"
              : "border-gray-600"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <Upload size={48} className="text-gray-400 mb-4" />
          <p className="text-gray-300 text-center mb-4">
            Drag and drop your PDF here
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            onChange={handleFileInputChange}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="bg-purple-500 hover:bg-purple-600 text-white rounded-md px-4 py-2 transition-colors duration-200"
          >
            Select PDF
          </button>
        </div>
      )}
    </div>
  );
}

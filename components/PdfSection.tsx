"use client";

import React, { useState, useRef, DragEvent } from "react";
import { Upload, Loader2 } from "lucide-react";
import { uploadPdf } from "@/app/actions/upload-file";
import { toast } from "sonner";

export default function PDFSection() {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const handleFileUpload = async (file: File) => {
    if (file.type === "application/pdf") {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("pdf", file);
      try {
        // Upload the PDF file to the @vercel/blob
        const res = await uploadPdf(formData);

        if (!res.url) {
          toast.error("File upload failed. Please try again.");
          throw new Error("File upload failed");
        }

        // Create a new thread with the uploaded PDF
        const thread = await fetch("/api/create-thread", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ filePath: res.url }),
        }).then((res) => res.json());

        //Save the thread ID to local storage
        localStorage.setItem("threadId", thread.threadId);

        // Set the PDF URL to display in the iframe
        setPdfUrl(res.url);
        toast.success("PDF uploaded successfully.");
      } catch (error) {
        console.error("File upload failed:", error);
        toast.error("File upload failed. Please try again.");
      } finally {
        setIsUploading(false);
      }
    } else {
      toast.error("Please upload a PDF file.");
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

  const handleNewUpload = () => {
    setPdfUrl(null);
  };

  return (
    <div className="w-full md:w-1/2 bg-gray-800 p-4 border-r border-gray-700">
      {pdfUrl ? (
        <div className="h-full flex flex-col">
          <iframe
            src={`https://docs.google.com/viewer?url=${encodeURIComponent(
              pdfUrl
            )}&embedded=true`}
            className="w-full h-[600px] border mb-4"
          ></iframe>
          <button
            onClick={handleNewUpload}
            className="bg-purple-500 hover:bg-purple-600 text-white rounded-md px-4 py-2 transition-colors duration-200 self-center"
          >
            Upload New PDF
          </button>
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
          {isUploading ? (
            <Loader2 size={48} className="text-gray-400 mb-4 animate-spin" />
          ) : (
            <Upload size={48} className="text-gray-400 mb-4" />
          )}
          <p className="text-gray-300 text-center mb-4">
            {isUploading
              ? "Uploading your PDF..."
              : "Drag and drop your PDF here"}
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
            disabled={isUploading}
          >
            {isUploading ? "Uploading..." : "Select PDF"}
          </button>
        </div>
      )}
    </div>
  );
}

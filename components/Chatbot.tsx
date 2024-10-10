"use client";

import React, { useState, useRef, DragEvent } from "react";
import { Send, User, Bot, Upload } from "lucide-react";
import PDFViewer from "./PdfPreview";

interface Message {
  text: string;
  sender: "user" | "bot";
}

export default function Chatbot(): JSX.Element {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSend = (): void => {
    if (input.trim()) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: input, sender: "user" },
      ]);
      setTimeout(() => {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            text: "I'm processing your request about the PDF.",
            sender: "bot",
          },
        ]);
      }, 1000);
      setInput("");
    }
  };

  const handleFileUpload = (file: File) => {
    if (file.type === "application/pdf") {
      setPdfFile(file);
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
    <div className="min-h-screen bg-gray-900 flex flex-col md:flex-row">
      {/* PDF Upload and Viewer */}
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

      {/* Chat Interface */}
      <div className="w-full md:w-1/2 flex flex-col bg-gray-800 max-h-screen">
        <div className="flex-1 overflow-y-scroll p-4 space-y-4 custom-scrollbar">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div className={`flex items-start space-x-2 max-w-[80%]`}>
                <div
                  className={`p-2 rounded-full ${
                    message.sender === "user" ? "bg-purple-500" : "bg-gray-600"
                  }`}
                >
                  {message.sender === "user" ? (
                    <User size={20} className="text-white" aria-hidden="true" />
                  ) : (
                    <Bot
                      size={20}
                      className="text-gray-300"
                      aria-hidden="true"
                    />
                  )}
                </div>
                <div
                  className={`px-4 py-2 rounded-lg ${
                    message.sender === "user"
                      ? "bg-purple-500 text-white"
                      : "bg-gray-700 text-gray-200"
                  }`}
                >
                  {message.text}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-gray-700">
          <div className="flex space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setInput(e.target.value)
              }
              onKeyUp={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask about the PDF..."
              className="flex-grow px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              aria-label="Chat input"
            />
            <button
              onClick={handleSend}
              className="bg-purple-500 hover:bg-purple-600 text-white rounded-md px-4 py-2 transition-colors duration-200"
              aria-label="Send message"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

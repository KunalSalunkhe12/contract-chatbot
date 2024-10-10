"use client";

import React, { useState } from "react";
import PDFSection from "./PdfSection";
import ChatSection from "./ChatSection";
import { uploadFile } from "@/app/actions/upload-file";

export default function Chatbot(): JSX.Element {
  const [filePath, setFilePath] = useState<string | null>(null);

  const handleFileUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await uploadFile(formData);
      setFilePath(res.path);
      if (res.success) {
        console.log("File uploaded successfully:", res.path);
      }
    } catch (error) {
      console.error("File upload failed:", error);
    }
  };

  const handleSendMessage = async (message: string) => {
    console.log("Message sent:", message);
    const res = await fetch("/api/create-assistant", {
      method: "POST",
    });
    const data = await res.json();

    const chat = await fetch("/api/create-vector-store", {
      method: "POST",
      body: JSON.stringify({
        filePath: filePath,
        assistantId: data.assistantId,
        message,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const chatData = await chat.json();
    console.log("Chat data:", chatData);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col md:flex-row">
      <PDFSection onFileUpload={handleFileUpload} />
      <ChatSection onSendMessage={handleSendMessage} />
    </div>
  );
}

"use client";

import React from "react";
import PDFSection from "./PdfSection";
import ChatSection from "./ChatSection";
import { uploadFile } from "@/app/actions/upload-file";

export default function Chatbot(): JSX.Element {
  const handleFileUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
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
  };

  const handleSendMessage = async (message: string) => {
    const threadId = localStorage.getItem("threadId");
    if (!threadId) {
      console.error("Thread ID not found in local storage");
      return;
    }

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify({
          message,
          assistantId: process.env.NEXT_PUBLIC_ASSISTANT_ID,
          threadId,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      console.log(data);
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col md:flex-row">
      <PDFSection onFileUpload={handleFileUpload} />
      <ChatSection onSendMessage={handleSendMessage} />
    </div>
  );
}

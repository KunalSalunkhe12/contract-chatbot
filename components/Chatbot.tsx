"use client";

import React, { useState } from "react";
import PDFSection from "./PdfSection";
import ChatSection from "./ChatSection";

interface Message {
  text: string;
  sender: "user" | "bot";
}
export default function Chatbot(): JSX.Element {
  const [messages, setMessages] = useState<Message[]>([]);

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
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: data.text, sender: "bot" },
      ]);
    } catch (error) {
      console.error("Failed to send message:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: "Something went Wrong. Please Try Again", sender: "bot" },
      ]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col md:flex-row">
      <PDFSection />
      <ChatSection
        onSendMessage={handleSendMessage}
        messages={messages}
        setMessages={setMessages}
      />
    </div>
  );
}

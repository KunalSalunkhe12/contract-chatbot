"use client";

import React from "react";
import PDFSection from "./PdfSection";
import ChatSection from "./ChatSection";

export default function Chatbot(): JSX.Element {
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col md:flex-row">
      <PDFSection />
      <ChatSection />
    </div>
  );
}

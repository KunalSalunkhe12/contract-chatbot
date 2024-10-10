"use client";

import React, { useState } from "react";
import { Send, User, Bot } from "lucide-react";

interface Message {
  text: string;
  sender: "user" | "bot";
}

interface ChatSectionProps {
  onSendMessage: (message: string) => void;
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  messages: Message[];
}

export default function ChatSection({
  onSendMessage,
  messages,
  setMessages,
}: ChatSectionProps) {
  const [input, setInput] = useState<string>("");

  const handleSend = (): void => {
    if (input.trim()) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: input, sender: "user" },
      ]);
      onSendMessage(input);
      setInput("");
    }
  };

  return (
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
                  <Bot size={20} className="text-gray-300" aria-hidden="true" />
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
  );
}

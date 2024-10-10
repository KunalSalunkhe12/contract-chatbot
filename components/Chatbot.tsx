"use client";

import { useState, KeyboardEvent } from "react";
import { Send, ChevronDown, User, Bot } from "lucide-react";

interface Contract {
  id: number;
  name: string;
  file: string;
}

const contracts: Contract[] = [
  { id: 1, name: "Non-Disclosure Agreement", file: "/contracts/1.pdf" },
  { id: 2, name: "Employment Contract", file: "/contracts/2.pdf" },
  { id: 3, name: "Service Level Agreement", file: "/contracts/3.pdf" },
  { id: 4, name: "Lease Agreement", file: "/contracts/4.pdf" },
  {
    id: 5,
    name: "Software License Agreement",
    file: "/contracts/5.pdf",
  },
];

interface Message {
  text: string;
  sender: "user" | "bot";
}

export default function Chatbot() {
  const [selectedContract, setSelectedContract] = useState<Contract>(
    contracts[0]
  );
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, { text: input, sender: "user" }]);
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            text: "I'm processing your request about the contract.",
            sender: "bot",
          },
        ]);
      }, 1000);
      setInput("");
    }
  };

  const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSend();
    }
  };

  const handleContractSelect = (contract: Contract) => {
    setSelectedContract(contract);
    setDropdownOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col md:flex-row">
      {/* PDF Viewer */}
      <div className="w-full md:w-1/2 bg-gray-800 p-4 border-r border-gray-700">
        <div className="mb-4 relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="w-full bg-gray-700 border border-gray-600 rounded-md px-4 py-2 text-left font-medium text-gray-200 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            {selectedContract.name}
            <ChevronDown className="float-right mt-1" size={20} />
          </button>
          {dropdownOpen && (
            <div className="absolute z-10 mt-1 w-full bg-gray-700 shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
              {contracts.map((contract) => (
                <div
                  key={contract.id}
                  className="cursor-pointer select-none relative py-2 pl-3 pr-9 text-gray-300 hover:bg-purple-600 hover:text-white"
                  onClick={() => handleContractSelect(contract)}
                >
                  {contract.name}
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="h-[calc(100vh-6rem)] bg-gray-700 rounded-md flex items-center justify-center">
          <iframe
            src={selectedContract.file}
            className="w-full h-full custom-scrollbar"
            title="PDF Viewer"
          />
        </div>
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
                    <User size={20} className="text-white" />
                  ) : (
                    <Bot size={20} className="text-gray-300" />
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
              onChange={(e) => setInput(e.target.value)}
              onKeyUp={handleKeyPress}
              placeholder="Ask about the contract..."
              className="flex-grow px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <button
              onClick={handleSend}
              className="bg-purple-500 hover:bg-purple-600 text-white rounded-md px-4 py-2 transition-colors duration-200"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

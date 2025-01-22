"use client";

import { useState, useRef, useEffect } from "react";
import {
  ArrowUpIcon,
  SparklesIcon,
  XMarkIcon,
  BeakerIcon,
} from "@heroicons/react/24/outline";
import ReactMarkdown from "react-markdown";

export default function AIChat() {
  const [articleContent, setArticleContent] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [conversation, setConversation] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showBetaPopup, setShowBetaPopup] = useState(true);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation, isTyping]);

  const handleSendMessage = async () => {
    if (!articleContent || !message) {
      setError("Please provide both article content and message");
      return;
    }

    setError("");
    setLoading(true);
    setConversation((prev) => [...prev, { sender: "user", message }]);
    setMessage("");
    setIsTyping(true);

    try {
      const response = await fetch(
        "https://python-backend-91zp.onrender.com/api/interact",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ article_content: articleContent, message }),
        }
      );

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.detail || "Failed to fetch response");

      await new Promise((resolve) => setTimeout(resolve, 1000));
      setConversation((prev) => [
        ...prev,
        { sender: "ai", message: data.reply },
      ]);
    } catch (err) {
      setError(err.message || "An unknown error occurred");
    } finally {
      setLoading(false);
      setIsTyping(false);
    }
  };

"use client";

import { useState, useRef, useEffect } from "react";
import {
  ArrowUpIcon,
  SparklesIcon,
  XMarkIcon,
  BeakerIcon,
} from "@heroicons/react/24/outline";
import ReactMarkdown from "react-markdown";

export default function AIChat() {
  const [articleContent, setArticleContent] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [conversation, setConversation] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showBetaPopup, setShowBetaPopup] = useState(true);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation, isTyping]);

  const handleSendMessage = async () => {
    if (!articleContent || !message) {
      setError("Please provide both article content and message");
      return;
    }

    setError("");
    setLoading(true);
    setConversation((prev) => [...prev, { sender: "user", message }]);
    setMessage("");
    setIsTyping(true);

    try {
      const response = await fetch(
        "https://python-backend-91zp.onrender.com/api/interact",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ article_content: articleContent, message }),
        }
      );

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.detail || "Failed to fetch response");

      await new Promise((resolve) => setTimeout(resolve, 1000));
      setConversation((prev) => [
        ...prev,
        { sender: "ai", message: data.reply },
      ]);
    } catch (err) {
      setError(err.message || "An unknown error occurred");
    } finally {
      setLoading(false);
      setIsTyping(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-50 flex flex-col">
      {/* Beta Version Popup */}
      {showBetaPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6">
            <div className="flex items-center mb-4">
              <BeakerIcon className="w-6 h-6 text-orange-500 mr-2" />
              <h2 className="text-lg font-bold text-gray-900">Beta Version</h2>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              This AI assistant is currently in beta. Response times may vary as
              we optimize our systems.
            </p>
            <div className="bg-orange-50 p-3 rounded-lg mb-4">
              <p className="text-xs text-gray-600">
                <strong className="text-orange-500">Note:</strong> This is not a
                conversational chatbot. It answers specific questions about the
                provided article.
              </p>
            </div>
            <button
              onClick={() => setShowBetaPopup(false)}
              className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition"
            >
              Got it, continue
            </button>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="flex flex-col lg:flex-row h-screen">
        {/* Sidebar */}
        <aside className="bg-white shadow-lg lg:w-96 p-6 flex-shrink-0">
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <div className="bg-orange-100 p-2 rounded-lg">
                <SparklesIcon className="w-6 h-6 text-orange-500" />
              </div>
              <h1 className="ml-3 text-xl font-bold text-gray-800">SAai</h1>
            </div>
            <textarea
              placeholder="Paste your article content here..."
              value={articleContent}
              onChange={(e) => setArticleContent(e.target.value)}
              className="w-full h-64 p-4 bg-gray-50 border border-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
        </aside>

        {/* Chat Section */}
        <main className="flex-1 flex flex-col bg-gray-50">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6">
            {error && (
              <div className="p-4 bg-red-50 text-red-600 rounded-lg mb-4">
                {error}
              </div>
            )}

            {conversation.map((chat, index) => (
              <div
                key={index}
                className={`flex ${
                  chat.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-lg p-4 rounded-lg shadow-md ${
                    chat.sender === "user"
                      ? "bg-orange-500 text-white"
                      : "bg-white text-gray-800"
                  }`}
                >
                  <ReactMarkdown>{chat.message}</ReactMarkdown>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white shadow-md p-4 rounded-lg max-w-lg">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef}></div>
          </div>

          {/* Input */}
          <div className="p-4 bg-white border-t border-gray-200">
            <div className="flex items-center">
              <textarea
                placeholder="Ask a question about the article..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
              <button
                onClick={handleSendMessage}
                disabled={loading || !message.trim()}
                className="ml-4 px-4 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <ArrowUpIcon className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

}


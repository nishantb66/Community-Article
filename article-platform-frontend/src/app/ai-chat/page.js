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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Beta Version Popup */}
      {showBetaPopup && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-8 max-w-md mx-4 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <BeakerIcon className="w-8 h-8 text-orange-500" />
              <h2 className="text-xl font-bold text-gray-900">Beta Version</h2>
            </div>
            <p className="text-gray-600 mb-6">
              This AI assistant is currently in beta testing. Response times may
              be slower than expected as we optimize our systems.
            </p>
            <button
              onClick={() => setShowBetaPopup(false)}
              className="w-full bg-orange-500 text-white py-3 rounded-xl hover:bg-orange-600 transition-colors font-medium"
            >
              Got it, continue
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row h-screen">
        {/* Enhanced Sidebar */}
        <div className="w-full lg:w-96 bg-white shadow-lg z-10">
          <div className="p-6 h-full flex flex-col">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg">
                <SparklesIcon className="w-6 h-6 text-orange-500" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">
                SAai
              </h1>
            </div>

            <div className="flex-1 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Article Content
                </label>
                <div className="relative">
                  <textarea
                    placeholder="Paste your article content here..."
                    value={articleContent}
                    onChange={(e) => setArticleContent(e.target.value)}
                    className="w-full h-[calc(100vh-280px)] p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 resize-none text-gray-700 placeholder-gray-400"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Chat Area */}
        <div className="flex-1 flex flex-col bg-gray-50">
          <div className="flex-1 p-6 overflow-y-auto">
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm">
                {error}
              </div>
            )}

            <div className="space-y-6">
              {conversation.map((chat, index) => (
                <div
                  key={index}
                  className={`flex ${
                    chat.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] p-4 rounded-2xl shadow-sm ${
                      chat.sender === "user"
                        ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white"
                        : "bg-white"
                    }`}
                  >
                    <ReactMarkdown
                      className={`prose ${
                        chat.sender === "user" ? "prose-invert" : "prose-gray"
                      } max-w-none text-sm`}
                    >
                      {chat.message}
                    </ReactMarkdown>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white shadow-sm rounded-2xl p-4 max-w-[80%]">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Enhanced Input Area */}
          <div className="p-6 bg-white border-t border-gray-100">
            <div className="flex gap-4 max-w-4xl mx-auto">
              <div className="flex-1">
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
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 resize-none text-gray-700 placeholder-gray-400"
                  rows="2"
                />
              </div>
              <button
                onClick={handleSendMessage}
                disabled={loading || !message.trim()}
                className="flex-shrink-0 inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow transition-all"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <ArrowUpIcon className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


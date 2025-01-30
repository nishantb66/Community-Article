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
  const [showPopup, setShowPopup] = useState(true); // Controls the visibility of the popup
  const [inputType, setInputType] = useState("content"); // "content" or "url"
  const [articleContent, setArticleContent] = useState("");
  const [articleURL, setArticleURL] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [conversation, setConversation] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation, isTyping]);

  const simulateTyping = (text) => {
    return new Promise((resolve) => {
      let index = 0;
      const chunkSize = 3; // Number of characters to append at each step
      const interval = setInterval(() => {
        setConversation((prev) => {
          const lastMessage = prev[prev.length - 1];
          if (lastMessage?.sender === "ai") {
            return [
              ...prev.slice(0, -1),
              {
                sender: "ai",
                message:
                  lastMessage.message + text.slice(index, index + chunkSize),
              },
            ];
          } else {
            return [
              ...prev,
              { sender: "ai", message: text.slice(index, index + chunkSize) },
            ];
          }
        });
        index += chunkSize;
        if (index >= text.length) {
          clearInterval(interval);
          resolve();
        }
      }, 20); // Typing interval
    });
  };

  const handleSendMessage = async () => {
    if (inputType === "content" && (!articleContent || !message)) {
      setError("Please provide both article content and a message.");
      return;
    }

    if (inputType === "url" && (!articleURL || !message)) {
      setError("Please provide both a valid URL and a message.");
      return;
    }

    setError("");
    setLoading(true);
    setConversation((prev) => [...prev, { sender: "user", message }]);
    setMessage("");
    setIsTyping(true);

    try {
      const endpoint =
        inputType === "content"
          ? "https://python-backend-psi.vercel.app/api/interact"
          : "https://python-backend-psi.vercel.app/api/interact_from_url";

      const payload =
        inputType === "content"
          ? { article_content: articleContent, message }
          : { url: articleURL, message };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.detail || "Failed to fetch response");

      const replyText = data.reply || "No response received.";
      await simulateTyping(replyText);
    } catch (err) {
      setError(err.message || "An unknown error occurred");
    } finally {
      setLoading(false);
      setIsTyping(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Popup on page load */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-4 sm:p-8 w-full max-w-[95%] sm:max-w-md mx-auto shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center gap-3 mb-4">
              <BeakerIcon className="w-6 sm:w-8 h-6 sm:h-8 text-orange-500" />
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                Beta Version
              </h2>
            </div>
            <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
              Welcome to SAai, your AI assistant currently in beta testing. This
              platform may experience slower response times as we optimize our
              systems. Please provide article content or URLs to get started.
            </p>
            <div className="bg-orange-50 p-3 sm:p-4 rounded-xl mb-4 sm:mb-6">
              <p className="text-xs sm:text-sm text-gray-600">
                <span className="font-medium text-orange-500">Note:</span> This
                assistant only answers questions based on the article content
                you provide. Questions outside the scope of the provided content
                may not yield relevant responses.
              </p>
            </div>
            <button
              onClick={() => setShowPopup(false)}
              className="w-full bg-orange-500 text-white py-2.5 sm:py-3 rounded-xl hover:bg-orange-600 transition-colors font-medium text-sm sm:text-base"
            >
              Got it, continue
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row h-screen">
        {/* Sidebar */}
        <div className="w-full lg:w-96 bg-white shadow-lg z-10">
          <div className="p-6 h-full flex flex-col">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg">
                <SparklesIcon className="w-6 h-6 text-orange-500" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">SAai</h1>
            </div>

            <div className="flex-1 space-y-6">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setInputType("content")}
                  className={`px-4 py-2 rounded-xl font-medium ${
                    inputType === "content"
                      ? "bg-orange-500 text-white"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  Use Article Content
                </button>
                <button
                  onClick={() => setInputType("url")}
                  className={`px-4 py-2 rounded-xl font-medium ${
                    inputType === "url"
                      ? "bg-orange-500 text-white"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  Use Article URL
                </button>
              </div>

              {inputType === "content" && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Article Content
                  </label>
                  <textarea
                    placeholder="Paste your article content here..."
                    value={articleContent}
                    onChange={(e) => setArticleContent(e.target.value)}
                    className="w-full h-[calc(100vh-280px)] p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 resize-none text-gray-700 placeholder-gray-400"
                  />
                </div>
              )}

              {inputType === "url" && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Article URL
                  </label>
                  <input
                    type="text"
                    placeholder="Paste the article URL here..."
                    value={articleURL}
                    onChange={(e) => setArticleURL(e.target.value)}
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-gray-700 placeholder-gray-400"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Chat Area */}
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

          {/* Input Area */}
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



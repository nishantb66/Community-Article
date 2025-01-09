"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState("");
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUserId = localStorage.getItem("userId");
      setUserId(storedUserId);
    }
  }, []);

  const fetchBookmarks = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const res = await fetch(`https://community-article-backend.onrender.com/api/bookmarks/${userId}`);
      if (!res.ok) throw new Error("Failed to fetch bookmarks");
      const data = await res.json();
      setBookmarks(data);
    } catch (err) {
      console.error("Error fetching bookmarks:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookmarks();
  }, [userId]);

  const handleRemoveBookmark = async (articleId) => {
    try {
      const res = await fetch("https://community-article-backend.onrender.com/api/bookmarks/remove", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, articleId }),
      });

      if (!res.ok) throw new Error("Failed to remove bookmark");
      await fetchBookmarks();
      setNotification("Bookmark removed successfully!");
      setTimeout(() => setNotification(""), 3000);
    } catch (err) {
      console.error("Error removing bookmark:", err);
      setNotification("Failed to remove bookmark.");
      setTimeout(() => setNotification(""), 3000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50 flex justify-center items-center">
        <div className="space-y-4">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-orange-600 font-medium">
            Loading your bookmarks...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50">
      {/* Hero Section */}
      <div className="bg-white/30 backdrop-blur-md border-b border-white/20">
        <div className="container mx-auto px-4 py-8 sm:py-12">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-800 text-center mb-4">
            Your Bookmarked Articles
          </h1>
          <p className="text-gray-600 text-center max-w-2xl mx-auto">
            Your personal collection of inspiring articles and stories
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 sm:py-12">
        {/* Toast Notification */}
        {notification && (
          <div className="fixed top-4 right-4 z-50 animate-fade-in-down">
            <div className="bg-white px-6 py-4 rounded-lg shadow-lg border-l-4 border-green-500">
              <p className="text-gray-800">{notification}</p>
            </div>
          </div>
        )}

        {bookmarks.length === 0 ? (
          <div className="text-center py-16 px-4">
            <div className="w-24 h-24 mx-auto mb-6 text-orange-400">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              No bookmarks yet
            </h2>
            <p className="text-gray-600 mb-8">
              Start exploring and save articles that inspire you!
            </p>
            <Link
              href="/"
              className="inline-flex items-center px-6 py-3 bg-orange-500 text-white font-semibold rounded-full hover:bg-orange-600 transition transform hover:scale-105"
            >
              Explore Articles
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {bookmarks.map((article) => (
              <div
                key={article._id}
                className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-medium text-orange-500 bg-orange-50 px-3 py-1 rounded-full">
                      {new Date(article.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-gray-800 group-hover:text-orange-500 transition-colors duration-300 mb-3">
                    {article.title || "Untitled Article"}
                  </h2>
                  <div className="text-sm text-gray-600 mb-4 line-clamp-3">
                    {article.content ? (
                      <div
                        dangerouslySetInnerHTML={{
                          __html: article.content.slice(0, 150) + "...",
                        }}
                      />
                    ) : (
                      "No content available."
                    )}
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <Link
                      href={`/article/${article._id}`}
                      className="text-orange-500 font-semibold hover:text-orange-600 transition-colors duration-300"
                    >
                      Read Article →
                    </Link>
                    <button
                      onClick={() => handleRemoveBookmark(article._id)}
                      className="text-gray-400 hover:text-red-500 transition-colors duration-300"
                    >
                      <svg
                        className="w-6 h-6"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


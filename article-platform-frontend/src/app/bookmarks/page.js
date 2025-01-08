"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(""); // State for notification message
  const [userId, setUserId] = useState(null); // State for userId

  useEffect(() => {
    // Access localStorage on the client-side
    if (typeof window !== "undefined") {
      const storedUserId = localStorage.getItem("userId");
      setUserId(storedUserId); // Set userId from localStorage
    }
  }, []);

  const fetchBookmarks = async () => {
    if (!userId) return;

    setLoading(true);
    try {
      const res = await fetch(`https://community-article-backend.onrender.com/api/bookmarks/${userId}`);
      if (!res.ok) {
        throw new Error("Failed to fetch bookmarks");
      }
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

  // Function to remove a bookmark
  const handleRemoveBookmark = async (articleId) => {
    try {
      const res = await fetch("https://community-article-backend.onrender.com/api/bookmarks/remove", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, articleId }),
      });

      if (!res.ok) {
        throw new Error("Failed to remove bookmark");
      }

      // Refresh bookmarks after removal
      await fetchBookmarks();

      // Set notification message
      setNotification("Bookmark removed successfully!");
      setTimeout(() => setNotification(""), 3000); // Clear notification after 3 seconds
    } catch (err) {
      console.error("Error removing bookmark:", err);
      setNotification("Failed to remove bookmark.");
      setTimeout(() => setNotification(""), 3000); // Clear notification after 3 seconds
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p className="text-lg font-semibold text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 to-pink-100 py-10">
      <div className="container mx-auto px-4 sm:px-10">
        <h1 className="text-3xl font-extrabold text-gray-800 mb-6">
          Your Bookmarked Articles
        </h1>

        {/* Notification */}
        {notification && (
          <div className="mb-6 p-4 bg-green-100 border border-green-500 text-green-700 rounded-lg">
            {notification}
          </div>
        )}

        {bookmarks.length === 0 ? (
          <p className="text-lg text-gray-600">
            You have no bookmarks yet. Start exploring and bookmark articles you
            like!
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookmarks.map((article) => (
              <div
                key={article._id} // Ensure _id is present and unique
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-transform transform hover:-translate-y-1"
              >
                <div className="p-4">
                  <h2 className="text-xl font-semibold text-gray-800">
                    {article.title || "Untitled Article"}{" "}
                    {/* Fallback to "Untitled Article" */}
                  </h2>
                  <p className="text-sm text-gray-600 mt-2 line-clamp-3">
                    {article.content ? (
                      <div
                        dangerouslySetInnerHTML={{
                          __html: article.content.slice(0, 120),
                        }}
                      />
                    ) : (
                      "No content available."
                    )}
                  </p>
                  {article._id && (
                    <Link
                      href={`/article/${article._id}`}
                      className="text-orange-500 font-semibold hover:underline mt-4 inline-block"
                    >
                      Read More
                    </Link>
                  )}
                  <button
                    onClick={() => handleRemoveBookmark(article._id)}
                    className="mt-4 block bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-600 transition"
                  >
                    Remove Bookmark
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

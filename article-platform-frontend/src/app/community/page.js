"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { apiBaseUrl } from "../../utils/api";
import { motion } from "framer-motion";

export default function CommunityPage() {
  const [discussions, setDiscussions] = useState([]);
  const [newDiscussion, setNewDiscussion] = useState({ title: "", body: "" });
  const [loading, setLoading] = useState(false);

  const fetchDiscussions = async () => {
    try {
      const response = await fetch(`${apiBaseUrl}/api/community`);
      if (response.ok) {
        const data = await response.json();
        setDiscussions(data);
      } else {
        console.error("Failed to fetch discussions.");
      }
    } catch (error) {
      console.error("Error fetching discussions:", error);
    }
  };

  const handleCreateDiscussion = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("You must be logged in to create a discussion.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${apiBaseUrl}/api/community/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newDiscussion, userId }),
      });

      if (response.ok) {
        setNewDiscussion({ title: "", body: "" });
        fetchDiscussions();
      } else {
        console.error("Failed to create discussion.");
      }
    } catch (error) {
      console.error("Error creating discussion:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiscussions();
  }, []);

return (
  <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
    <header className="backdrop-blur-sm bg-white/30 border-b border-gray-200 sticky top-0 z-10">
      <div className="bg-gradient-to-r from-orange-500 to-orange-600">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="container mx-auto px-4 py-6 max-w-5xl"
        >
          <h1 className="text-2xl md:text-4xl font-bold tracking-tight text-white text-center">
            Community Forum
          </h1>
        </motion.div>
      </div>
      <Link
        href="/guidelines"
        className="w-full sm:w-auto px-6 py-2.5 text-center bg-white/10 backdrop-blur-sm text-gray-800 rounded-xl font-semibold shadow-lg hover:bg-white/20 transition-all duration-300 text-sm sm:text-base flex items-center justify-center space-x-2"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <span>Guidelines</span>
      </Link>
    </header>

    <main className="container mx-auto px-4 py-8 max-w-5xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 backdrop-blur-sm bg-white/80 p-6 md:p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
      >
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800 text-center">
          Start a New Discussion
        </h2>
        <div className="space-y-6 max-w-3xl mx-auto">
          <input
            type="text"
            placeholder="What's on your mind?"
            value={newDiscussion.title}
            onChange={(e) =>
              setNewDiscussion({ ...newDiscussion, title: e.target.value })
            }
            className="block w-full p-4 text-lg border border-gray-200 rounded-xl focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
          />
          <textarea
            placeholder="Share your thoughts in detail..."
            rows="5"
            value={newDiscussion.body}
            onChange={(e) =>
              setNewDiscussion({ ...newDiscussion, body: e.target.value })
            }
            className="block w-full p-4 text-lg border border-gray-200 rounded-xl focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all resize-none"
          />
          <div className="text-center">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCreateDiscussion}
              disabled={loading}
              className="px-8 py-4 text-lg text-white bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl font-semibold shadow-lg hover:shadow-orange-500/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Creating Discussion...
                </span>
              ) : (
                "Create Discussion"
              )}
            </motion.button>
          </div>
        </div>
      </motion.div>

      <div className="space-y-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 text-center">
          Recent Discussions
        </h2>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid gap-6 md:grid-cols-2"
        >
          {discussions.map((discussion, index) => (
            <motion.div
              key={discussion._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group backdrop-blur-sm bg-white/80 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-orange-500 transition-colors">
                {discussion.title}
              </h3>
              <p className="text-gray-600 mb-4 line-clamp-2">
                {discussion.body}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-gray-500">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                  </svg>
                  <span className="font-medium">
                    {discussion.author?.username}
                  </span>
                </div>
                <Link
                  href={`/community/${discussion._id}`}
                  className="inline-flex items-center px-4 py-2 text-sm font-semibold text-orange-500 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"
                >
                  Share your thoughts
                  <svg
                    className="w-4 h-4 ml-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </main>
  </div>
);
}

"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation"; // Use `useParams` for dynamic route handling
import { apiBaseUrl } from "../../../utils/api";
import { motion } from "framer-motion";

export default function DiscussionDetailPage() {
  const { id } = useParams(); // Get `id` from the dynamic route
  const [discussion, setDiscussion] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch discussion details
  const fetchDiscussion = async () => {
    try {
      const response = await fetch(`${apiBaseUrl}/api/community/${id}`);
      if (response.ok) {
        const data = await response.json();
        setDiscussion(data);
      } else {
        console.error("Failed to fetch discussion.");
      }
    } catch (error) {
      console.error("Error fetching discussion:", error);
    }
  };

  // Add a comment to the discussion
  const handleAddComment = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("You must be logged in to comment.");
      return;
    }

    if (!newComment.trim()) {
      alert("Comment cannot be empty.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `${apiBaseUrl}/api/community/${id}/comment`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ body: newComment, userId }),
        }
      );

      if (response.ok) {
        setNewComment("");
        fetchDiscussion(); // Refresh comments
      } else {
        console.error("Failed to add comment.");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch discussion on mount and when `id` changes
  useEffect(() => {
    if (id) fetchDiscussion();
  }, [id]);

  // If discussion is still loading
  if (!discussion) {
    return <p>Loading...</p>;
  }

return (
  <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50">
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/70 border-b border-gray-100">
      <div className="bg-gradient-to-r from-orange-500 via-orange-600 to-orange-500">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="container mx-auto px-4 py-4 md:py-6 max-w-4xl"
        >
          <div className="flex items-center justify-between">
            <button
              onClick={() => window.history.back()}
              className="text-white/80 hover:text-white transition-colors"
            >
              ← Back
            </button>
            <h1 className="text-lg md:text-2xl lg:text-3xl font-bold text-white text-center line-clamp-1 mx-4">
              {discussion.title}
            </h1>
            <div className="w-8"></div>
          </div>
        </motion.div>
      </div>
    </header>

    <main className="container mx-auto px-4 py-6 md:py-8 max-w-4xl">
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 backdrop-blur-md bg-white/90 p-6 md:p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500"
      >
        <div className="flex items-center space-x-4 mb-6 pb-6 border-b border-gray-100">
          <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-lg">
              {discussion.author?.username[0].toUpperCase()}
            </span>
          </div>
          <div>
            <p className="font-semibold text-gray-900">
              {discussion.author?.username}
            </p>
            <p className="text-sm text-gray-500">
              Posted on {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="prose prose-lg max-w-none mb-6">
          <p className="text-gray-700 leading-relaxed">{discussion.body}</p>
        </div>
      </motion.article>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 backdrop-blur-md bg-white/90 p-6 md:p-8 rounded-2xl shadow-xl"
      >
        <h2 className="text-xl md:text-2xl font-bold mb-6 text-gray-800">
          Share Your Thoughts
        </h2>
        <textarea
          placeholder="What's on your mind?"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="block w-full p-4 text-gray-700 bg-gray-50/50 border-0 rounded-xl focus:ring-4 focus:ring-orange-500/20 transition-all mb-4 resize-none"
          rows="4"
        />
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleAddComment}
          disabled={loading}
          className="w-full md:w-auto px-8 py-4 text-white bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl font-semibold shadow-lg hover:shadow-orange-500/25 transition-all duration-300 disabled:opacity-50"
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
              Creating...
            </span>
          ) : (
            "Post Comment"
          )}
        </motion.button>
      </motion.section>

      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800">
            Discussion ({discussion.comments.length})
          </h2>
        </div>

        {discussion.comments.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 bg-white/90 rounded-2xl shadow-lg"
          >
            <p className="text-gray-500 text-lg">
              Be the first to join this discussion!
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid gap-4"
          >
            {discussion.comments.map((comment, index) => (
              <motion.div
                key={comment._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group backdrop-blur-md bg-white/90 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <p className="text-gray-700 mb-4 text-lg">{comment.body}</p>
                <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {comment.author?.username[0].toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {comment.author?.username}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date().toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>
    </main>
  </div>
);
}


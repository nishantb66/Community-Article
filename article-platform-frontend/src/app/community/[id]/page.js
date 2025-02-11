"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation"; // Use `useParams` for dynamic route handling
import { apiBaseUrl } from "../../../utils/api";
import Link from "next/link";

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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 max-w-4xl">
          <div className="flex items-center justify-between">
            <button
              onClick={() => window.history.back()}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back
            </button>
            <h1 className="text-xl font-semibold text-gray-900 line-clamp-1 mx-4">
              {discussion.title}
            </h1>
            <div className="w-8"></div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Discussion Card */}
        <article className="mb-8 bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-start space-x-4 mb-6 pb-6 border-b border-gray-100">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">
                {discussion.author?.username[0].toUpperCase()}
              </span>
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-gray-900">
                  {discussion.author?.username}
                </p>
                <time className="text-sm text-gray-500">
                  {new Date(discussion.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
              </div>
              <p className="mt-4 text-gray-700 leading-relaxed whitespace-pre-wrap">
                {discussion.body}
              </p>
            </div>
          </div>
        </article>

        {/* Comment Section */}
        <section className="space-y-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Join the Discussion
            </h2>
            <textarea
              placeholder="Share your thoughts..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full p-4 text-gray-700 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
              rows="4"
            />
            <div className="mt-4 text-right">
              <button
                onClick={handleAddComment}
                disabled={loading || !newComment.trim()}
                className="px-6 py-2 text-white bg-blue-500 rounded-lg font-medium hover:bg-blue-600 focus:ring-4 focus:ring-blue-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Posting...
                  </>
                ) : (
                  "Post Comment"
                )}
              </button>
            </div>
          </div>

          {/* Comments List */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {discussion.comments.length} Comments
            </h3>

            {discussion.comments.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg border border-gray-100">
                <p className="text-gray-500">
                  Be the first to share your thoughts!
                </p>
              </div>
            ) : (
              <div className="grid gap-4">
                {discussion.comments.map((comment) => (
                  <div
                    key={comment._id}
                    className="bg-white p-6 rounded-lg shadow-sm border border-gray-100"
                  >
                    <p className="text-gray-700 mb-4 leading-relaxed">
                      {comment.body}
                    </p>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-gray-500 to-gray-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-medium">
                            {comment.author?.username[0].toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {comment.author?.username}
                          </p>
                          <time className="text-xs text-gray-500">
                            {new Date(comment.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              }
                            )}
                          </time>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

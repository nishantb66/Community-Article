"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

const QuillEditor = dynamic(() => import("../../components/QuillEditor"), {
  ssr: false,
});

const CreateArticle = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(false);
  const [username, setUsername] = useState(null); // Logged-in user's username
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUsername = localStorage.getItem("userName");
      const userId = localStorage.getItem("userId");

      if (!userId) {
        router.push("/login");
      } else {
        setUsername(storedUsername || ""); // Set username or fallback to empty string
      }
    }
  }, [router]);

  const handleSubmit = async () => {
    const cleanedContent = content.replace(/<[^>]*>/g, "").trim();

    if (!title || !cleanedContent) {
      alert("All fields are required!");
      return;
    }

    let username = "";
    if (typeof window !== "undefined") {
      username = localStorage.getItem("userName"); // Fetch username from localStorage
    }

    if (!username) {
      alert("You must be logged in to create an article.");
      return;
    }

    const formData = { title, content, author: username };

    setLoading(true);

    try {
      const response = await fetch("https://community-article-backend.onrender.com/api/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        setTitle("");
        setContent("");
        setNotification(true);

        setTimeout(() => {
          setNotification(false);
          router.push(`/`);
        }, 3000);
      } else {
        alert("Failed to create article.");
      }
    } catch (err) {
      console.error(err);
      alert("Error creating article.");
    } finally {
      setLoading(false);
    }
  };

 return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-orange-50">
      {/* Notification Toast */}
      {notification && (
        <div className="fixed top-5 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-white/90 backdrop-blur-sm border border-green-500/20 text-green-700 py-3 px-6 rounded-xl shadow-lg flex items-center gap-2">
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
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span className="font-medium">Article published successfully!</span>
          </div>
        </div>
      )}

      <div className="container max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white/80 backdrop-blur-sm shadow-2xl rounded-2xl overflow-hidden">
          {/* Header */}
          <div className="relative bg-gradient-to-r from-orange-400 via-pink-400 to-orange-500 py-12 px-6 text-center">
            <div className="relative z-10">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2">
                Create Your Story
              </h1>
              <p className="text-white/90 text-sm sm:text-base">
                Share your insights and inspire others
              </p>
            </div>
            <div className="absolute inset-0 bg-black/10"></div>
          </div>

          {/* Form Container */}
          <div className="p-6 sm:p-8 lg:p-10 space-y-8">
            {/* Title Input */}
            <div className="space-y-2">
              <label
                htmlFor="title"
                className="block text-lg font-semibold text-gray-800"
              >
                Title
              </label>
              <input
                id="title"
                type="text"
                placeholder="Enter a captivating title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all duration-300"
                maxLength="100"
              />
              <div className="flex justify-end">
                <span className="text-sm text-gray-500">
                  {title.length}/100
                </span>
              </div>
            </div>

            {/* Content Editor */}
            <div className="space-y-2">
              <label
                htmlFor="content"
                className="block text-lg font-semibold text-gray-800"
              >
                Content
              </label>
              <div className="mt-2 rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                <QuillEditor setContent={setContent} />
              </div>
              {/* Warning Note */}
              <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-xl">
                <div className="flex items-start gap-3">
                  <svg
                    className="w-5 h-5 text-orange-500 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <div>
                    <p className="text-sm text-orange-700 font-medium">
                      Important Note:
                    </p>
                    <p className="text-sm text-orange-600 mt-1">
                      If you receive a "Failed to create article" error, please
                      remove images from your content and try again by adding
                      one or two images and if the error exist futher then
                      remove all images. We're working on supporting high quality images and videos in
                      future updates.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Author Input (Conditional) */}
            {!username && (
              <div className="space-y-2">
                <label
                  htmlFor="author"
                  className="block text-lg font-semibold text-gray-800"
                >
                  Author
                </label>
                <input
                  id="author"
                  type="text"
                  placeholder="Your pen name..."
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all duration-300"
                />
              </div>
            )}

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`w-full sm:w-auto px-8 py-4 rounded-xl text-base sm:text-lg font-semibold text-white ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
              } shadow-lg transform transition-all duration-300 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2`}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5"
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
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <span>Publishing...</span>
                </div>
              ) : (
                "Publish Article"
              )}
            </button>
          </div>
        </div>

        {/* Guidelines Link */}
        <div className="mt-8 text-center">
          <a
            href="/guidelines"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-orange-500 font-medium transition-colors duration-300"
            target="_blank"
            rel="noopener noreferrer"
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
            <span>Community Guidelines</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default CreateArticle;


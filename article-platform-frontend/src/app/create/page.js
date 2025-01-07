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
    <div className="bg-gradient-to-br from-orange-50 to-pink-100 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      {notification && (
        <div className="fixed top-5 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-green-500 text-white py-2 px-6 rounded-lg shadow-md flex items-center">
            <div className="mr-2 text-lg font-semibold">✔</div>
            <span>Article published successfully!</span>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-400 to-pink-400 py-8 px-6 text-white text-center">
          <h1 className="text-3xl font-bold">Create an Article</h1>
          <p className="mt-2 text-sm">Share your ideas with the world!</p>
        </div>

        {/* Form */}
        <div className="p-8 space-y-6">
          <div>
            <label
              htmlFor="title"
              className="block text-lg font-medium text-gray-700"
            >
              Title
            </label>
            <input
              id="title"
              type="text"
              placeholder="Enter a catchy title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 text-base"
            />
          </div>
          <div>
            <label
              htmlFor="content"
              className="block text-lg font-medium text-gray-700"
            >
              Content
            </label>
            <div className="mt-6">
              <QuillEditor setContent={setContent} />
            </div>
          </div>
          {!username && (
            <div>
              <label
                htmlFor="author"
                className="block text-lg font-medium text-gray-700"
              >
                Author
              </label>
              <input
                id="author"
                type="text"
                placeholder="Your name..."
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 text-base"
              />
            </div>
          )}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`w-full py-3 rounded-lg text-lg font-semibold text-white ${
              loading
                ? "bg-orange-300 cursor-not-allowed"
                : "bg-orange-500 hover:bg-orange-600 transition"
            } shadow-lg`}
          >
            {loading ? "Publishing..." : "Publish Article"}
          </button>
        </div>
      </div>

      <div className="mt-6 text-center">
        <a
          href="/guidelines"
          className="text-blue-600 hover:underline font-medium"
          target="_blank"
          rel="noopener noreferrer"
        >
          simpleArticle regulations
        </a>
      </div>
    </div>
  );
};

export default CreateArticle;


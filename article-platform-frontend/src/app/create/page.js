"use client";

import { useState } from "react";

const CreateArticle = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!title || !content || !author) {
      alert("All fields are required!");
      return;
    }

    const formData = {
      title,
      content,
      author,
    };

    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Article created successfully!");
        setTitle("");
        setContent("");
        setAuthor("");
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
    <div className="bg-gradient-to-r from-orange-100 to-orange-200 min-h-screen py-10 px-6">
      <div className="max-w-4xl mx-auto bg-gradient-to-br from-white to-gray-100 shadow-2xl rounded-3xl p-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
          Write an Article
        </h1>
        <div className="space-y-8">
          <div className="border-b pb-4">
            <input
              type="text"
              placeholder="Enter a catchy title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-3xl font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>
          <div>
            <textarea
              placeholder="Start writing your story..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full text-lg leading-7 text-gray-700 border border-gray-300 rounded-lg p-5 focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none h-64"
            />
          </div>
          <div className="mt-6">
            <input
              type="text"
              placeholder="Your name"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="w-full text-base text-gray-800 border-b-2 border-gray-300 focus:border-orange-400 focus:outline-none"
            />
          </div>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold text-lg hover:bg-orange-600 transition disabled:opacity-50"
          >
            {loading ? "Publishing..." : "Publish Article"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateArticle;

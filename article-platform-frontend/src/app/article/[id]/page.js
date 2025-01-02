"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation"; // Correct way to access params
import "../../../styles/globals.css";

export default function ArticlePage() {
  const [article, setArticle] = useState(null);
  const { id } = useParams(); // Retrieve the `id` directly using `useParams`

  useEffect(() => {
    async function fetchArticle() {
      try {
        const res = await fetch(`http://localhost:5000/api/articles/${id}`); // Replace with your backend URL
        if (!res.ok) {
          throw new Error("Failed to fetch the article");
        }
        const data = await res.json();
        setArticle(data);
      } catch (err) {
        console.error("Error fetching article:", err);
      }
    }

    if (id) {
      fetchArticle();
    }
  }, [id]);

  if (!article) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p className="text-lg font-semibold text-gray-500">
          Loading article...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-200 to-orange-100 py-10">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-4xl font-extrabold text-gray-900">
            {article.title}
          </h1>
          <div className="mt-4 flex items-center">
            <div className="w-12 h-12 rounded-full bg-gray-300 overflow-hidden">
              <img
                src="https://via.placeholder.com/100"
                alt="Author"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="ml-4">
              <p className="text-lg font-semibold text-gray-700">
                {article.author}
              </p>
              <p className="text-sm text-gray-500">
                {new Date(article.createdAt).toDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div
          className="prose prose-xl prose-gray whitespace-pre-line leading-relaxed"
          style={{
            whiteSpace: "pre-line",
            wordBreak: "break-word",
            fontSize: "1.25rem",
          }}
        >
          {article.content}
        </div>
      </main>
    </div>
  );
}

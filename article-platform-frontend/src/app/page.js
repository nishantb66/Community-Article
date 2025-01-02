"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import "../styles/globals.css";

export default function Home() {
  const [articles, setArticles] = useState([]);
  const [visibleArticles, setVisibleArticles] = useState(3);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredArticles, setFilteredArticles] = useState([]);

  // Fetch articles from the backend API
  useEffect(() => {
    fetch("https://community-article-backend.onrender.com/api/articles")
      .then((res) => res.json())
      .then((data) => {
        const sortedArticles = data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setArticles(sortedArticles);
        setFilteredArticles(sortedArticles);
      })
      .catch((err) => console.error("Error fetching articles:", err));
  }, []);

  // Load more articles
  const loadMoreArticles = () => {
    setVisibleArticles((prev) => prev + 3);
  };

  // Handle search
  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setFilteredArticles(articles);
    } else {
      const filtered = articles.filter(
        (article) =>
          article.title.toLowerCase().includes(query.toLowerCase()) ||
          article.content.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredArticles(filtered);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 to-pink-100">
      {/* Navigation Bar */}
      <header className="bg-white shadow-md py-4 sticky top-0 z-10">
        <div className="container mx-auto flex justify-between items-center px-4 sm:px-10">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center space-x-2 cursor-pointer">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-pink-400 rounded-full flex items-center justify-center">
                <span className="text-white text-xl font-bold">CA</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-gray-800 tracking-tight">
                Community Articles
              </h1>
            </div>
          </Link>

          {/* Write Article Button */}
          <Link
            href="/create"
            className="px-4 sm:px-6 py-2 bg-orange-500 text-white rounded-full font-semibold shadow-md hover:bg-orange-600 transition"
          >
            Write Article
          </Link>
        </div>
      </header>

      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row justify-center mt-8 items-center gap-4 px-4 sm:px-0">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search articles..."
          className="w-full sm:w-3/4 lg:w-1/3 px-4 py-2 sm:py-3 border border-gray-300 rounded-full shadow-md focus:ring-2 focus:ring-orange-400 focus:outline-none"
        />
        <Link
          href="/deleteRequest"
          className="text-sm text-orange-600 font-semibold hover:underline text-center"
        >
          Want your article removed? Put your request here
        </Link>
      </div>

      {/* Article List */}
      <main className="container mx-auto mt-8 px-4 sm:px-10">
        <div className="mb-6 sm:mb-10 text-center">
          <h2 className="text-2xl sm:text-4xl font-bold text-gray-800">
            Explore Articles
          </h2>
          <p className="text-gray-600 text-sm sm:text-md mt-2">
            Stay updated with the latest articles from the community
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredArticles.slice(0, visibleArticles).map((article) => (
            <div
              key={article._id}
              className="bg-white rounded-lg shadow-md hover:shadow-xl transition-transform transform hover:-translate-y-2 overflow-hidden"
            >
              <img
                src="https://via.placeholder.com/300x150"
                alt="Thumbnail"
                className="w-full h-32 sm:h-40 object-cover"
              />
              <div className="p-4">
                <Link
                  href={`/article/${article._id}`}
                  className="text-lg sm:text-2xl font-semibold text-gray-800 hover:text-orange-500"
                >
                  {article.title}
                </Link>
                <p className="text-gray-700 mt-3 text-sm sm:text-base line-clamp-2">
                  {article.content.slice(0, 120)}...
                </p>
                <p className="text-xs sm:text-sm text-gray-500 mt-4">
                  By {article.author}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* "See More" Button */}
        {visibleArticles < filteredArticles.length && (
          <div className="flex justify-center mt-8 sm:mt-12">
            <button
              onClick={loadMoreArticles}
              className="px-6 sm:px-8 py-2 sm:py-3 bg-orange-500 text-white rounded-full font-semibold text-sm sm:text-lg shadow-md hover:bg-orange-600 transition"
            >
              See More
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

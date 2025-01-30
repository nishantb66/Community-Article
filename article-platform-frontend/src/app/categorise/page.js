"use client";

import { useState, useEffect } from "react";

export default function Articles() {
  const [articles, setArticles] = useState([]);
  const [classifications, setClassifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [classifyingId, setClassifyingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [summarizingId, setSummarizingId] = useState(null);
  const [summaries, setSummaries] = useState([]);
  const [showWelcomePopup, setShowWelcomePopup] = useState(true);


  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredArticles(articles);
      return;
    }

    const filtered = articles.filter((article) =>
      article.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredArticles(filtered);
  }, [searchQuery, articles]);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch(
          "https://python-backend-psi.vercel.app/api/articles"
        );
        const data = await response.json();
        setArticles(data.articles || []);
      } catch (error) {
        setError("Failed to fetch articles");
        console.error("Error fetching articles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  const classifyArticle = async (articleId) => {
    try {
      setClassifyingId(articleId);
      const response = await fetch(
        `https://python-backend-psi.vercel.app/api/articles/classify_one/${articleId}`
      );
      const data = await response.json();
      setClassifications((prev) => [...prev, data]);
    } catch (error) {
      setError("Failed to classify article");
      console.error("Error classifying article:", error);
    } finally {
      setClassifyingId(null);
    }
  };

  const summarizeArticle = async (articleId) => {
    try {
      setSummarizingId(articleId);
      const response = await fetch(
        `https://python-backend-psi.vercel.app/api/articles/summarize/${articleId}`
      );
      const data = await response.json();
      setSummaries((prev) => [...prev, data]);
    } catch (error) {
      setError("Failed to summarize article");
      console.error("Error summarizing article:", error);
    } finally {
      setSummarizingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-white to-orange-50">
        <div className="relative">
          

        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-800 font-medium text-lg animate-pulse">
            AI is analyzing articles
          </p>
          <p className="text-gray-600 mt-2">This might take a moment...</p>
          <div className="flex gap-1 mt-2 justify-center">
            <span className="w-2 h-2 bg-orange-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
            <span className="w-2 h-2 bg-orange-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
            <span className="w-2 h-2 bg-orange-500 rounded-full animate-bounce"></span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-4 md:p-8">
      {showWelcomePopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 md:p-8 max-w-md w-full shadow-2xl">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-orange-100 rounded-lg">
                <svg
                  className="w-6 h-6 text-orange-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                  />
                </svg>
              </div>
              <button
                onClick={() => setShowWelcomePopup(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>

            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Welcome to AI Article Assistant! ✨
            </h3>

            <p className="text-gray-600 mb-4">
              This AI-powered tool can help you:
            </p>

            <ul className="space-y-2 mb-6">
              <li className="flex items-center text-gray-600">
                <span className="mr-2">🎯</span>
                Automatically categorize articles
              </li>
              <li className="flex items-center text-gray-600">
                <span className="mr-2">📝</span>
                Generate concise summaries
              </li>
              <li className="flex items-center text-gray-600">
                <span className="mr-2">⚡</span>
                Process any article in one click
              </li>
            </ul>

            <button
              onClick={() => setShowWelcomePopup(false)}
              className="w-full bg-orange-500 text-white py-3 rounded-lg font-medium hover:bg-orange-600 transition-colors"
            >
              Got it, thanks!
            </button>
          </div>
        </div>
      )}
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <p className="text-orange-500 text-lg mb-8">
            Automated article categorization ✨
          </p>

          {/* Search Section */}
          <div className="max-w-xl mx-auto mb-12">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles..."
                className="w-full px-6 py-3 rounded-xl border-2 border-gray-100 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200 outline-none shadow-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
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
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Articles Grid */}
        {/* Articles Grid */}
        <div className="space-y-6">
          {filteredArticles.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <p className="text-gray-500">
                No articles found matching your search.
              </p>
            </div>
          ) : (
            filteredArticles.map((article) => (
              <div key={article.id} className="bg-gray-50 rounded-xl p-6">
                <div className="grid lg:grid-cols-7 gap-6 items-center">
                  {/* Article Card */}
                  <div className="lg:col-span-3">
                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-200">
                      <h3 className="font-medium text-gray-800 text-lg mb-4">
                        {article.title}
                      </h3>
                      <div className="flex space-x-4">
                        {/* Classify Button */}
                        <button
                          onClick={() => classifyArticle(article.id)}
                          disabled={classifyingId === article.id}
                          className={`w-full px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                            classifyingId === article.id
                              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                              : "bg-orange-500 text-white hover:bg-orange-600 hover:shadow-md"
                          }`}
                        >
                          {classifyingId === article.id ? (
                            <span className="flex items-center justify-center">
                              <svg
                                className="animate-spin h-4 w-4 mr-2"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                  fill="none"
                                />
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                />
                              </svg>
                              Processing...
                            </span>
                          ) : (
                            "Classify"
                          )}
                        </button>

                        {/* Summarize Button */}
                        <button
                          onClick={() => summarizeArticle(article.id)}
                          disabled={summarizingId === article.id}
                          className={`w-full px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                            summarizingId === article.id
                              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                              : "bg-orange-400 text-white hover:bg-orange-600 hover:shadow-md"
                          }`}
                        >
                          {summarizingId === article.id ? (
                            <span className="flex items-center justify-center">
                              <svg
                                className="animate-spin h-4 w-4 mr-2"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                  fill="none"
                                />
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                />
                              </svg>
                              Summarizing...
                            </span>
                          ) : (
                            "Summarize"
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Arrow Section */}
                  <div className="lg:col-span-1 flex justify-center">
                    <svg
                      className={`w-12 h-12 text-orange-400 transform transition-all duration-500 ${
                        classifyingId === article.id ||
                        summarizingId === article.id
                          ? "translate-x-4 opacity-100"
                          : "opacity-30"
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </div>

                  {/* Classification and Summary Results */}
                  <div className="lg:col-span-3 space-y-4">
                    {classifications.find((c) => c.id === article.id) ? (
                      <div
                        className={`bg-white p-6 rounded-xl border border-gray-100 shadow-lg transition-all duration-500`}
                      >
                        <h3 className="font-medium text-gray-800 text-lg mb-3">
                          Classification Result
                        </h3>
                        <span className="inline-block px-4 py-2 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
                          {classifications
                            .find((c) => c.id === article.id)
                            ?.category.replace(/\*\*/g, "")}
                        </span>
                      </div>
                    ) : (
                      <div className="bg-white p-6 rounded-xl border border-gray-100 text-gray-400 text-center">
                        Waiting for classification...
                      </div>
                    )}

                    {summaries.find((s) => s.id === article.id) ? (
                      <div
                        className={`bg-white p-6 rounded-xl border border-gray-100 shadow-lg transition-all duration-500`}
                      >
                        <h3 className="font-medium text-gray-800 text-lg mb-3">
                          Summary
                        </h3>
                        <p className="text-gray-700">
                          {summaries.find((s) => s.id === article.id)?.summary}
                        </p>
                      </div>
                    ) : (
                      <div className="bg-white p-6 rounded-xl border border-gray-100 text-gray-400 text-center">
                        Waiting for summary...
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}


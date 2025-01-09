"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiBaseUrl } from "../../utils/api";
import Link from "next/link";

export default function MyArticles() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchArticles = async () => {
      let username = "";
      if (typeof window !== "undefined") {
        username = localStorage.getItem("userName");
      }
      if (!username) {
        router.push("/login");
        return;
      }
      try {
        const response = await fetch(
          `${apiBaseUrl}/api/articles/user/${username}`
        );
        if (response.ok) {
          const data = await response.json();
          setArticles(data);
        } else {
          console.error("Failed to fetch articles.");
        }
      } catch (error) {
        console.error("Error fetching articles:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, [router]);

  const handleEdit = (articleId) => {
    router.push(`/edit-article/${articleId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-orange-50 to-pink-50">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xl font-semibold text-orange-600">
            Loading your articles...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50">
      {/* Header Section */}
      <div className="py-8 px-4 sm:px-6 lg:px-8 bg-white/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 text-center">
            My Articles
          </h1>
          <p className="mt-4 text-xl text-gray-600 text-center">
            Manage and edit your published articles
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {articles.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl shadow-xl">
            <svg
              className="mx-auto h-12 w-12 text-orange-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            <h3 className="mt-2 text-xl font-medium text-gray-900">
              No articles yet
            </h3>
            <p className="mt-1 text-gray-500">
              Get started by creating your first article
            </p>
            <div className="mt-6">
              <Link
                href="/create"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full text-white bg-orange-500 hover:bg-orange-600 transition transform hover:scale-105"
              >
                Create New Article
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <div
                key={article._id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden group"
              >
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-orange-500 bg-orange-50 px-3 py-1 rounded-full">
                      {new Date(article.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <h2
                    onClick={() => router.push(`/article/${article._id}`)}
                    className="text-xl font-bold text-gray-900 cursor-pointer group-hover:text-orange-500 transition-colors duration-300"
                  >
                    {article.title}
                  </h2>
                  <div className="flex items-center justify-between pt-4 border-t">
                    <button
                      onClick={() => router.push(`/article/${article._id}`)}
                      className="text-gray-600 hover:text-orange-500 transition-colors duration-300"
                    >
                      View Article
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(article._id);
                      }}
                      className="inline-flex items-center px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-full transition-colors duration-300"
                    >
                      Edit Article
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

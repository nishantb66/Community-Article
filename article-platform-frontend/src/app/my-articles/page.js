"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiBaseUrl } from "../../utils/api";

export default function MyArticles() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchArticles = async () => {
      let username = "";

      if (typeof window !== "undefined") {
        username = localStorage.getItem("userName"); // Fetch username from localStorage
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-orange-100 to-pink-100">
        <p className="text-xl font-semibold text-gray-500 animate-pulse">
          Loading your articles...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 to-pink-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl p-6 sm:p-8">
        <h1 className="text-3xl font-extrabold text-gray-800 text-center mb-6">
          My Articles
        </h1>
        {articles.length === 0 ? (
          <p className="text-gray-500 text-center">
            You have not written any articles yet.
          </p>
        ) : (
          <ul className="space-y-4">
            {articles.map((article) => (
              <li
                key={article._id}
                onClick={() => router.push(`/article/${article._id}`)}
                className="group flex items-center justify-between p-4 bg-gray-100 rounded-lg shadow-md hover:bg-gray-200 transition transform hover:scale-105 cursor-pointer"
              >
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 group-hover:text-orange-500">
                    {article.title}
                  </h2>
                  <p className="text-sm text-gray-600">
                    {new Date(article.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-gray-400 group-hover:text-orange-400 transition"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

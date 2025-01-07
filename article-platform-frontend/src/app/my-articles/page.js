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

      // Ensure `localStorage` access only in the browser
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
    return <p className="text-center mt-10">Loading your articles...</p>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 to-pink-100 py-10">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">My Articles</h1>
        {articles.length === 0 ? (
          <p className="text-gray-600">
            You have not written any articles yet.
          </p>
        ) : (
          <ul className="space-y-4">
            {articles.map((article) => (
              <li
                key={article._id}
                onClick={() => router.push(`/article/${article._id}`)}
                className="p-4 bg-gray-100 rounded-lg shadow cursor-pointer hover:bg-gray-200"
              >
                <h2 className="text-lg font-bold text-gray-800">
                  {article.title}
                </h2>
                <p className="text-sm text-gray-600">
                  {new Date(article.createdAt).toLocaleDateString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

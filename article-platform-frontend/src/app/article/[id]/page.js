"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation"; // Correct way to access params
import {
  FacebookShareButton,
  LinkedinShareButton,
  TwitterShareButton,
  FacebookIcon,
  LinkedinIcon,
  TwitterIcon,
} from "react-share";
import "../../../styles/globals.css";

export default function ArticlePage() {
  const [article, setArticle] = useState(null);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [scrollProgress, setScrollProgress] = useState(0);
  const { id } = useParams(); // Retrieve the `id` directly using `useParams`

  useEffect(() => {
    async function fetchArticle() {
      try {
        const res = await fetch(`https://community-article-backend.onrender.com/api/articles/${id}`); // Replace with your backend URL
        if (!res.ok) {
          throw new Error("Failed to fetch the article");
        }
        const data = await res.json();
        setArticle(data);
        fetchRelatedArticles(data.title); // Fetch related articles based on the title
      } catch (err) {
        console.error("Error fetching article:", err);
      }
    }

    if (id) {
      fetchArticle();
    }
  }, [id]);

  async function fetchRelatedArticles(currentTitle) {
    try {
      const res = await fetch("https://community-article-backend.onrender.com/api/articles"); // Fetch all articles
      if (!res.ok) {
        throw new Error("Failed to fetch related articles");
      }
      const data = await res.json();

      const currentTitleWords = currentTitle.toLowerCase().split(" ");
      const related = data.filter((article) => {
        if (article._id === id) return false; // Exclude the current article

        const articleTitleWords = article.title.toLowerCase().split(" ");
        // Check if there's any overlap of words between the titles
        return currentTitleWords.some((word) =>
          articleTitleWords.includes(word)
        );
      });

      setRelatedArticles(related);
    } catch (err) {
      console.error("Error fetching related articles:", err);
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.body.scrollHeight - window.innerHeight;
      const scrollPercentage = (scrollTop / docHeight) * 100;
      setScrollProgress(scrollPercentage);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!article) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p className="text-lg font-semibold text-gray-500">
          Loading article...
        </p>
      </div>
    );
  }

  const shareUrl = `https://community-article-frontend.vercel.app/article/${id}`; // Replace with your deployed URL

  return (
    <div className="min-h-screen bg-white">
      {/* Reading Progress Bar */}
      <div
        className="fixed top-0 left-0 h-2 bg-orange-500 transition-all"
        style={{ width: `${scrollProgress}%` }}
      ></div>

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

        {/* Social Media Share Buttons */}
        <div className="mt-10">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Share this article:
          </h2>
          <div className="flex gap-4">
            <TwitterShareButton url={shareUrl} title={article.title}>
              <TwitterIcon size={40} round />
            </TwitterShareButton>
            <FacebookShareButton url={shareUrl} quote={article.title}>
              <FacebookIcon size={40} round />
            </FacebookShareButton>
            <LinkedinShareButton url={shareUrl} title={article.title}>
              <LinkedinIcon size={40} round />
            </LinkedinShareButton>
          </div>
        </div>
      </main>

      {/* Related Articles */}
      <section className="max-w-4xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Related Articles
        </h2>
        {relatedArticles.length > 0 ? (
          <ul className="space-y-4">
            {relatedArticles.map((relatedArticle) => (
              <li key={relatedArticle._id}>
                <a
                  href={`/article/${relatedArticle._id}`}
                  className="text-lg font-semibold text-orange-500 hover:underline"
                >
                  {relatedArticle.title}
                </a>
                <p className="text-sm text-gray-500">
                  By {relatedArticle.author} -{" "}
                  {new Date(relatedArticle.createdAt).toDateString()}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-lg">No related articles found.</p>
        )}
      </section>
    </div>
  );
}

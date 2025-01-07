"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
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
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isReportPopupOpen, setIsReportPopupOpen] = useState(false);
  const [isConfirmationPopupOpen, setIsConfirmationPopupOpen] = useState(false);
  const [isReported, setIsReported] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [isCommentSliderOpen, setIsCommentSliderOpen] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    async function fetchArticle() {
      try {
        const res = await fetch(`https://community-article-backend.onrender.com/api/articles/${id}`);
        if (!res.ok) {
          throw new Error("Failed to fetch the article");
        }
        const data = await res.json();
        setArticle(data);
        fetchRelatedArticles(data.title);
        fetchComments();
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
      const res = await fetch("https://community-article-backend.onrender.com/api/articles");
      if (!res.ok) {
        throw new Error("Failed to fetch related articles");
      }
      const data = await res.json();

      // Ensure data is an array before processing
      // const currentTitleWords = currentTitle.toLower;
      const currentTitleWords = currentTitle.toLowerCase().split(" ");
      const related = Array.isArray(data)
        ? data.filter((article) => {
            if (article._id === id) return false;
            const articleTitleWords = article.title.toLowerCase().split(" ");
            return currentTitleWords.some((word) =>
              articleTitleWords.includes(word)
            );
          })
        : []; // If data is not an array, fallback to an empty array

      setRelatedArticles(related);
    } catch (err) {
      console.error("Error fetching related articles:", err);
    }
  }

  async function fetchComments() {
    try {
      const res = await fetch(
        `https://community-article-backend.onrender.com/api/articles/${id}/comments`
      );
      if (!res.ok) {
        throw new Error("Failed to fetch comments");
      }
      const data = await res.json();
      setComments(data);
    } catch (err) {
      console.error("Error fetching comments:", err);
    }
  }

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    if (!newComment.trim()) {
      alert("Comment cannot be empty!");
      return;
    }

    try {
      const res = await fetch(
        `https://community-article-backend.onrender.com/api/articles/${id}/comments`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: newComment }),
        }
      );

      if (res.ok) {
        setNewComment("");
        fetchComments();
      } else {
        alert("Failed to post comment.");
      }
    } catch (err) {
      console.error("Error posting comment:", err);
      alert("An error occurred. Please try again.");
    }
  };

  const handleReportArticle = async () => {
    try {
      const res = await fetch(
        `https://community-article-backend.onrender.com/api/articles/${id}/report`,
        {
          method: "POST",
        }
      );

      if (res.ok) {
        setIsReported(true);
        setIsConfirmationPopupOpen(false);
        setIsReportPopupOpen(false);
        alert("Reported! Article is under review.");
      } else {
        alert("Failed to report article. Please try again.");
      }
    } catch (err) {
      console.error("Error reporting article:", err);
      alert("An error occurred. Please try again.");
    }
  };

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

  const shareUrl = `https://simplearticles.space/article/${id}`;
  

  return (
    <div
      className={`min-h-screen ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      {/* Reading Progress Bar */}
      <div
        className={`fixed top-0 left-0 h-2 ${
          darkMode ? "bg-teal-500" : "bg-orange-500"
        } transition-all`}
        style={{ width: `${scrollProgress}%` }}
      ></div>

      {/* Header */}
      <div
        className={`py-10 ${
          darkMode
            ? "bg-gradient-to-r from-gray-800 to-gray-700"
            : "bg-gradient-to-r from-orange-200 to-orange-100"
        }`}
      >
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-4xl font-extrabold">{article.title}</h1>
          <div className="mt-4 flex items-center">
            <div className="w-12 h-12 rounded-full bg-gray-300 overflow-hidden">
              <img
                src="https://via.placeholder.com/100"
                alt="Author"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="ml-4">
              <p className="text-lg font-semibold">{article.author}</p>
              <p className="text-sm">
                {new Date(article.createdAt).toDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={() => setDarkMode(!darkMode)}
        className={`fixed px-2 py-1 rounded-md font-semibold shadow-md ${
          darkMode
            ? "bg-gray-700 text-white hover:bg-gray-600"
            : "bg-gray-300 text-gray-900 hover:bg-gray-400"
        }`}
      >
        {darkMode ? "Light Mode" : "Dark Mode"}
      </button>

      {/* Article Content */}
      <main className="max-w-4xl mx-auto px-6 py-12 text-2xl">
        <div
          className={`prose prose-lg ${
            darkMode ? "prose-invert" : "prose-gray"
          } whitespace-pre-line leading-relaxed`}
        >
          <div dangerouslySetInnerHTML={{ __html: article.content }}></div>
        </div>

        {/* Social Media Share Buttons */}
        <div className="mt-10 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold mb-4">Share this article:</h2>
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

          {/* Report Button */}
          <button
            onClick={() => setIsReportPopupOpen(true)}
            className="text-sm text-red-500 font-semibold hover:underline"
          >
            Report
          </button>
        </div>
      </main>

      {/* Report Popup */}
      {isReportPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg shadow-lg p-6 max-w-sm w-full">
            <h2 className="text-lg font-bold mb-4">Report Article</h2>
            <p className="text-sm mb-4">
              If you find this article disturbing, vulgar, or violating the
              <a
                href="/guidelines"
                className="text-blue-500 hover:underline mx-1"
                target="_blank"
                rel="noopener noreferrer"
              >
                simpleArticle regulations
              </a>
              , please click "Report" below. We will review the article.
            </p>
            <div className="flex justify-between items-center gap-4">
              <button
                onClick={() => setIsConfirmationPopupOpen(true)}
                className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-600 transition"
              >
                Report
              </button>
              <button
                onClick={() => setIsReportPopupOpen(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-400 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Popup */}
      {isConfirmationPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg shadow-lg p-6 max-w-sm w-full">
            <h2 className="text-lg font-bold mb-4">Confirm Report</h2>
            <p className="text-sm mb-4">
              Are you sure you want to report this article? This action cannot
              be undone.
            </p>
            <div className="flex justify-between items-center gap-4">
              <button
                onClick={handleReportArticle}
                className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-600 transition"
              >
                Yes, Report
              </button>
              <button
                onClick={() => setIsConfirmationPopupOpen(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-400 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Comments Slider */}
      <div>
        <button
          onClick={() => setIsCommentSliderOpen(true)}
          className="fixed bottom-5 right-5 bg-orange-500 text-white px-4 py-3 rounded-full shadow-lg hover:bg-orange-600 transition"
        >
          Responses
        </button>

        <div
          className={`fixed top-0 right-0 h-full bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ${
            isCommentSliderOpen ? "translate-x-0" : "translate-x-full"
          }`}
          style={{ width: "100%", maxWidth: "400px" }}
        >
          <div className="p-6 relative flex flex-col h-full">
            {/* Cross Button */}
            <button
              onClick={() => setIsCommentSliderOpen(false)}
              className="absolute top-4 right-4 text-red-500 hover:text-red-700 text-2xl font-bold"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white text-center">
              Comments
            </h2>
            <form onSubmit={handleCommentSubmit} className="mb-6">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className={`w-full px-4 py-2 border ${
                  darkMode
                    ? "border-gray-600 bg-gray-700 text-white"
                    : "border-gray-300 bg-gray-100 text-gray-900"
                } rounded-lg focus:ring-2 focus:ring-orange-400 focus:outline-none resize-none`}
                rows="4"
                placeholder="Leave a comment..."
              ></textarea>
              <button
                type="submit"
                className="mt-4 w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition"
              >
                Submit Comment
              </button>
            </form>
            <div className="flex-1 overflow-y-auto">
              {comments.length > 0 ? (
                <ul className="space-y-4">
                  {comments.map((comment) => (
                    <li key={comment._id} className="border-b pb-4">
                      <p className="text-gray-900 dark:text-white">
                        {comment.content}
                      </p>
                      <p className="text-sm mt-2 text-gray-600 dark:text-gray-400">
                        {new Date(comment.createdAt).toLocaleString()}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-900 dark:text-gray-400 text-center">
                  No comments yet. Be the first to comment!
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



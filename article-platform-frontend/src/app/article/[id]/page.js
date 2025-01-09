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

const handleReportArticle = async (reason) => {
  try {
    const res = await fetch(`http://localhost:5000/api/articles/${id}/report`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reason }),
    });

    if (res.ok) {
      setIsReported(true);
      setIsConfirmationPopupOpen(false);
      setIsReportPopupOpen(false);
      alert("Reported! Article is under review.");
    } else {
      const data = await res.json();
      alert(data.message || "Failed to report article. Please try again.");
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

          {/* New Request Link */}
          <div className="mt-6">
            <a
              href="https://tripetto.app/run/NOTBEYJ8UX"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline text-sm font-medium"
            >
              Put a request regarding this article
            </a>
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

            {/* Report Initial Modal */}
      {isReportPopupOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-xl max-w-md w-full p-6 transform transition-all duration-300 scale-100 animate-slideUp">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Report Article
              </h2>
              <button
                onClick={() => setIsReportPopupOpen(false)}
                className="text-gray-400 hover:text-gray-500 transition-colors"
              >
                <svg
                  className="w-6 h-6"
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
            </div>

            <div className="mb-6">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Help us maintain a safe and respectful environment. If this
                article violates our
                <a
                  href="/guidelines"
                  className="text-orange-500 hover:text-orange-600 mx-1 font-medium"
                >
                  community guidelines
                </a>
                , please let us know.
              </p>
            </div>

            <div className="space-y-4">
              <select
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm focus:ring-2 focus:ring-orange-500 outline-none transition-all text-white"
                defaultValue=""
              >
                <option value="" disabled>
                  Select a reason
                </option>
                <option value="inappropriate">Inappropriate Content</option>
                <option value="spam">Spam or Misleading</option>
                <option value="copyright">Copyright Violation</option>
                <option value="harassment">Harassment</option>
                <option value="other">Other</option>
              </select>

              <button
                onClick={() => {
                  setIsReportPopupOpen(false);
                  setIsConfirmationPopupOpen(true);
                }}
                className="w-full px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Report Confirmation Modal */}
      {isConfirmationPopupOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-xl max-w-md w-full p-6 transform transition-all duration-300 scale-100 animate-slideUp">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Provide Details
              </h2>
              <button
                onClick={() => setIsConfirmationPopupOpen(false)}
                className="text-gray-400 hover:text-gray-500 transition-colors"
              >
                <svg
                  className="w-6 h-6"
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
            </div>

            <div className="space-y-4">
              <textarea
                placeholder="Please provide specific details about your report..."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm focus:ring-2 focus:ring-orange-500 outline-none transition-all resize-none text-gray-800 dark:text-white"
                rows="4"
                maxLength="500"
                onChange={(e) => setNewComment(e.target.value)}
              ></textarea>
              <div className="text-right text-sm text-gray-500">
                {newComment.length}/500 characters
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => handleReportArticle(newComment)}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Submit Report
                </button>
                <button
                  onClick={() => setIsConfirmationPopupOpen(false)}
                  className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300"
                >
                  Cancel
                </button>
              </div>
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
              {/* Footer Section */}
      <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-10 mt-12">
        <div className="container mx-auto px-6 md:px-10 lg:px-16">
          {/* Top Section */}
          <div className="flex flex-col lg:flex-row justify-between items-center border-b border-gray-700 pb-6">
            <div className="text-center lg:text-left mb-6 lg:mb-0">
              <h2 className="text-2xl font-extrabold">simpleArticle</h2>
              <p className="mt-2 text-sm text-gray-400">
                Building a better future, one article at a time.
              </p>
            </div>
            <div className="flex space-x-6">
              <a
                href="mailto:nishantbarua3@gmail.com"
                className="text-orange-400 hover:text-orange-500 transition duration-300 text-sm"
              >
                Email
              </a>
              <a
                href="https://www.linkedin.com/in/nishantbaru/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-400 hover:text-orange-500 transition duration-300 text-sm"
              >
                LinkedIn
              </a>
              <a
                href="https://nishantb66.github.io/MyPortfolio/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-400 hover:text-orange-500 transition duration-300 text-sm"
              >
                Portfolio
              </a>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="flex flex-col md:flex-row justify-between items-center mt-6">
            <p className="text-xs text-gray-500 text-center md:text-left">
              © {new Date().getFullYear()} Nishant Baruah. All rights reserved.
            </p>
            <p className="text-xs text-gray-500 text-center md:text-right mt-4 md:mt-0">
              Developed and Designed by Nishant Baruah.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}



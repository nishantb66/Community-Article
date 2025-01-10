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
import { motion } from "framer-motion";


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

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setDarkMode(!darkMode)}
        className={`fixed top-6 right-6 z-50 px-4 py-2 rounded-full font-medium backdrop-blur-sm shadow-lg transition-all duration-300 ${
          darkMode
            ? "bg-gray-800/80 text-white hover:bg-gray-700/80 hover:shadow-gray-700/25"
            : "bg-white/80 text-gray-900 hover:bg-white/90 hover:shadow-orange-500/25"
        }`}
      >
        <div className="flex items-center gap-2">
          {darkMode ? (
            <>
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
              <span>Light</span>
            </>
          ) : (
            <>
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                />
              </svg>
              <span>Dark</span>
            </>
          )}
        </div>
      </motion.button>


      {/* Article Content */}
      <main className="relative max-w-4xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`backdrop-blur-sm ${
            darkMode ? "bg-gray-900/50" : "bg-white/50"
          } rounded-2xl shadow-xl p-6 md:p-8 mb-8`}
        >
          <div
            className={`prose prose-lg max-w-none text-2xl ${
              darkMode ? "prose-invert" : "prose-gray"
            } whitespace-pre-line leading-relaxed`}
          >
            <div dangerouslySetInnerHTML={{ __html: article.content }}></div>
          </div>
        </motion.div>

        {/* Share and Actions Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 p-3 ${
            darkMode ? "bg-gray-800/90" : "bg-white/90"
          } backdrop-blur-md rounded-full shadow-lg z-40`}
        >
          <div className="flex items-center gap-2">
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="flex gap-2"
            >
              <TwitterShareButton url={shareUrl} title={article.title}>
                <div
                  className={`p-2 rounded-full transition-all ${
                    darkMode ? "hover:bg-gray-700/50" : "hover:bg-gray-100/50"
                  }`}
                >
                  <TwitterIcon size={32} round />
                </div>
              </TwitterShareButton>

              <FacebookShareButton url={shareUrl} quote={article.title}>
                <div
                  className={`p-2 rounded-full transition-all ${
                    darkMode ? "hover:bg-gray-700/50" : "hover:bg-gray-100/50"
                  }`}
                >
                  <FacebookIcon size={32} round />
                </div>
              </FacebookShareButton>

              <LinkedinShareButton url={shareUrl} title={article.title}>
                <div
                  className={`p-2 rounded-full transition-all ${
                    darkMode ? "hover:bg-gray-700/50" : "hover:bg-gray-100/50"
                  }`}
                >
                  <LinkedinIcon size={32} round />
                </div>
              </LinkedinShareButton>
            </motion.div>

            <div
              className={`w-px h-6 ${darkMode ? "bg-gray-700" : "bg-gray-200"}`}
            ></div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsReportPopupOpen(true)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
                darkMode
                  ? "bg-red-500/10 text-red-400 hover:bg-red-500/20"
                  : "bg-red-50 text-red-500 hover:bg-red-100"
              } transition-all`}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <span>Report</span>
            </motion.button>
          </div>
        </motion.div>
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


      {/* Comments System */}
      <div>
        {/* Floating Action Button */}
        <button
          onClick={() => setIsCommentSliderOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-full shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105 sm:hover:-translate-y-1"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <span className="font-medium">Responses</span>
        </button>
      
        {/* Comments Drawer */}
        <div
          className={`fixed inset-y-0 right-0 w-full sm:max-w-md bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-2xl transform transition-transform duration-300 ease-in-out z-50 ${
            isCommentSliderOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
              <h2 className="text-xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
                Responses ({comments.length})
              </h2>
              <button
                onClick={() => setIsCommentSliderOpen(false)}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
      
            {/* Comment Form */}
            <div className="p-4 border-b dark:border-gray-700">
              <form onSubmit={handleCommentSubmit} className="space-y-4">
                <div className="relative">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    maxLength="500"
                    rows="4"
                    placeholder="Share your thoughts..."
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none resize-none text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                  />
                  <div className="absolute bottom-2 right-2 text-xs text-gray-400">
                    {newComment.length}/500
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
                >
                  Post Response
                </button>
              </form>
            </div>
      
            {/* Comments List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {comments.length > 0 ? (
                comments.map((comment) => (
                  <div
                    key={comment._id}
                    className="p-4 bg-white dark:bg-gray-700/50 rounded-xl shadow-sm"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-400 to-pink-400 flex items-center justify-center text-white font-medium text-sm">
                        {comment.author?.charAt(0) || 'A'}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {comment.author || 'Anonymous'}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(comment.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                    <p className="text-gray-800 dark:text-gray-200">{comment.content}</p>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 dark:text-gray-400">
                  <svg className="w-16 h-16 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <p className="font-medium">No responses yet</p>
                  <p className="text-sm">Be the first to share your thoughts!</p>
                </div>
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



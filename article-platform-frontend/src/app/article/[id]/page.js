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
import {
  ClipboardIcon,
  ClipboardCheckIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";


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
  const [isCopied, setIsCopied] = useState(false);

    const copyArticleText = () => {
    if (!article) return;

    // Create temporary element
    const tempElement = document.createElement("div");
    tempElement.innerHTML = article.content;

    // Get text content only
    const textContent = tempElement.textContent || tempElement.innerText;

    // Copy to clipboard
    navigator.clipboard.writeText(textContent).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  useEffect(() => {
    async function fetchArticle() {
      try {
        const res = await fetch(`https://community-article-backend.onrender.com/api/articles/${id}`);
        if (!res.ok) {
          throw new Error("Failed to fetch the article");
        }
        const data = await res.json();
        setArticle(data);
        fetchComments();
      } catch (err) {
        console.error("Error fetching article:", err);
      }
    }

    if (id) {
      fetchArticle();
    }
  }, [id]);


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
        className={`fixed top-0 left-0 h-1.5 z-50 shadow-sm ${
          darkMode
            ? "bg-teal-500"
            : "bg-gradient-to-r from-orange-500 to-pink-500"
        } transition-all duration-300`}
        style={{ width: `${scrollProgress}%` }}
      ></div>

      {/* Enhanced Header */}
        <header className={`relative overflow-hidden ${
          darkMode 
            ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" 
            : "bg-gradient-to-br from-orange-50 via-orange-100 to-orange-50"
        }`}>
          {/* Decorative Background Elements */}
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/5"></div>
        
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative max-w-4xl mx-auto px-4 sm:px-6 py-12 md:py-16"
          >
            {/* Article Title */}
            <h1 className={`text-3xl md:text-4xl lg:text-5xl font-black tracking-tight mb-8 ${
              darkMode ? "text-white" : "text-gray-900"
            }`}>
              {article.title}
            </h1>
        
            {/* Author Info Section */}
            <div className="flex flex-wrap items-center gap-6 mb-8">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className={`w-14 h-14 rounded-full overflow-hidden ring-2 ${
                    darkMode ? "ring-white/20" : "ring-black/5"
                  } shadow-lg`}>
                    <img
                      src={article.authorImage || "https://via.placeholder.com/100"}
                      alt={article.author}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                
                <div>
                  <h2 className={`text-lg font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
                    {article.author}
                  </h2>
                  <div className="flex items-center space-x-1.5 text-gray-500 hover:text-gray-700 transition-colors">
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
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth="2" 
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                      <span className="text-sm">{article.viewed}</span>
                  </div>
                  <div className={`flex items-center gap-2 text-sm ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  }`}>
                    <time>{new Date(article.createdAt).toDateString()}</time>
                    <span>•</span>
                    <span>{article.readTime || '5 min read'}</span>
                  </div>
                </div>
              </div>
        
              {/* Request Button */}
              <motion.a
                href="https://tripetto.app/run/NOTBEYJ8UX"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`ml-auto px-5 py-2.5 rounded-full font-medium shadow-lg backdrop-blur-sm transition-all duration-300 ${
                  darkMode 
                    ? "bg-white/10 text-white hover:bg-white/20" 
                    : "bg-black/5 text-gray-900 hover:bg-black/10"
                }`}
              >
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                      d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" 
                    />
                  </svg>
                  <span>Submit Request</span>
                </div>
              </motion.a>
            </div>
          </motion.div>
        </header>

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
        <main className="relative max-w-4xl mx-auto px-4 md:px-6 py-6 md:py-8">
          <div className={`${
            darkMode 
              ? 'bg-gray-800 border-gray-700' 
              : 'bg-white border-gray-100'
          } rounded-xl shadow-sm border p-5 md:p-7 mb-8 transition-colors duration-200`}>
            <div className={`prose ${
              darkMode 
                ? 'prose-invert' 
                : 'prose-gray'
            } prose-lg max-w-none text-2xl whitespace-pre-line leading-relaxed`}>
              <div dangerouslySetInnerHTML={{ __html: article.content }}></div>
            </div>
          </div>
        
          {/* Share and Actions Section - Optimized for Mobile */}
          <div className={`fixed bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 p-2.5 ${
            darkMode 
              ? 'bg-gray-800/95 border-gray-700' 
              : 'bg-white/95 border-gray-100'
          } rounded-full shadow border z-40`}>
            <div className="flex items-center gap-1.5">
              <div className="flex gap-1.5">
                <TwitterShareButton url={shareUrl} title={article.title}>
                  <div className={`p-2 rounded-full ${
                    darkMode 
                      ? 'hover:bg-gray-700' 
                      : 'hover:bg-gray-50'
                  } transition-colors`}>
                    <TwitterIcon size={28} round />
                  </div>
                </TwitterShareButton>
        
                <FacebookShareButton url={shareUrl} quote={article.title}>
                  <div className={`p-2 rounded-full ${
                    darkMode 
                      ? 'hover:bg-gray-700' 
                      : 'hover:bg-gray-50'
                  } transition-colors`}>
                    <FacebookIcon size={28} round />
                  </div>
                </FacebookShareButton>
        
                <LinkedinShareButton url={shareUrl} title={article.title}>
                  <div className={`p-2 rounded-full ${
                    darkMode 
                      ? 'hover:bg-gray-700' 
                      : 'hover:bg-gray-50'
                  } transition-colors`}>
                    <LinkedinIcon size={28} round />
                  </div>
                </LinkedinShareButton>
              </div>
        
              <div className={`w-px h-5 ${
                darkMode ? 'bg-gray-700' : 'bg-gray-200'
              } mx-1`}></div>
        
              <button
                onClick={() => setIsReportPopupOpen(true)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${
                  darkMode 
                    ? 'bg-red-900/20 text-red-400 hover:bg-red-900/30' 
                    : 'bg-red-50 text-red-500 hover:bg-red-100'
                } transition-colors`}
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span className="hidden sm:inline">Report</span>
              </button>
              <button
                onClick={copyArticleText}
                className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-900 dark:text-gray-200 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
                aria-label="Copy article text"
              >
                {isCopied ? (
                  <>
                    <CheckIcon className="w-5 h-5 mr-1.5 text-green-600 dark:text-green-400" />
                    <span className="text-green-600 dark:text-green-400">
                      Copied!
                    </span>
                  </>
                ) : (
                  <>
                    <ClipboardIcon className="w-5 h-5 mr-1.5 text-orange-600" />
                    <span className="text-orange-600">Copy Text</span>
                  </>
                )}
              </button>
            </div>
          </div>
        
          {/* Back to Top Button - Lightweight Version */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className={`fixed bottom-20 right-4 p-2 ${
              darkMode 
                ? 'bg-gray-800/95 border-gray-700 text-gray-400 hover:bg-gray-700' 
                : 'bg-white/95 border-gray-100 text-gray-600 hover:bg-gray-50'
            } rounded-full shadow-sm border transition-colors`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </button>
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
          className="fixed bottom-24 sm:bottom-6 left-1/2 sm:left-auto sm:right-6 -translate-x-1/2 sm:translate-x-0 flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
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
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
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

      <footer className="relative mt-20">
        {/* Background with mesh gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gray-900 via-gray-800 to-black"></div>
        
        <div className="relative">
          {/* Top Wave Separator */}
          <svg className="fill-current text-white dark:text-gray-900" viewBox="0 0 1440 48">
            <path d="M0 48h1440V0c-624 52-816 0-1440 0v48z"></path>
          </svg>
      
          <div className="container mx-auto px-6 py-12 backdrop-blur-sm bg-black/20">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-12">
              {/* Brand Section */}
              <div className="space-y-4">
                <motion.h2 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-3xl font-black bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent"
                >
                  simpleArticle
                </motion.h2>
                <p className="text-gray-400 max-w-sm">
                  Building a better future, one article at a time. Join our community of knowledge seekers.
                </p>
              </div>
      
              {/* Quick Links */}
              <div className="space-y-4">
                <h3 className="text-white font-semibold text-lg">Quick Links</h3>
                <div className="grid grid-cols-2 gap-4">
                  <motion.a
                    whileHover={{ x: 5 }}
                    href="mailto:nishantbarua3@gmail.com"
                    className="flex items-center text-gray-400 hover:text-orange-400 transition-colors duration-300"
                  >
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                    </svg>
                    Email
                  </motion.a>
                  <motion.a
                    whileHover={{ x: 5 }}
                    href="https://www.linkedin.com/in/nishantbaru/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-gray-400 hover:text-orange-400 transition-colors duration-300"
                  >
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z"></path>
                    </svg>
                    LinkedIn
                  </motion.a>
                  <motion.a
                    whileHover={{ x: 5 }}
                    href="https://nishantb66.github.io/MyPortfolio/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-gray-400 hover:text-orange-400 transition-colors duration-300"
                  >
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM14 11a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1h-1a1 1 0 110-2h1v-1a1 1 0 011-1z"></path>
                    </svg>
                    Portfolio
                  </motion.a>
                </div>
              </div>
      
              {/* Contact/Social */}
              <div className="space-y-4">
                <h3 className="text-white font-semibold text-lg">Stay Connected</h3>
                <div className="flex space-x-4">
                  <motion.a
                    whileHover={{ y: -5 }}
                    href="https://x.com/Nishant03129296"
                    className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-orange-400 hover:bg-gray-700 hover:text-orange-300 transition-colors duration-300"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
                    </svg>
                  </motion.a>
                  <motion.a
                    whileHover={{ y: -5 }}
                    href="https://github.com/nishantb66"
                    className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-orange-400 hover:bg-gray-700 hover:text-orange-300 transition-colors duration-300"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0C5.373 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.6.113.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"></path>
                    </svg>
                  </motion.a>
                </div>
              </div>
            </div>
      
            {/* Bottom Section with Copyright */}
            <div className="pt-8 mt-8 border-t border-gray-800/50">
              <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                <p className="text-gray-400 text-sm">
                  © {new Date().getFullYear()} Nishant Baruah. All rights reserved.
                </p>
                <div className="flex items-center space-x-4 text-sm text-gray-400">
                  <motion.span whileHover={{ color: '#f97316' }} className="cursor-pointer">Privacy Policy</motion.span>
                  <span className="text-gray-700">•</span>
                  <motion.span whileHover={{ color: '#f97316' }} className="cursor-pointer">Terms of Service</motion.span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}



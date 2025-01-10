"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import "../styles/globals.css";
import { useRouter } from "next/navigation";


export default function Home() {
  const router = useRouter(); // Initialize the router
  const [articles, setArticles] = useState([]);
  const [page, setPage] = useState(1); // Current page number
  const [totalPages, setTotalPages] = useState(0); // Total pages from API
  const [visibleArticles, setVisibleArticles] = useState(3);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isCollaboratePopupOpen, setIsCollaboratePopupOpen] = useState(false);

  // Collaborate Form States
  const [collaborateName, setCollaborateName] = useState("");
  const [collaborateEmail, setCollaborateEmail] = useState("");
  const [collaborateReason, setCollaborateReason] = useState("");
  const [collaborateMessage, setCollaborateMessage] = useState("");

  const [user, setUser] = useState(null); // State to track logged-in user
  const [dropdownOpen, setDropdownOpen] = useState(false); // State for dropdown
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false); // State for mobile menu
  const [notification, setNotification] = useState(""); // State for notifications
  const [popupMessage, setPopupMessage] = useState("");
  const [notificationType, setNotificationType] = useState(""); // Success or Error
  const [clickedArticleId, setClickedArticleId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showWelcomePopup, setShowWelcomePopup] = useState(false);


    useEffect(() => {
    // Clear localStorage for testing
    localStorage.removeItem("hasVisited");

    const hasVisited = localStorage.getItem("hasVisited");
    console.log("Has visited:", hasVisited); // Debug log

    if (!hasVisited && !user) {
      console.log("Showing popup"); // Debug log
      setShowWelcomePopup(true);
      localStorage.setItem("hasVisited", "true");

      return () => clearTimeout(timer);
    }
  }, [user]);

  useEffect(() => {
    // Fetch user data from localStorage on load
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      const userName = localStorage.getItem("userName");

      if (token && userName) {
        setUser({ name: userName });
      }
    }
  }, []);

  const handleLogout = () => {
    // Clear user session
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("userName");
    }
    setUser(null);
    setDropdownOpen(false);

    // Set logout notification
    setNotification("You have been logged out.");
    setNotificationType("error");

    // Clear the notification after 2 seconds
    setTimeout(() => setNotification(""), 2000);
  };


  // Fetch articles with pagination
  const fetchArticles = async (currentPage) => {
    setLoading(true); // Show loader
    try {
      const response = await fetch(
        `https://community-article-backend.onrender.com/api/articles?page=${currentPage}&limit=6`
      );
      const data = await response.json();

      // Ensure articles are unique
      setArticles((prevArticles) => {
        const existingIds = new Set(prevArticles.map((article) => article._id));
        const newArticles = data.articles.filter(
          (article) => !existingIds.has(article._id)
        );
        return [...prevArticles, ...newArticles];
      });

      setTotalPages(data.totalPages);
      setFilteredArticles(data); // Initially, all articles are shown
    } catch (error) {
      console.error("Error fetching articles:", error);
    } finally {
      setLoading(false); // Hide loader
    }
  };

  // Trigger fetch when page changes
  useEffect(() => {
    fetchArticles(page);
  }, [page]);

  // Load more articles
  const loadMoreArticles = () => {
    if (page < totalPages) {
      setPage((prevPage) => prevPage + 1); // Increment page number
    }
  };

  // Handle search
  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setFilteredArticles(articles); // Reset to all articles if search query is empty
    } else {
      const filtered = articles.filter((article) =>
        article.title.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredArticles(filtered);
    }
  };

  // Handle subscription
  const handleSubscribe = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!email.trim()) {
      setMessage("Email is required.");
      return;
    }

    try {
      const response = await fetch("https://community-article-backend.onrender.com/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setMessage("Subscription successful! 🎉");
        setEmail("");
      } else {
        setMessage("Failed to subscribe. Please try again.");
      }
    } catch (err) {
      console.error("Error subscribing:", err);
      setMessage("An error occurred. Please try again.");
    }
  };

  // Handle Collaborate Form Submission
  const handleCollaborateSubmit = async (e) => {
    e.preventDefault();

    if (!collaborateName || !collaborateEmail || !collaborateReason) {
      setCollaborateMessage("All fields are required.");
      return;
    }

    const formData = {
      name: collaborateName,
      email: collaborateEmail,
      reason: collaborateReason,
    };

    try {
      const response = await fetch("https://community-article-backend.onrender.com/api/contributors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setCollaborateMessage(
          "Thanks for joining us 😊, we will get back to you soon!"
        );
        setCollaborateName("");
        setCollaborateEmail("");
        setCollaborateReason("");
        setTimeout(() => {
          setCollaborateMessage("");
          setIsCollaboratePopupOpen(false);
        }, 3000);
      } else {
        setCollaborateMessage("Failed to submit. Please try again.");
      }
    } catch (err) {
      console.error("Error submitting collaboration:", err);
      setCollaborateMessage("An error occurred. Please try again.");
    }
  };

  const handleBookmark = async (articleId) => {
    let userId = null;
    if (typeof window !== "undefined") {
      userId = localStorage.getItem("userId"); // Ensure userId is fetched correctly
    }

    if (!userId) {
      // Set notification for login requirement
      setNotification("Please login to bookmark articles.");
      setNotificationType("error");
      setTimeout(() => setNotification(""), 3000); // Clear notification after 3 seconds
      return;
    }

    console.log("UserId:", userId, "ArticleId:", articleId);

    try {
      const response = await fetch("https://community-article-backend.onrender.com/api/bookmarks/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, articleId }),
      });

      if (response.ok) {
        // Set notification for successful bookmark
        setNotification("Article bookmarked successfully!");
        setNotificationType("success");
      } else {
        const data = await response.json();
        setNotification(data.message || "Failed to bookmark article.");
        setNotificationType("error");
      }
    } catch (err) {
      console.error("Error bookmarking article:", err);
      setNotification("An error occurred while bookmarking the article.");
      setNotificationType("error");
    } finally {
      setTimeout(() => setNotification(""), 3000); // Clear notification after 3 seconds
    }
  };

  return (
    <main className="flex-grow">
      <div className="min-h-screen bg-gradient-to-br from-orange-100 to-pink-100">
          {showWelcomePopup && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
                  <div
                    className="absolute inset-0 bg-black/20 backdrop-blur-sm"
                    onClick={() => setShowWelcomePopup(false)}
                  />
                  <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 w-full max-w-sm transform transition-all duration-300 scale-100 opacity-100">
                    <button
                      onClick={() => setShowWelcomePopup(false)}
                      className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
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
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                    <div className="text-center">
                      <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg
                          className="w-8 h-8 text-orange-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                          />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        Welcome to SimpleArticle!
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-4">
                        Please log in to access all features and start sharing your
                        stories with our community.
                      </p>
                      <a
                        href="/login"
                        className="bg-white/10 hover:bg-white/20 px-6 py-2 rounded-full font-medium transition-colors text-orange-600"
                      >
                        Get Started
                      </a>
                    </div>
                  </div>
                </div>
              )}
        {/* Navigation Bar */}
         <header className="bg-gradient-to-r from-orange-400 via-pink-400 to-orange-500 text-white py-4 sticky top-0 z-50 backdrop-blur-sm shadow-lg border-b border-white/10">
          <div className="container mx-auto flex justify-between items-center px-4 sm:px-6 lg:px-8">
            {/* Logo Section */}
            <Link href="/">
              <div className="flex items-center space-x-3 group">
                <div className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg transform transition-all duration-300 group-hover:scale-105 group-hover:rotate-3">
                  <span className="text-transparent bg-clip-text bg-gradient-to-br from-orange-500 to-pink-500 text-2xl font-black">
                    sA
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl font-black tracking-tight">
                  Simple<span className="text-orange-100">Article</span>
                </h1>
              </div>
            </Link>

            {/* Hamburger Menu */}
            <button
              className={`relative block sm:hidden focus:outline-none z-50 ${
                mobileMenuOpen ? "open" : ""
              }`}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <div className="w-7 h-7 flex items-center justify-center">
                <div className="flex flex-col justify-between w-6 h-5 transform transition-all duration-300">
                  <div
                    className={`h-0.5 w-6 bg-white rounded-full transform transition-all duration-300 ${
                      mobileMenuOpen ? "rotate-45 translate-y-2.5" : ""
                    }`}
                  />
                  <div
                    className={`h-0.5 w-6 bg-white rounded-full transition-all duration-300 ${
                      mobileMenuOpen ? "opacity-0" : ""
                    }`}
                  />
                  <div
                    className={`h-0.5 w-6 bg-white rounded-full transform transition-all duration-300 ${
                      mobileMenuOpen ? "-rotate-45 -translate-y-2.5" : ""
                    }`}
                  />
                </div>
              </div>
            </button>

            {/* Navigation Menu */}
            <div
              className={`${
                mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
              } sm:translate-x-0 fixed sm:relative top-0 left-0 h-screen sm:h-auto w-3/4 sm:w-auto bg-white sm:bg-transparent transform transition-transform duration-300 ease-in-out sm:transition-none sm:transform-none flex flex-col sm:flex-row items-start sm:items-center pt-20 sm:pt-0 px-6 sm:px-0 shadow-2xl sm:shadow-none z-40`}
            >
              <nav className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6 w-full sm:w-auto">
                 <Link
                  href={user ? "/create" : ""}
                  onClick={async (e) => {
                    if (!user) {
                      e.preventDefault();
                      setNotification("Please log in or register to write an article.");
                      setNotificationType("error");
                      setTimeout(() => setNotification(""), 3000);
                    } else {
                      setIsLoading(true);
                      // Loading state will be automatically handled by Next.js route change
                    }
                  }}
                  className={`w-full sm:w-auto px-6 py-2.5 text-center bg-white/10 backdrop-blur-sm text-gray-800 rounded-xl font-semibold shadow-lg hover:bg-white/20 transition-all duration-300 text-sm sm:text-base flex items-center justify-center space-x-2 ${
                    isLoading ? 'cursor-not-allowed opacity-75' : ''
                  }`}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <svg 
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-800" 
                        xmlns="http://www.w3.org/2000/svg" 
                        fill="none" 
                        viewBox="0 0 24 24"
                      >
                        <circle 
                          className="opacity-25" 
                          cx="12" 
                          cy="12" 
                          r="10" 
                          stroke="currentColor" 
                          strokeWidth="4"
                        />
                        <path 
                          className="opacity-75" 
                          fill="currentColor" 
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      <span>Loading...</span>
                    </>
                  ) : (
                    "Write Article"
                  )}
                </Link>

                    <Link
                      href="/guidelines"
                      className="w-full sm:w-auto px-6 py-2.5 text-center bg-white/10 backdrop-blur-sm text-gray-800 rounded-xl font-semibold shadow-lg hover:bg-white/20 transition-all duration-300 text-sm sm:text-base flex items-center justify-center space-x-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                      </svg>
                      <span>Guidelines</span>
                    </Link>

                <button
                  onClick={() => setIsPopupOpen(true)}
                  className="w-full sm:w-auto px-6 py-2.5 bg-white/90 backdrop-blur-sm text-orange-500 rounded-xl font-semibold shadow-lg hover:bg-white transition-all duration-300 text-sm sm:text-base"
                >
                  Subscribe
                </button>

                {/* User Actions */}
                {user ? (
                  <div className="relative w-full sm:w-auto">
                    <button
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                      className="flex items-center justify-center w-full sm:w-auto px-6 py-2.5 bg-white/10 backdrop-blur-sm text-gray-800 rounded-xl font-semibold shadow-lg hover:bg-white/20 transition-all duration-300 text-sm sm:text-base"
                    >
                      {user.name}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-5 w-5 ml-2 transform transition-transform duration-300 ${
                          dropdownOpen ? "rotate-180" : ""
                        }`}
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>

                    {dropdownOpen && (
                      <div className="absolute top-full right-0 mt-2 w-56 bg-white/90 backdrop-blur-sm rounded-xl shadow-xl py-2 z-50 border border-gray-100">
                        <Link
                          href="/my-articles"
                          className="flex items-center px-4 py-2.5 text-gray-700 hover:bg-orange-50 transition-colors duration-300"
                        >
                          <svg
                            className="w-5 h-5 mr-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                            />
                          </svg>
                          My Articles
                        </Link>
                        <Link
                          href="/bookmarks"
                          className="flex items-center px-4 py-2.5 text-gray-700 hover:bg-orange-50 transition-colors duration-300"
                        >
                          <svg
                            className="w-5 h-5 mr-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                            />
                          </svg>
                          Bookmarks
                        </Link>
                            
                        <Link
                          href="/community"
                          className="flex items-center px-4 py-2.5 text-gray-700 hover:bg-orange-50 transition-colors duration-300"
                        >
                          <svg
                            className="w-5 h-5 mr-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2v-6a2 2 0 012-2h8zM7 8H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l4-4h6a2 2 0 002-2v-6a2 2 0 00-2-2h-8z"
                            />
                          </svg>
                          Community Forum
                        </Link>
                            
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-4 py-2.5 text-gray-700 hover:bg-orange-50 transition-colors duration-300"
                        >
                          <svg
                            className="w-5 h-5 mr-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                            />
                          </svg>
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row sm:space-x-3 space-y-4 sm:space-y-0 w-full sm:w-auto">
                    <Link
                      href="/login"
                      className="w-full sm:w-auto px-6 py-2.5 text-center bg-white/10 backdrop-blur-sm text-gray-800 rounded-xl font-semibold shadow-lg hover:bg-white/20 transition-all duration-300 text-sm sm:text-base"
                    >
                      Login
                    </Link>
                    <Link
                      href="/signup"
                      className="w-full sm:w-auto px-6 py-2.5 text-center bg-white/90 backdrop-blur-sm text-orange-500 rounded-xl font-semibold shadow-lg hover:bg-white transition-all duration-300 text-sm sm:text-base"
                    >
                      Register
                    </Link>
                  </div>
                )}
              </nav>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <div
          className={`relative min-h-[60vh] flex items-center justify-center bg-gradient-to-br from-orange-50 via-pink-50 to-orange-50 ${
            mobileMenuOpen ? "mt-[320px] sm:mt-0" : ""
          } transition-all duration-300`}
        >
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

          <div className="relative z-10 container mx-auto text-center px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
            {/* Main Content */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-pink-600 mb-6 leading-tight animate-fadeIn">
              Discover a Variety of Stories
            </h1>

            <p className="text-base sm:text-lg lg:text-xl text-gray-600 mb-12 max-w-2xl mx-auto animate-fadeIn opacity-90">
              Explore articles, stories written by the community
            </p>

            {/* Search Section */}
            <div className="max-w-2xl mx-auto space-y-4 animate-fadeIn">
              <div className="relative group">
                {/* Search Message */}
                <div
                  className={`absolute -top-8 left-0 right-0 text-sm text-gray-500 transition-opacity duration-300 ${
                    searchQuery.length > 0 ? "opacity-100" : "opacity-0"
                  }`}
                >
                  📝 Load all articles and then apply search
                </div>

                {/* Search Input */}
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      handleSearch(e.target.value);
                    }}
                    placeholder="Search articles..."
                    className="w-full px-6 py-4 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full shadow-lg focus:shadow-xl focus:ring-2 focus:ring-orange-400 focus:border-transparent outline-none transition-all duration-300 text-gray-800 placeholder-gray-400"
                  />
                  <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
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
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mt-8 animate-fadeIn">
                <Link
                  href="/deleteRequest"
                  className="text-sm text-orange-600 hover:text-orange-700 font-medium hover:underline transition-colors duration-300"
                >
                  Want your article removed? Put your request here
                </Link>

                <button
                  onClick={() => setIsCollaboratePopupOpen(true)}
                  className="px-8 py-3 bg-gradient-to-r from-orange-400 to-pink-500 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  Collaborate
                </button>
              </div>

              {/* User Stories Button */}
              {user && (
                <button
                  onClick={() => router.push("/stories")}
                  className="mt-8 px-8 py-3 bg-gradient-to-r from-gray-800 to-gray-900 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 animate-fadeIn"
                >
                  Stories by SimpleArticles
                </button>
              )}
            </div>
          </div>

          {/* Popup Notification */}
          {popupMessage && (
            <div className="fixed inset-0 flex items-center justify-center z-50 animate-fadeIn">
              <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
              <div className="relative bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 px-8 rounded-lg shadow-2xl transform transition-all duration-300">
                <p className="text-lg font-semibold">{popupMessage}</p>
              </div>
            </div>
          )}
        </div>

        {/* Collaborate Popup */}
        {isCollaboratePopupOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl max-w-md w-full p-6 transform transition-all duration-300 scale-100 animate-slideUp">
              {/* Header */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
                    Join Our Community
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Connect, collaborate, and create together
                  </p>
                </div>
                <button
                  onClick={() => setIsCollaboratePopupOpen(false)}
                  className="text-gray-400 hover:text-gray-500 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
        
              {/* Form */}
              <form onSubmit={handleCollaborateSubmit} className="space-y-4">
                <div className="space-y-1">
                  <input
                    type="text"
                    value={collaborateName}
                    onChange={(e) => setCollaborateName(e.target.value)}
                    placeholder="Your Name"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all duration-300"
                  />
                </div>
        
                <div className="space-y-1">
                  <input
                    type="email"
                    value={collaborateEmail}
                    onChange={(e) => setCollaborateEmail(e.target.value)}
                    placeholder="Your Email"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all duration-300"
                  />
                </div>
        
                <div className="space-y-1">
                  <textarea
                    value={collaborateReason}
                    onChange={(e) => setCollaborateReason(e.target.value)}
                    placeholder="Tell us why you'd like to join..."
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all duration-300 resize-none"
                    rows="4"
                    maxLength="500"
                  ></textarea>
                  <div className="flex justify-end">
                    <span className="text-xs text-gray-500">
                      {collaborateReason.length}/500
                    </span>
                  </div>
                </div>
        
                <div className="space-y-4 pt-2">
                  <button
                    type="submit"
                    className="w-full px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transform transition-all duration-300 hover:from-orange-600 hover:to-pink-600"
                  >
                    Submit Application
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsCollaboratePopupOpen(false)}
                    className="w-full px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all duration-300"
                  >
                    Cancel
                  </button>
                </div>
              </form>
        
              {/* Success Message */}
              {collaborateMessage && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl">
                  <p className="text-sm text-green-600 font-medium text-center">
                    {collaborateMessage}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Notification Display */}
        {notification && (
          <div
            className={`fixed top-5 right-5 z-50 p-4 rounded-md shadow-lg ${
              notificationType === "success"
                ? "bg-green-100 border-green-500 text-green-700"
                : "bg-red-100 border-red-500 text-red-700"
            }`}
          >
            {notification}
          </div>
        )}

        {/* Notification Display */}
        {notification && (
          <div
            className={`fixed top-5 right-5 z-50 p-4 rounded-md shadow-lg ${
              notificationType === "success"
                ? "bg-green-100 border-green-500 text-green-700"
                : "bg-red-100 border-red-500 text-red-700"
            }`}
          >
            {notification}
          </div>
        )}

        {/* Main Article section */}
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          {/* Loading Indicator */}
          {loading && (
            <div className="fixed inset-0 bg-white/70 z-50 flex items-center justify-center">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 border-3 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-gray-600 font-medium">Loading...may take some time</p>
              </div>
            </div>
          )}
        
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-4xl sm:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-pink-600 mb-4">
              Explore Articles
            </h2>
            <p className="text-gray-600 text-lg">
              Discover thought-provoking stories and insights from our community
            </p>
          </div>

            {/*Article Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading && page === 1 
              ? Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    <div className="p-6 space-y-4">
                      <div className="h-6 bg-gray-100 rounded-full w-32 animate-pulse" />
                      <div className="space-y-3">
                        <div className="h-6 bg-gray-100 rounded w-3/4 animate-pulse" />
                        <div className="h-4 bg-gray-100 rounded animate-pulse" />
                        <div className="h-4 bg-gray-100 rounded w-5/6 animate-pulse" />
                      </div>
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="w-24 h-8 bg-gray-100 rounded-full animate-pulse" />
                        <div className="w-24 h-8 bg-gray-100 rounded-full animate-pulse" />
                      </div>
                    </div>
                  </div>
                ))
              : (searchQuery ? filteredArticles : articles).map((article) => (
                  <div
                    key={article._id}
                    className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden group relative"
                  >
                    {/* Loading Overlay */}
                    {clickedArticleId === article._id && (
                      <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex items-center justify-center">
                        <div className="w-8 h-8 border-3 border-orange-500 border-t-transparent rounded-full animate-spin" />
                      </div>
                    )}
          
                    <div className="p-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-orange-500 bg-orange-50 px-3 py-1 rounded-full">
                          {new Date(article.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-400 to-pink-400 flex items-center justify-center">
                            <span className="text-white font-medium text-sm">
                              {article.author.charAt(0)}
                            </span>
                          </div>
                          <span className="text-sm text-gray-600 font-medium">
                            {article.author}
                          </span>
                        </div>
                      </div>
          
                      <h2
                        onClick={() => {
                          setClickedArticleId(article._id);
                          router.push(`/article/${article._id}`);
                        }}
                        className="text-xl font-bold text-gray-900 cursor-pointer group-hover:text-orange-500 transition-colors duration-300"
                      >
                        {article.title}
                      </h2>
          
                      <div
                        className="prose prose-sm text-gray-600 line-clamp-3"
                        dangerouslySetInnerHTML={{
                          __html: article.content.slice(0, 150) + "..."
                        }}
                      />
          
                      <div className="flex items-center justify-between pt-4 border-t">
                        <button
                          onClick={() => {
                            setClickedArticleId(article._id);
                            router.push(`/article/${article._id}`);
                          }}
                          className="text-gray-600 hover:text-orange-500 transition-colors duration-300"
                        >
                          Read More
                        </button>
          
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!user) {
                              setNotification("Please log in to bookmark articles");
                              setNotificationType("error");
                              setTimeout(() => setNotification(""), 3000);
                              return;
                            }
                            handleBookmark(article._id);
                          }}
                          className="inline-flex items-center px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-full transition-colors duration-300"
                        >
                          <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                          </svg>
                          Save
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
          </div>
        
          {/* Load More Button */}
          {page < totalPages && !loading && (
            <div className="flex justify-center mt-10">
              <button
                onClick={loadMoreArticles}
                className="inline-flex items-center px-6 py-2.5 bg-gradient-to-r from-orange-400 to-pink-400 text-white font-medium rounded-full shadow-sm"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Loading...
                  </>
                ) : (
                  <>
                    <span>Load More Articles</span>
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          )}
        </main>


        {/* Newsletter Popup */}
        {isPopupOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl max-w-md w-full p-6 sm:p-8 transform transition-all duration-300 scale-100 animate-slideUp">
              {/* Header */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
                    Stay Updated
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Get the latest articles directly in your inbox
                  </p>
                </div>
                <button
                  onClick={() => setIsPopupOpen(false)}
                  className="text-gray-400 hover:text-gray-500 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
        
              {/* Form */}
              <form onSubmit={handleSubscribe} className="space-y-6">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all duration-300"
                  />
                </div>
        
                <div className="space-y-4">
                  <button
                    type="submit"
                    className="w-full px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transform transition-all duration-300 hover:from-orange-600 hover:to-pink-600"
                  >
                    Subscribe Now
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsPopupOpen(false)}
                    className="w-full px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all duration-300"
                  >
                    Maybe Later
                  </button>
                </div>
              </form>
        
              {/* Message Display */}
              {message && (
                <div className={`mt-4 p-4 rounded-xl ${
                  message.includes("successful")
                    ? "bg-green-50 border border-green-200"
                    : "bg-red-50 border border-red-200"
                }`}>
                  <p className={`text-sm font-medium text-center ${
                    message.includes("successful") ? "text-green-600" : "text-red-600"
                  }`}>
                    {message}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
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
                <h2 className="text-3xl font-black bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent">
                  simpleArticle
                </h2>
                <p className="text-gray-400 max-w-sm">
                  Building a better future, one article at a time. Join our
                  community of knowledge seekers.
                </p>
              </div>
      
              {/* Quick Links */}
              <div className="space-y-4">
                <h3 className="text-white font-semibold text-lg">Quick Links</h3>
                <div className="grid grid-cols-2 gap-4">
                  <a
                    href="mailto:nishantbarua3@gmail.com"
                    className="flex items-center text-gray-400 hover:text-orange-400 transition-colors duration-300 hover:translate-x-1"
                  >
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                    </svg>
                    Email
                  </a>
                  <a
                    href="https://www.linkedin.com/in/nishantbaru/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-gray-400 hover:text-orange-400 transition-colors duration-300 hover:translate-x-1"
                  >
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z"></path>
                    </svg>
                    LinkedIn
                  </a>
                  <a
                    href="https://nishantb66.github.io/MyPortfolio/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-gray-400 hover:text-orange-400 transition-colors duration-300 hover:translate-x-1"
                  >
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM14 11a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1h-1a1 1 0 110-2h1v-1a1 1 0 011-1z"></path>
                    </svg>
                    Portfolio
                  </a>
                </div>
              </div>
      
              {/* Contact/Social */}
              <div className="space-y-4">
                <h3 className="text-white font-semibold text-lg">Stay Connected</h3>
                <div className="flex space-x-4">
                  <a
                    href="https://x.com/Nishant03129296"
                    className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-orange-400 hover:bg-gray-700 hover:text-orange-300 transition-all duration-300 hover:-translate-y-1"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
                    </svg>
                  </a>
                  <a
                    href="https://github.com/nishantb66"
                    className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-orange-400 hover:bg-gray-700 hover:text-orange-300 transition-all duration-300 hover:-translate-y-1"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0C5.373 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.6.113.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"></path>
                    </svg>
                  </a>
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
                  <span className="cursor-pointer hover:text-orange-400 transition-colors duration-300">
                    Privacy Policy
                  </span>
                  <span className="text-gray-700">•</span>
                  <span className="cursor-pointer hover:text-orange-400 transition-colors duration-300">
                    Terms of Service
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}



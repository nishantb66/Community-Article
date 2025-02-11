"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import "../styles/globals.css";
import { useRouter } from "next/navigation";
import axios from "axios";

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
  const [popupMessage, setPopupMessage] = useState(""); // State for popup message
  const [notificationType, setNotificationType] = useState(""); // Success or Error
  const [clickedArticleId, setClickedArticleId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };
  const [showWelcomePopup, setShowWelcomePopup] = useState(false);
  const [messageType, setMessageType] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0); // Add unreadCount state
  const [loadingNotifications, setLoadingNotifications] = useState(false); // Loading state for notifications
  const [loadingArticles, setLoadingArticles] = useState({});
  const [trendingArticles, setTrendingArticles] = useState([]);

  useEffect(() => {
    // Fetch trending articles
    async function fetchTrendingArticles() {
      try {
        const res = await axios.get(
          "https://community-article-backend.onrender.com/api/articles/trending"
        );
        setTrendingArticles(res.data);
      } catch (error) {
        console.error("Error fetching trending articles:", error);
      }
    }

    fetchTrendingArticles();
  }, []);

  // Function to fetch unread notifications count
  const fetchUnreadCount = async () => {
    setLoadingNotifications(true);
    try {
      const token = localStorage.getItem("token"); // Fetch token from localStorage
      if (!token) {
        console.warn("No token found. Unable to fetch notifications.");
        return;
      }

      const response = await fetch(
        "https://community-article-backend.onrender.com",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setUnreadCount(data.unreadCount || 0); // Update unreadCount state
      } else {
        console.error("Failed to fetch unread count");
      }
    } catch (error) {
      console.error("Error fetching unread notifications count:", error);
    } finally {
      setLoadingNotifications(false);
    }
  };

  // Fetch unreadCount on component mount
  useEffect(() => {
    fetchUnreadCount();
  }, []);

  useEffect(() => {
    const sessionCheck = sessionStorage.getItem("pageLoaded");
    const token = localStorage.getItem("token");

    if (!sessionCheck && !token) {
      setShowWelcomePopup(true);
      sessionStorage.setItem("pageLoaded", "true");
    }
  }, []); // Remove user dependency

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
    sessionStorage.removeItem("pageLoaded");
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

  useEffect(() => {
    var _mtm = (window._mtm = window._mtm || []);
    _mtm.push({ "mtm.startTime": new Date().getTime(), event: "mtm.Start" });
    var d = document,
      g = d.createElement("script"),
      s = d.getElementsByTagName("script")[0];
    g.async = true;
    g.src =
      "https://cdn.matomo.cloud/simplearticlesspace.matomo.cloud/container_3s7vGxHg.js";
    s.parentNode.insertBefore(g, s);
  }, []);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://community-article-backend.onrender.com/api/articles/all");
      if (!response.ok) {
        throw new Error("Failed to fetch articles");
      }

      const data = await response.json();

      if (!data || !Array.isArray(data.articles)) {
        console.error("Invalid API response:", data);
        return;
      }

      setArticles(data.articles);
      setFilteredArticles(data.articles);
    } catch (error) {
      console.error("Error fetching articles:", error);
    } finally {
      setLoading(false);
    }
  };

  // Trigger fetch when page changes
  useEffect(() => {
    fetchArticles(page);
  }, [page]);

  // Load more articles
  const loadMoreArticles = () => {
    setVisibleArticles((prevVisible) => prevVisible + 6); // Load 6 more articles
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

  // Updated subscription handler
  const handleSubscribe = async (e) => {
    e.preventDefault();
    setMessage("");
    setMessageType(null);
    setLoading(true);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim() || !emailRegex.test(email.trim())) {
      setMessage("Please enter a valid email address");
      setMessageType("error");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("https://community-article-backend.onrender.com/api/subscribe/sub", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Welcome to our newsletter! 🎉");
        setEmail("");
        setMessageType("success");
      } else if (response.status === 409) {
        setMessage("This email is already subscribed!");
        setMessageType("warning");
      } else {
        setMessage(data.error || "Failed to subscribe. Please try again.");
        setMessageType("error");
      }
    } catch (err) {
      console.error("Subscription error:", err);
      setMessage("Connection error. Please try again later.");
      setMessageType("error");
    } finally {
      setLoading(false);
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
      <div className="min-h-screen bg-gradient-to-br from-orange-10 to-pink-100">
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
            {/* Logo Section */}
            <Link href="/about">
              <div className="flex items-center space-x-3 group">
                <div className="flex items-center space-x-3 bg-white/90 backdrop-blur-sm rounded-xl px-4 py-2 shadow-lg border border-gray-100/20 transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-xl">
                  {/* Logo Icon */}
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center">
                    <span className="text-white text-xl font-black">sA</span>
                  </div>

                  {/* Company Name */}
                  <div className="flex flex-col">
                    <span className="text-lg font-bold bg-gradient-to-br from-orange-600 to-pink-600 bg-clip-text text-transparent">
                      SimpleArticle
                    </span>
                  </div>
                </div>
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
                      setNotification(
                        "Please log in or register to write an article."
                      );
                      setNotificationType("error");
                      setTimeout(() => setNotification(""), 3000);
                    } else {
                      setIsLoading(true);
                      // Loading state will be automatically handled by Next.js route change
                    }
                  }}
                  className={`w-full sm:w-auto px-6 py-2.5 text-center bg-white/10 backdrop-blur-sm text-gray-800 rounded-xl font-semibold shadow-lg hover:bg-white/20 transition-all duration-300 text-sm sm:text-base flex items-center justify-center space-x-2 ${
                    isLoading ? "cursor-not-allowed opacity-75" : ""
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
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
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
                    {/* User Profile Button */}
                    <button
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                      className="w-full sm:w-auto px-4 py-2.5 bg-white rounded-xl border border-gray-100 shadow-xs hover:shadow-sm transition-shadow duration-200 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="relative">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 text-white flex items-center justify-center font-medium text-lg">
                            {user.name.charAt(0)}
                          </div>
                          <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border-[2.5px] border-white rounded-full"></div>
                        </div>
                        <div className="flex flex-col items-start">
                          <span className="text-gray-900 font-semibold text-sm leading-tight">
                            {user.name}
                          </span>
                          <span className="text-gray-500 text-xs font-light">
                            Account settings
                          </span>
                        </div>
                      </div>
                      <svg
                        className={`w-5 h-5 text-gray-400 transform transition-transform ${
                          dropdownOpen ? "rotate-180" : ""
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.8}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>

                    {/* Dropdown Menu */}
                    {dropdownOpen && (
                      <>
                        {/* Overlay for mobile */}
                        <div
                          className="fixed inset-0 bg-black/30 sm:hidden z-40 backdrop-blur-sm"
                          onClick={() => setDropdownOpen(false)}
                        />
                        <div className="fixed sm:absolute inset-x-0 bottom-0 sm:top-full sm:bottom-auto sm:right-0 sm:left-auto sm:w-72 bg-white rounded-xl shadow-2xl sm:shadow-lg sm:border sm:border-gray-100 sm:mt-1.5 z-50">
                          <div className="max-h-[85vh] sm:max-h-[70vh] overflow-y-auto">
                            {/* Mobile Profile Header */}
                            <div className="p-5 border-b border-gray-100 sm:hidden">
                              <div className="flex items-center gap-3.5">
                                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 text-white flex items-center justify-center text-lg font-semibold">
                                  {user.name.charAt(0)}
                                </div>
                                <div>
                                  <div className="font-semibold text-gray-900">
                                    {user.name}
                                  </div>
                                  <div className="text-sm text-gray-500 font-light">
                                    {user.email}
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Menu Items */}
                            <div className="p-2.5">
                              {/* Profile Section */}
                              <Link
                                href="/profile"
                                className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 active:bg-gray-100 transition-colors"
                              >
                                <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                                  <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.8}
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                    />
                                  </svg>
                                </div>
                                <div className="flex-1">
                                  <span className="font-medium text-gray-900 block">
                                    Profile
                                  </span>
                                  <span className="text-xs text-gray-400 font-light">
                                    Personal information
                                  </span>
                                </div>
                              </Link>

                              <Link
                                href="/notification"
                                className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 active:bg-gray-100 transition-colors"
                              >
                                <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600 relative">
                                  <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.8}
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                                    />
                                  </svg>
                                  <div className="absolute top-0 right-0 w-2 h-2 bg-emerald-400 rounded-full ring-2 ring-white"></div>
                                </div>
                                <span className="font-medium text-gray-900">
                                  Notifications
                                </span>
                              </Link>

                              {/* Content Section */}
                              <div className="my-2">
                                <div className="text-[11px] font-medium text-gray-400 uppercase tracking-wider px-3 py-2">
                                  Content
                                </div>
                                <div className="space-y-1">
                                  <Link
                                    href="/my-articles"
                                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 active:bg-gray-100 transition-colors"
                                  >
                                    <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                                      <svg
                                        className="w-5 h-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        strokeWidth={1.8}
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2 2 0 00-2-2h-2"
                                        />
                                      </svg>
                                    </div>
                                    <span className="font-medium text-gray-900">
                                      Articles
                                    </span>
                                  </Link>

                                  <Link
                                    href="/bookmarks"
                                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 active:bg-gray-100 transition-colors"
                                  >
                                    <div className="w-9 h-9 rounded-lg bg-rose-50 flex items-center justify-center text-rose-600">
                                      <svg
                                        className="w-5 h-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        strokeWidth={1.8}
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                                        />
                                      </svg>
                                    </div>
                                    <span className="font-medium text-gray-900">
                                      Bookmarks
                                    </span>
                                  </Link>
                                </div>
                              </div>

                              {/* Community Section */}
                              <div className="my-2">
                                <div className="text-[11px] font-medium text-gray-400 uppercase tracking-wider px-3 py-2">
                                  Community
                                </div>
                                <div className="space-y-1">
                                  <Link
                                    href="/community"
                                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 active:bg-gray-100 transition-colors"
                                  >
                                    <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                                      <svg
                                        className="w-5 h-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        strokeWidth={1.8}
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2v-6a2 2 0 012-2h8z"
                                        />
                                      </svg>
                                    </div>
                                    <span className="font-medium text-gray-900">
                                      Forum
                                    </span>
                                  </Link>

                                  <Link
                                    href="/proposals"
                                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 active:bg-gray-100 transition-colors"
                                  >
                                    <div className="w-9 h-9 rounded-lg bg-cyan-50 flex items-center justify-center text-cyan-600">
                                      <svg
                                        className="w-5 h-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        strokeWidth={1.8}
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                                        />
                                      </svg>
                                    </div>
                                    <span className="font-medium text-gray-900">
                                      Proposals
                                    </span>
                                  </Link>
                                </div>
                              </div>

                              {/* AI Tools Section */}
                              <div className="my-2">
                                <div className="text-[11px] font-medium text-gray-400 uppercase tracking-wider px-3 py-2">
                                  AI Tools
                                </div>
                                <Link
                                  href="/ai-chat"
                                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 active:bg-gray-100 transition-colors"
                                >
                                  <div className="w-9 h-9 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600">
                                    <svg
                                      className="w-5 h-5"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                      strokeWidth={1.8}
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
                                      />
                                    </svg>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium text-gray-900">
                                      SimpleAI
                                    </span>
                                    <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-purple-100 text-purple-600 rounded-md">
                                      NEW
                                    </span>
                                  </div>
                                </Link>
                              </div>
                            </div>

                            {/* Footer Section */}
                            <div className="p-2.5 border-t border-gray-100">
                              <button
                                onClick={handleLogout}
                                className="flex items-center w-full gap-3 p-3 rounded-xl hover:bg-gray-50 active:bg-gray-100 transition-colors text-red-600"
                              >
                                <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center">
                                  <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.8}
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                    />
                                  </svg>
                                </div>
                                <span className="font-medium">Sign Out</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </>
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

        <section className="relative min-h-[80vh] flex flex-col items-center justify-between px-6 lg:px-12 gap-8 bg-gradient-to-br from-gray-50 to-gray-100">
          {/* Main Content */}
          <div className="flex-grow relative flex items-center justify-center w-full">
            <div className="relative z-10 container mx-auto max-w-5xl">
              <div className="text-center space-y-8">
                {/* Header Section */}
                <div className="space-y-4">
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-800 animate-fade-in-up">
                    Discover a Variety of
                    <span className="block mt-2 bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
                      Stories
                    </span>
                  </h1>
                  <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed animate-fade-in-up delay-100">
                    Explore an expansive collection of articles and stories
                    crafted by writers from around the world. Get inspired, stay
                    informed, and share your thoughts with the community.
                  </p>
                </div>

                {/* Actions Section */}
                <div className="flex flex-wrap items-center justify-center gap-4 animate-fade-in-up delay-200">
                  <button
                    onClick={() => setIsCollaboratePopupOpen(true)}
                    className="px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-500 text-white rounded-lg shadow-lg hover:from-orange-700 hover:to-orange-600 transition-all duration-300 transform hover:scale-105"
                  >
                    Collaborate
                  </button>
                  <a
                    href="/deleteRequest"
                    className="px-6 py-3 border border-gray-300 text-gray-700 hover:border-orange-600 hover:text-orange-600 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105"
                  >
                    Request Article Removal
                  </a>
                  <button
                    onClick={() => router.push("/stories")}
                    className="px-6 py-3 bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-lg shadow-lg hover:from-gray-800 hover:to-gray-700 transition-all duration-300 transform hover:scale-105"
                  >
                    Stories by SimpleArticles
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full px-4 lg:px-8">
          <div className="max-w-5xl mx-auto bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-2xl p-6 hover:shadow-3xl transition-shadow duration-300">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800 bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
                Trending Articles
              </h2>
              <div className="flex items-center space-x-1">
                <span className="inline-block w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                <span className="text-sm text-gray-500">Live</span>
              </div>
            </div>

            {/* Articles List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trendingArticles.map((article) => (
                <div
                  key={article._id}
                  className="group p-4 bg-white hover:bg-gradient-to-br from-orange-50 to-pink-50 border border-gray-200 rounded-lg transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl cursor-pointer"
                >
                  <div className="flex items-start space-x-4">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-r from-orange-100 to-pink-100 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                      <span className="text-lg font-semibold text-orange-600">
                        {article.author[0]}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800 line-clamp-2 group-hover:text-orange-600 transition-colors duration-300">
                        {article.title}
                      </h3>
                      <div className="mt-2 flex items-center space-x-4">
                        <div className="flex items-center text-sm text-gray-500">
                          <span>{article.author}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-400">
                          <svg
                            className="w-4 h-4 mr-1"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <path d="M15 12c0 1.654-1.346 3-3 3s-3-1.346-3-3 1.346-3 3-3 3 1.346 3 3zm9-.449s-4.252 8.449-11.985 8.449c-7.18 0-12.015-8.449-12.015-8.449s4.446-7.551 12.015-7.551c7.694 0 11.985 7.551 11.985 7.551zm-7 .449c0-2.757-2.243-5-5-5s-5 2.243-5 5 2.243 5 5 5 5-2.243 5-5z" />
                          </svg>
                          {article.viewed}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

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

        {/* Article section */}
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          {/* Loading Indicator */}
          {loading && (
            <div className="fixed inset-0 bg-white/70 z-50 flex items-center justify-center">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 border-3 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-gray-600 font-medium">
                  Loading articles...
                </p>
              </div>
            </div>
          )}

          {/* Section Header */}
          <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
            {/* Header Section */}
            <div className="space-y-8 text-center">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-pink-600">
                  Explore Articles
                </span>
              </h2>

              <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto">
                Discover thought-provoking stories and insights from our
                community
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
                {/* AI Summarize Button */}
                <Link href="/categorise">
                  <div className="relative inline-block">
                    <button className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg font-medium shadow-sm inline-flex items-center gap-2 hover:shadow-md transition-shadow">
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
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                      <span className="text-sm md:text-base">
                        Summarize and classify with AI
                      </span>
                    </button>
                    <div className="absolute -top-5 -right-5 px-2 py-0.5 bg-white rounded-full shadow-sm border border-orange-100">
                      <span className="text-xs font-small bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
                        New✨
                      </span>
                    </div>
                  </div>
                </Link>

                {/* Write Article Button */}
                <Link
                  href={user ? "/create" : ""}
                  onClick={async (e) => {
                    if (!user) {
                      e.preventDefault();
                      setNotification(
                        "Please log in or register to write an article."
                      );
                      setNotificationType("error");
                      setTimeout(() => setNotification(""), 3000);
                    } else {
                      setIsLoading(true);
                    }
                  }}
                  className={`px-5 py-2.5 bg-white text-gray-800 rounded-lg font-medium shadow-sm 
          hover:shadow-md transition-shadow inline-flex items-center gap-2
          ${isLoading ? "opacity-75 cursor-not-allowed" : ""}`}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <svg
                        className="animate-spin h-4 w-4 text-gray-800"
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
                      <span className="text-sm md:text-base">Loading...</span>
                    </div>
                  ) : (
                    <span className="text-sm md:text-base">
                      Write Article ✍🏻
                    </span>
                  )}
                </Link>
              </div>
            </div>

            <br />

            <div className="relative">
              {searchQuery.length > 0 && (
                <div className="absolute -top-8 left-0 right-0 text-sm text-gray-500">
                  📝 Load all articles and then apply search
                </div>
              )}

              <div className="relative flex items-center">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    handleSearch(e.target.value);
                  }}
                  placeholder="Search articles..."
                  className="w-full px-6 py-4 bg-white border border-gray-200 rounded-xl shadow-sm focus:shadow-md focus:border-orange-500 outline-none transition-all duration-200 text-gray-800 placeholder-gray-400"
                />
                <svg
                  className="w-5 h-5 absolute right-4 text-gray-400"
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
              </div>
            </div>
          </section>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading && page === 1
              ? Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={index}
                    className="bg-gray-100 rounded-lg p-6 border border-gray-200"
                  >
                    <div className="space-y-4">
                      <div className="h-6 bg-gray-300 rounded-full w-32" />
                      <div className="space-y-3">
                        <div className="h-6 bg-gray-300 rounded w-3/4" />
                        <div className="h-4 bg-gray-300 rounded" />
                        <div className="h-4 bg-gray-300 rounded w-5/6" />
                      </div>
                      <div className="flex items-center justify-between pt-4 border-t border-gray-300">
                        <div className="w-24 h-8 bg-gray-300 rounded-full" />
                        <div className="w-24 h-8 bg-gray-300 rounded-full" />
                      </div>
                    </div>
                  </div>
                ))
              : (searchQuery ? filteredArticles : articles).map((article) => (
                  <div key={article._id} className="bg-white rounded-lg p-6">
                    {/* Loading Overlay */}
                    {clickedArticleId === article._id && (
                      <div className="absolute inset-0 bg-white/90 z-10 flex items-center justify-center">
                        <div className="w-6 h-6 border-2 border-gray-700 border-t-transparent rounded-full"></div>
                      </div>
                    )}

                    {/* Article Content */}
                    {/* Article Content */}
                    <div className="space-y-6 border border-gray-100 rounded-xl shadow-sm p-7 bg-white group hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-medium text-gray-500 tracking-wide uppercase">
                          {new Date(article.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            }
                          )}
                        </span>
                        <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
                          {article.author}
                        </span>
                      </div>

                      <h2
                        onClick={() => {
                          setClickedArticleId(article._id);
                          router.push(`/article/${article._id}`);
                        }}
                        className="text-2xl font-bold text-gray-900 hover:text-indigo-600 cursor-pointer leading-tight"
                      >
                        {article.title}
                      </h2>

                      <div
                        className="text-gray-600 mt-3 mb-6 leading-relaxed line-clamp-3"
                        dangerouslySetInnerHTML={{ __html: article.content }}
                      />

                      <div className="flex items-center justify-between border-t border-gray-50 pt-5">
                        <button
                          onClick={async () => {
                            setLoadingArticles((prev) => ({
                              ...prev,
                              [article._id]: true,
                            }));
                            setClickedArticleId(article._id);
                            await router.push(`/article/${article._id}`);
                            setLoadingArticles((prev) => ({
                              ...prev,
                              [article._id]: false,
                            }));
                          }}
                          className={`flex items-center text-sm font-medium ${
                            loadingArticles[article._id]
                              ? "text-indigo-400 cursor-not-allowed"
                              : "text-indigo-600 hover:text-indigo-700 cursor-pointer"
                          }`}
                          disabled={loadingArticles[article._id]}
                        >
                          {loadingArticles[article._id] ? (
                            <>
                              <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mr-2"></div>
                              Loading...
                            </>
                          ) : (
                            <>
                              Read Article
                              <svg
                                className="w-4 h-4 ml-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M9 5l7 7-7 7"
                                />
                              </svg>
                            </>
                          )}
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!user) {
                              setNotification(
                                "Please log in to bookmark articles"
                              );
                              setNotificationType("error");
                              setTimeout(() => setNotification(""), 3000);
                              return;
                            }
                            handleBookmark(article._id);
                          }}
                          className="flex items-center px-3.5 py-1.5 text-sm font-medium text-indigo-600 hover:bg-indigo-50 rounded-lg border border-indigo-100"
                        >
                          <svg
                            className="w-4 h-4 mr-2"
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
                          Bookmark
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
          </div>

          {/* Load More Button */}
          {filteredArticles.length < articles.length && (
            <div className="flex justify-center mt-10">
              <button
                onClick={loadMoreArticles}
                className="inline-flex items-center px-6 py-2.5 bg-gradient-to-r from-orange-400 to-pink-400 text-white font-medium rounded-full shadow-sm"
              >
                <span>Load More Articles</span>
                <svg
                  className="w-4 h-4 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
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

              {/* Form */}
              <form onSubmit={handleSubscribe} className="space-y-6">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
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
                <div
                  className={`mt-4 p-4 rounded-xl ${
                    message.includes("successful")
                      ? "bg-green-50 border border-green-200"
                      : "bg-red-50 border border-red-200"
                  }`}
                >
                  <p
                    className={`text-sm font-medium text-center ${
                      message.includes("successful")
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {message}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <footer className="relative mt-20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gray-900 via-gray-800 to-black"></div>

        <div className="relative">
          <svg
            className="fill-current text-white dark:text-gray-900"
            viewBox="0 0 1440 48"
          >
            <path d="M0 48h1440V0c-624 52-816 0-1440 0v48z"></path>
          </svg>

          <div className="container mx-auto px-6 py-12 backdrop-blur-sm bg-black/20">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-12">
              {/* Brand Section */}
              <div className="space-y-4">
                <h2 className="text-3xl font-black bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent">
                  simpleArticle
                </h2>
                <br />
                <Link
                  href="/about"
                  className="px-4 py-2 text-sm bg-white/90 text-orange-700 rounded-lg font-medium"
                >
                  About Us
                </Link>
                <p className="text-gray-400 max-w-sm">
                  Building a better future, one article at a time. Join our
                  community of knowledge seekers.
                </p>
              </div>

              {/* Quick Links */}
              <div className="space-y-4">
                <h3 className="text-white font-semibold text-lg">
                  Quick Links
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <a
                    href="mailto:nishantbarua3@gmail.com"
                    className="flex items-center text-gray-400 hover:text-orange-400"
                  >
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                    </svg>
                    Email
                  </a>
                  <a
                    href="https://www.linkedin.com/in/nishantbaru/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-gray-400 hover:text-orange-400"
                  >
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z"></path>
                    </svg>
                    LinkedIn
                  </a>
                  <a
                    href="https://nishantb66.github.io/MyPortfolio/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-gray-400 hover:text-orange-400"
                  >
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM14 11a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1h-1a1 1 0 110-2h1v-1a1 1 0 011-1z"></path>
                    </svg>
                    Portfolio
                  </a>
                </div>
              </div>

              {/* Contact/Social */}
              <div className="space-y-4">
                <h3 className="text-white font-semibold text-lg">
                  Stay Connected
                </h3>
                <div className="flex space-x-4">
                  <a
                    href="https://x.com/Nishant03129296"
                    className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-orange-400 hover:bg-gray-700"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
                    </svg>
                  </a>
                  <a
                    href="https://github.com/nishantb66"
                    className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-orange-400 hover:bg-gray-700"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
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
                  © {new Date().getFullYear()} Nishant Baruah. All rights
                  reserved.
                </p>
                <div className="flex items-center space-x-4 text-sm text-gray-400">
                  <span className="cursor-pointer hover:text-orange-400">
                    Privacy Policy
                  </span>
                  <span className="text-gray-700">•</span>
                  <span className="cursor-pointer hover:text-orange-400">
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

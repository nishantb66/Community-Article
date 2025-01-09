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
        {/* Navigation Bar */}
         <header className="bg-gradient-to-r from-orange-400 to-pink-400 text-white py-4 sticky top-0 z-50 shadow-lg">
          <div className="container mx-auto flex justify-between items-center px-4 sm:px-10">
            {/* Logo Section */}
            <Link href="/">
              <div className="flex items-center space-x-2 cursor-pointer">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md">
                  <span className="text-orange-500 text-xl font-bold">sA</span>
                </div>
                <h1 className="text-lg sm:text-xl font-extrabold tracking-tight">
                  SimpleArticle
                </h1>
              </div>
            </Link>

            {/* Hamburger Menu with Animation */}
            <button
              className={`relative block sm:hidden focus:outline-none ${
                mobileMenuOpen ? "open" : ""
              }`}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <div className="h-1 w-6 bg-white rounded transition-all duration-300 transform"></div>
              <div className="h-1 w-6 bg-white rounded transition-all duration-300 transform mt-1"></div>
              <div className="h-1 w-6 bg-white rounded transition-all duration-300 transform mt-1"></div>

              {/* Toggle Animation */}
              <style jsx>{`
                button.open div:nth-child(1) {
                  transform: translateY(8px) rotate(45deg);
                }
                button.open div:nth-child(2) {
                  opacity: 0;
                }
                button.open div:nth-child(3) {
                  transform: translateY(-8px) rotate(-45deg);
                }
              `}</style>
            </button>

            {/* Navigation Menu */}
            <div
              className={`${
                mobileMenuOpen ? "block" : "hidden"
              } sm:flex sm:items-center fixed sm:relative top-[72px] left-0 sm:top-0 w-full sm:w-auto bg-white sm:bg-transparent shadow-lg sm:shadow-none z-50 rounded-lg sm:rounded-none`}
            >
              <nav className="flex flex-col sm:flex-row items-center sm:space-x-4 px-6 py-6 sm:px-0 sm:py-0">
                <Link
                  href={user ? "/create" : ""}
                  onClick={(e) => {
                    if (!user) {
                      e.preventDefault();
                      setNotification(
                        "Please log in or register to write an article."
                      );
                      setNotificationType("error");

                      // Clear the notification after 3 seconds
                      setTimeout(() => setNotification(""), 3000);
                    }
                  }}
                  className="w-full sm:w-auto px-4 py-2 mb-2 sm:mb-0 text-center bg-orange-500 text-white rounded-full font-semibold shadow-md hover:bg-orange-600 transition text-sm sm:text-base"
                >
                  Write
                </Link>
                <button
                  onClick={() => setIsPopupOpen(true)}
                  className="w-full sm:w-auto px-4 py-2 mb-2 sm:mb-0 bg-pink-500 text-white rounded-full font-semibold shadow-md hover:bg-pink-600 transition text-sm sm:text-base"
                >
                  Subscribe
                </button>

                {/* User Actions */}
                {user ? (
                  <div className="relative w-full sm:w-auto">
                    <button
                      className="flex items-center justify-center w-full sm:w-auto px-4 py-2 bg-gray-100 text-gray-800 rounded-full font-semibold shadow-md hover:bg-gray-200 transition text-sm sm:text-base"
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                    >
                      {user.name}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 ml-2"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.292 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                    {dropdownOpen && (
                      <div className="absolute top-full right-0 mt-2 w-full sm:w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                        <Link
                          href="/my-articles"
                          className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                        >
                          My Articles
                        </Link>
                        <Link
                          href="/bookmarks"
                          className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                        >
                          View Bookmarks
                        </Link>
                        <button
                          className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                          onClick={handleLogout}
                        >
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row sm:space-x-2 w-full sm:w-auto">
                    <Link
                      href="/login"
                      className="w-full sm:w-auto px-4 py-2 mb-2 sm:mb-0 text-center bg-gray-100 text-gray-800 rounded-full font-semibold shadow-md hover:bg-gray-200 transition text-sm sm:text-base"
                    >
                      Login
                    </Link>
                    <Link
                      href="/signup"
                      className="w-full sm:w-auto px-4 py-2 text-center bg-gray-100 text-gray-800 rounded-full font-semibold shadow-md hover:bg-gray-200 transition text-sm sm:text-base"
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
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Collaborate
              </h2>
              <p className="text-sm text-gray-700 mb-6">
                Let’s join together and make the community larger.
              </p>
              <form onSubmit={handleCollaborateSubmit} className="space-y-4">
                <input
                  type="text"
                  value={collaborateName}
                  onChange={(e) => setCollaborateName(e.target.value)}
                  placeholder="Your Name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-orange-400 focus:outline-none"
                />
                <input
                  type="email"
                  value={collaborateEmail}
                  onChange={(e) => setCollaborateEmail(e.target.value)}
                  placeholder="Your Email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-orange-400 focus:outline-none"
                />
                <textarea
                  value={collaborateReason}
                  onChange={(e) => setCollaborateReason(e.target.value)}
                  placeholder="Why do you want to join?"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-orange-400 focus:outline-none"
                  rows="4"
                ></textarea>
                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-orange-500 text-white font-semibold rounded-md shadow-md hover:bg-orange-600 transition"
                >
                  Submit
                </button>
              </form>
              {collaborateMessage && (
                <p className="text-center mt-4 text-sm text-green-500">
                  {collaborateMessage}
                </p>
              )}
              <button
                onClick={() => setIsCollaboratePopupOpen(false)}
                className="mt-4 w-full px-4 py-2 bg-gray-300 text-gray-700 font-semibold rounded-md shadow-md hover:bg-gray-400 transition"
              >
                Close
              </button>
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

        {/* Main Article Section */}
        <main className="container mx-auto mt-8 px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="mb-12 text-center space-y-2">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-800 tracking-tight">
              Explore Articles
            </h2>
            <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto">
              Discover thought-provoking stories and insights from our community
            </p>
          </div>

          {/* Loader */}
          {loading && page === 1 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden"
                >
                  <div className="h-48 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse"></div>
                  <div className="p-6 space-y-4">
                    <div className="h-6 bg-gray-200 rounded-lg w-3/4 animate-pulse"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded-lg animate-pulse"></div>
                      <div className="h-4 bg-gray-200 rounded-lg w-5/6 animate-pulse"></div>
                    </div>
                    <div className="flex justify-between items-center pt-4">
                      <div className="h-4 bg-gray-200 rounded-lg w-1/3 animate-pulse"></div>
                      <div className="h-8 w-24 bg-gray-200 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {(searchQuery ? filteredArticles : articles).map((article) => (
                <div
                  key={article._id}
                  className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                >
                  {/* Thumbnail */}
                  <div
                    onClick={() => router.push(`/article/${article._id}`)}
                    className="cursor-pointer relative overflow-hidden h-48"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-200 to-pink-200 group-hover:scale-105 transition-transform duration-300"></div>
                    <div className="absolute inset-0 flex items-center justify-center p-6">
                      <h3 className="text-xl sm:text-2xl font-bold text-gray-800 text-center line-clamp-2 group-hover:scale-105 transition-transform duration-300">
                        {article.title}
                      </h3>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="mb-4">
                      <div
                        className="text-gray-700 line-clamp-3 text-sm sm:text-base"
                        dangerouslySetInnerHTML={{
                          __html: article.content.slice(0, 150) + "...",
                        }}
                      />
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-400 to-pink-400 flex items-center justify-center text-white font-semibold text-sm">
                          {article.author.charAt(0)}
                        </div>
                        <span className="text-sm text-gray-600">
                          {article.author}
                        </span>
                      </div>
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
                        className="flex items-center space-x-1 px-4 py-2 bg-gradient-to-r from-orange-400 to-pink-400 text-white rounded-full text-sm font-medium hover:shadow-lg transition-all duration-300 transform hover:scale-105"
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
                            d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                          />
                        </svg>
                        <span>Save</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Load More Button */}
          {page < totalPages && !loading && (
            <div className="flex justify-center mt-12">
              <button
                onClick={loadMoreArticles}
                className="group px-8 py-3 bg-gradient-to-r from-orange-400 to-pink-400 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
              >
                <span>Load More Articles</span>
                <svg
                  className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </button>
            </div>
          )}
        </main>


        {/* Newsletter Popup */}
        {isPopupOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8 max-w-xs sm:max-w-md w-full">
              <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">
                Subscribe to our newsletter for email updates
              </h2>
              <form onSubmit={handleSubscribe}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:outline-none mb-4 text-sm sm:text-base"
                />
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                  <button
                    type="submit"
                    className="bg-orange-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-orange-600 transition text-sm sm:text-base"
                  >
                    Subscribe
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsPopupOpen(false)}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-400 transition text-sm sm:text-base"
                  >
                    Close
                  </button>
                </div>
              </form>
              {message && (
                <p
                  className={`mt-4 text-center ${
                    message.includes("successful")
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {message}
                </p>
              )}
            </div>
          </div>
        )}
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
    </main>
  );
}



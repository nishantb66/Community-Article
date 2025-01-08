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
                <header className="bg-gradient-to-r from-orange-400 to-pink-400 text-white py-4 sticky top-0 z-10 shadow-lg">
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

            {/* Hamburger Menu for Mobile */}
            <button
              className="block sm:hidden focus:outline-none"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            </button>

            {/* Navigation Menu */}
            <div
              className={`${
                mobileMenuOpen ? "block" : "hidden"
              } sm:flex sm:items-center absolute sm:relative top-16 left-0 sm:top-0 w-full sm:w-auto bg-white sm:bg-transparent shadow-lg sm:shadow-none z-20 rounded-lg sm:rounded-none`}
            >
              <nav className="flex flex-col sm:flex-row items-center sm:space-x-4 px-6 py-6 sm:px-0 sm:py-0">
                <Link
                  href={user ? "/create" : ""}
                  onClick={(e) => {
                    if (!user) {
                      e.preventDefault(); // Prevent navigation if the user is not logged in
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
                        {/* Bookmarks Button */}
                        {user && (
                          <Link
                            href="/bookmarks"
                            className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                          >
                            View Bookmarks
                          </Link>
                        )}
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

        <div className="text-center bg-gradient-to-br from-orange-50 to-pink-50 py-10 px-6 sm:py-16 sm:px-10">
          {/* Collaborate Button Below Logo */}

          <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-800 mb-4 leading-tight">
            Discover a Variety of Stories
          </h1>
          <p className="text-base sm:text-lg text-gray-600 mb-6">
            Explore articles, stories written by the community
          </p>
          {/* Search Bar */}
          <div className="max-w-md mx-auto">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                handleSearch(e.target.value);
              }}
              placeholder="Search articles..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-orange-400 focus:outline-none"
            />
            <p className="text-base sm:text-sm text-gray-600 mb-1">
              📝Load all articles and then apply search
            </p>
          </div>
          <br />
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <div className="flex flex-row gap-2">
              <Link
                href="/deleteRequest"
                className="text-xs sm:text-sm text-orange-600 font-semibold hover:underline text-center"
              >
                Want your article removed? Put your request here
              </Link>
            </div>
            <button
              onClick={() => setIsCollaboratePopupOpen(true)}
              className="px-6 py-2 bg-orange-400 text-white font-semibold rounded-full shadow-md hover:bg-orange-500 transition"
            >
              Collaborate
            </button>
          </div>

          <br />

          {user && (
            <>
              <button
                onClick={() => {
                  router.push("/stories"); // Redirect to the stories page
                }}
                className="mt-6 inline-block px-6 py-2 bg-gray-800 text-white font-semibold rounded-full shadow-md hover:bg-gray-900 transition text-sm sm:text-base"
              >
                Stories by SimpleArticles
              </button>

              {/* Popup Notification */}
              {popupMessage && (
                <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
                  <div className="bg-blue-500 text-white py-4 px-8 rounded-lg shadow-md text-center">
                    <p className="text-lg font-semibold">{popupMessage}</p>
                  </div>
                </div>
              )}
            </>
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

        {/* Main Section */}
        <main className="container mx-auto mt-6 px-4 sm:px-10">
          <div className="mb-6 sm:mb-8 text-center">
            <h2 className="text-xl sm:text-3xl font-bold text-gray-800">
              Explore
            </h2>
            <p className="text-gray-600 text-sm sm:text-base mt-2">
              Stay updated with the latest articles from the community
            </p>
          </div>

          {loading && page === 1 ? (
            // Skeleton Loader for Initial Load
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse"
                >
                  <div className="h-40 bg-gray-300"></div>
                  <div className="p-4">
                    <div className="h-5 bg-gray-300 rounded-md w-3/4 mb-3"></div>
                    <div className="h-4 bg-gray-300 rounded-md w-full mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded-md w-5/6 mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded-md w-1/3"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // Filtered Articles
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {(searchQuery ? filteredArticles : articles).map((article) => (
                <div
                  key={article._id}
                  className="bg-white rounded-lg shadow-md hover:shadow-xl transition-transform transform hover:-translate-y-2 overflow-hidden"
                >
                  {/* Article Container */}
                  <div
                    onClick={() => router.push(`/article/${article._id}`)}
                    className="cursor-pointer p-4"
                  >
                    <h3 className="text-lg sm:text-2xl font-semibold text-gray-800 hover:text-orange-500">
                      {article.title}
                    </h3>
                    <div
                      className="text-gray-700 mt-3 text-sm sm:text-base line-clamp-2"
                      dangerouslySetInnerHTML={{
                        __html: article.content.slice(0, 120),
                      }}
                    ></div>
                    <p className="text-xs sm:text-sm text-gray-500 mt-4">
                      By {article.author}
                    </p>
                  </div>

                  {/* Bookmark Button */}
                  <div className="p-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent navigation on card click
                        handleBookmark(article._id);
                      }}
                      className="mt-4 px-3 py-1 bg-orange-400 text-white text-xs rounded-full font-semibold shadow-md hover:bg-orange-500 transition"
                    >
                      Bookmark
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Load More Button */}
          {page < totalPages && !loading && (
            <div className="flex justify-center mt-8 sm:mt-12">
              <button
                onClick={loadMoreArticles}
                className="px-4 py-2 bg-orange-500 text-white rounded-full font-semibold shadow-md hover:bg-orange-600 transition"
              >
                Load More
              </button>
            </div>
          )}
        </main>

        {/* Newsletter Popup */}
        {isPopupOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8 max-w-xs sm:max-w-md w-full">
              <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">
                Subscribe to Our Newsletter
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



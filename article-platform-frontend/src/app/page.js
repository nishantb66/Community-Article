"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import "../styles/globals.css";

export default function Home() {
  const [articles, setArticles] = useState([]);
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

  useEffect(() => {
   var _mtm = window._mtm = window._mtm || [];
   _mtm.push({'mtm.startTime': (new Date().getTime()), 'event': 'mtm.Start'});
   var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
   g.async=true; g.src='https://cdn.matomo.cloud/simplearticlesspace.matomo.cloud/container_3s7vGxHg.js'; s.parentNode.insertBefore(g,s);
  }, [])

  // Fetch articles from the backend API
  useEffect(() => {
    fetch("https://community-article-backend.onrender.com/api/articles")
      .then((res) => res.json())
      .then((data) => {
        const sortedArticles = data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setArticles(sortedArticles);
        setFilteredArticles(sortedArticles);
      })
      .catch((err) => console.error("Error fetching articles:", err))
      .finally(() => setLoading(false));
  }, []);

  // Load more articles
  const loadMoreArticles = () => {
    setVisibleArticles((prev) => prev + 3);
  };

  // Handle search
  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setFilteredArticles(articles);
    } else {
      const filtered = articles.filter(
        (article) =>
          article.title.toLowerCase().includes(query.toLowerCase()) ||
          article.content.toLowerCase().includes(query.toLowerCase())
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
        setCollaborateMessage("Thanks for joining us 😊, we will get back to you soon!");
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 to-pink-100">
      {/* Navigation Bar */}
      <header className="bg-white shadow-md py-3 sticky top-0 z-10">
        <div className="container mx-auto flex justify-between items-center px-4 sm:px-10">
          {/* Logo Section */}
          <Link href="/">
            <div className="flex items-center space-x-2 cursor-pointer">
              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-r from-orange-400 to-pink-400 rounded-full flex items-center justify-center">
                <span className="text-white text-lg sm:text-xl font-bold">
                  sA
                </span>
              </div>
              <h1 className="text-lg sm:text-xl font-extrabold text-gray-800 tracking-tight">
                SimpleArticle
              </h1>
            </div>
          </Link>

          {/* Menu Buttons */}
          <div className="flex space-x-2 sm:space-x-4">
            <Link
              href="/create"
              className="px-3 py-1 sm:px-4 sm:py-2 bg-orange-500 text-white rounded-full font-semibold shadow-md hover:bg-orange-600 transition text-sm sm:text-base"
            >
              Write
            </Link>
            <button
              onClick={() => setIsPopupOpen(true)}
              className="px-3 py-1 sm:px-4 sm:py-2 bg-orange-500 text-white rounded-full font-semibold shadow-md hover:bg-orange-600 transition text-sm sm:text-base"
            >
              Subscribe
            </button>
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
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search articles..."
            className="w-full sm:w-2/3 lg:w-1/3 px-4 py-2 border border-gray-300 rounded-full shadow-md focus:ring-2 focus:ring-orange-400 focus:outline-none text-sm sm:text-base"
          />
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

      {/* Article List */}
      <main className="container mx-auto mt-6 px-4 sm:px-10">
        <div className="mb-6 sm:mb-8 text-center">
          <h2 className="text-xl sm:text-3xl font-bold text-gray-800">
            Explore
          </h2>
          <p className="text-gray-600 text-sm sm:text-base mt-2">
            Stay updated with the latest articles from the community
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <p className="text-lg sm:text-xl font-semibold text-gray-500">
              Loading... may take some time
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredArticles.slice(0, visibleArticles).map((article) => (
              <div
                key={article._id}
                className="bg-white rounded-lg shadow-md hover:shadow-xl transition-transform transform hover:-translate-y-2 overflow-hidden"
              >
                <div className="p-4">
                  <Link
                    href={`/article/${article._id}`}
                    className="text-lg sm:text-2xl font-semibold text-gray-800 hover:text-orange-500"
                  >
                    {article.title}
                  </Link>
                  <p className="text-gray-700 mt-3 text-sm sm:text-base line-clamp-2">
                    {article.content.slice(0, 120)}...
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500 mt-4">
                    By {article.author}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {visibleArticles < filteredArticles.length && (
          <div className="flex justify-center mt-8 sm:mt-12">
            <button
              onClick={loadMoreArticles}
              className="px-2 sm:px-3 py-1 sm:py-1 bg-orange-500 text-white rounded-full font-semibold text-sm sm:text-lg shadow-md hover:bg-orange-600 transition"
            >
              See More
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
  );
}



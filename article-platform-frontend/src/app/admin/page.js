"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

const QuillEditor = dynamic(() => import("../../components/QuillEditor"), {
  ssr: false,
});

const AdminPage = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState("");
  const [authPopup, setAuthPopup] = useState(true); // For authentication popup
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [authError, setAuthError] = useState(false);

  const handleAuthSubmit = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/admin/authenticate",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(credentials),
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setAuthPopup(false); // Close the popup on successful authentication
        } else {
          setAuthError(true); // Display error message
        }
      } else {
        setAuthError(true);
      }
    } catch (error) {
      console.error("Error during authentication:", error);
      setAuthError(true);
    }
  };

  const handleSubmit = async () => {
    if (!title || !content) {
      alert("All fields are required.");
      return;
    }

    const storyData = {
      title,
      content,
      author: "Admin",
    };

    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/stories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(storyData),
      });

      if (response.ok) {
        setNotification("Story published successfully!");
        setTimeout(() => setNotification(""), 3000); // Clear notification after 3 seconds
        setTitle("");
        setContent("");
      } else {
        alert("Failed to publish story.");
      }
    } catch (error) {
      console.error("Error publishing story:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 p-6">
      {/* Authentication Popup */}
      {authPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Admin Login
            </h2>
            {authError && (
              <p className="text-sm text-red-500 mb-4">
                Invalid credentials. Please try again.
              </p>
            )}
            <input
              type="text"
              placeholder="Username"
              value={credentials.username}
              onChange={(e) =>
                setCredentials({ ...credentials, username: e.target.value })
              }
              className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
            <input
              type="password"
              placeholder="Password"
              value={credentials.password}
              onChange={(e) =>
                setCredentials({ ...credentials, password: e.target.value })
              }
              className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
            <button
              onClick={handleAuthSubmit}
              className="w-full bg-orange-500 text-white py-2 rounded-lg font-semibold hover:bg-orange-600 transition"
            >
              Login
            </button>
          </div>
        </div>
      )}

      {!authPopup && (
        <>
          {notification && (
            <div className="fixed top-5 left-1/2 transform -translate-x-1/2 z-50">
              <div className="bg-green-500 text-white py-2 px-6 rounded-lg shadow-md">
                {notification}
              </div>
            </div>
          )}

          <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8">
            <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
              Admin - Publish a Story
            </h1>

            {/* Title Input */}
            <div>
              <label
                htmlFor="title"
                className="block text-lg font-semibold text-gray-700"
              >
                Title
              </label>
              <input
                id="title"
                type="text"
                placeholder="Enter story title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>

            {/* Content Editor */}
            <div className="mt-6">
              <label
                htmlFor="content"
                className="block text-lg font-semibold text-gray-700"
              >
                Content
              </label>
              <div className="mt-2">
                <QuillEditor setContent={setContent} />
              </div>
            </div>

            {/* Publish Button */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`mt-6 w-full py-3 rounded-lg text-white font-semibold ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-orange-500 hover:bg-orange-600"
              } transition`}
            >
              {loading ? "Publishing..." : "Publish Story"}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminPage;

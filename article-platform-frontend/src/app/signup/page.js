"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiBaseUrl } from "../../utils/api";

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false); // Loading state
  const router = useRouter();
  const [notification, setNotification] = useState(""); // State for notification
  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => {
      setNotification(""); // Clear notification after 2 seconds
    }, 2000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Remove spaces for both 'username' and 'name'
    if (name === "username" || name === "name") {
      setFormData({ ...formData, [name]: value.replace(/\s/g, "") });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    setLoading(true); // Enable loading indicator

    try {
      const res = await fetch(`${apiBaseUrl}/api/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        router.push("/interests?username=" + formData.username);
        showNotification("Account created successfully");
      } else {
        const errorData = await res.json();
        alert(errorData.message || "Failed to sign up");
      }
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false); // Disable loading indicator in case of error
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-orange-100 to-pink-100">
      {/* Header Section */}
      <header className="bg-gradient-to-r from-orange-500 to-pink-500 text-white py-4">
        <div className="container mx-auto flex justify-between items-center px-4">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md">
              <span className="text-orange-500 text-xl font-bold">sA</span>
            </div>
            <h1 className="text-lg sm:text-xl font-extrabold">SimpleArticle</h1>
          </div>
        </div>
      </header>

      {/* Notification */}
      {notification && (
        <div className="fixed top-5 left-1/2 transform -translate-x-1/2 bg-green-500 text-white py-2 px-4 rounded-lg shadow-lg text-sm z-50">
          {notification}
        </div>
      )}

      {/* Main Content */}
      <div className="flex-grow flex items-center justify-center relative px-4">
        <div className="absolute inset-0 z-0">
          <svg
            className="w-full h-full"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 800 600"
          >
            <g fill="none" stroke="rgba(255, 255, 255, 0.5)" strokeWidth="2">
              <circle cx="400" cy="300" r="200" />
              <circle cx="400" cy="300" r="300" />
              <circle cx="400" cy="300" r="400" />
            </g>
          </svg>
        </div>
        <form
          onSubmit={handleSubmit}
          className="relative z-10 w-full max-w-md p-8 bg-white rounded-xl shadow-lg transform transition duration-500 hover:scale-105 sm:p-10 lg:p-12"
        >
          <h2 className="text-3xl font-extrabold text-center text-gray-800 sm:text-4xl md:text-5xl mb-6">
            Join Our Community
          </h2>
          <p className="text-sm text-center text-gray-500 sm:text-base mb-8">
            Start your journey by creating an account
          </p>
          <div className="space-y-4">
            <input
              name="name"
              placeholder="Nick name"
              onChange={handleChange}
              required
              className="w-full px-4 py-3 text-gray-700 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300 shadow-sm"
            />
            <input
              name="username"
              placeholder="Username"
              onChange={handleChange}
              required
              className="w-full px-4 py-3 text-gray-700 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300 shadow-sm"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleChange}
              required
              className="w-full px-4 py-3 text-gray-700 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300 shadow-sm"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              required
              className="w-full px-4 py-3 text-gray-700 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300 shadow-sm"
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              onChange={handleChange}
              required
              className="w-full px-4 py-3 text-gray-700 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300 shadow-sm"
            />
          </div>
          <button
            type="submit"
            className={`w-full py-3 mt-6 text-white rounded-lg focus:outline-none focus:ring-4 focus:ring-orange-300 font-semibold shadow-lg transition ${
              loading
                ? "bg-orange-300 cursor-not-allowed"
                : "bg-orange-400 hover:bg-orange-500"
            }`}
            disabled={loading}
          >
            {loading ? (
              <span className="flex justify-center items-center">
                <svg
                  className="animate-spin h-5 w-5 mr-3 text-white"
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
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  ></path>
                </svg>
                Processing...
              </span>
            ) : (
              "Sign Up"
            )}
          </button>
          <p className="mt-6 text-sm text-center text-gray-500 sm:text-base">
            Already have an account?{" "}
            <a href="/login" className="text-orange-500 hover:underline">
              Log in
            </a>
          </p>
        </form>
      </div>

      {/* Footer Section */}
      <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-10">
        <div className="container mx-auto px-6 md:px-10 lg:px-16">
          {/* Top Section */}
          <div className="flex flex-col lg:flex-row justify-between items-center border-b border-gray-700 pb-6">
            <div className="text-center lg:text-left mb-6 lg:mb-0">
              <h2 className="text-2xl font-extrabold">SimpleArticle</h2>
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



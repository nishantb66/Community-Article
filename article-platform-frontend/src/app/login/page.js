"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiBaseUrl } from "../../utils/api";
import { motion } from "framer-motion";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false); // State for loader
  const [successMessage, setSuccessMessage] = useState(""); // State for success message
  const [notification, setNotification] = useState(""); // State for notification
  const router = useRouter();

  const handleChange = (e) => {
    const value = e.target.value.replace(/\s/g, ""); // Remove all spaces
    setFormData({ ...formData, [e.target.name]: value });
  };

    const showNotification = (message) => {
      setNotification(message);
      setTimeout(() => {
        setNotification(""); // Clear notification after 2 seconds
      }, 2000);
    };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start the loader
    setSuccessMessage(""); // Clear any previous success message
    try {
      const response = await fetch(`${apiBaseUrl}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        if (typeof window !== "undefined") {
          // Check if window is defined
          localStorage.setItem("token", data.token);
          localStorage.setItem("userId", data.userId);
          localStorage.setItem("userName", data.name);
          localStorage.setItem("isVerified", data.isVerified);
        }

        // Show success message
        showNotification("You are successfully logged in!");
        setTimeout(() => {
          router.push("/");
        }, 2000); // Redirect after 2 seconds
      } else {
        const errorData = await response.json();
        alert(errorData.error || "Login failed.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("An error occurred.");
    } finally {
      setLoading(false); // Stop the loader
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
          <h2 className="mb-6 text-3xl font-bold text-center text-gray-800 sm:text-4xl lg:text-5xl">
            Welcome Back
          </h2>
          <p className="mb-6 text-sm text-center text-gray-500 sm:text-base lg:text-lg">
            Login to continue exploring
          </p>
          <div className="space-y-4">
            <input
              name="username"
              placeholder="Username"
              onChange={handleChange}
              required
              className="w-full px-4 py-2 text-gray-700 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300 sm:text-base lg:text-lg"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              required
              className="w-full px-4 py-2 text-gray-700 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300 sm:text-base lg:text-lg"
            />
          </div>
          <button
            type="submit"
            disabled={loading} // Disable button while loading
            className={`w-full py-3 mt-6 text-white bg-orange-500 rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-4 focus:ring-orange-300 sm:text-base lg:text-lg ${
              loading ? "cursor-not-allowed bg-orange-300" : ""
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center space-x-2">
                <svg
                  className="w-5 h-5 text-white animate-spin"
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
                <span>Logging in...</span>
              </div>
            ) : (
              "Login"
            )}
          </button>
          {successMessage && (
            <p className="mt-4 text-sm text-center text-green-600 sm:text-base lg:text-lg">
              {successMessage}
            </p>
          )}
          <p className="mt-4 text-sm text-center text-gray-500 sm:text-base lg:text-lg">
            Don’t have an account?{" "}
            <a href="/signup" className="text-orange-500 hover:underline">
              Sign Up
            </a>
          </p>
          {/* Add Forgot Password/Username Link */}
          <p className="mt-4 text-sm text-center text-gray-500 sm:text-base lg:text-lg">
            Forgot your password or username?{" "}
            <a
              href="https://tripetto.app/run/QJU4ZLEJTY"
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-500 hover:underline"
            >
              Reset
            </a>
          </p>
          {/* Link for Email Verification */}
          <p className="mt-4 text-sm text-center text-gray-500 sm:text-base lg:text-lg">
            Haven’t verified your email?{" "}
            <a
              onClick={() => router.push("/otp-verification")}
              className="text-blue-500 hover:underline cursor-pointer"
            >
              Verify Now
            </a>
          </p>
          <p className="mt-4 text-sm text-center text-gray-500 sm:text-base lg:text-lg">
            <a
              onClick={() => router.push("/")}
              className="cursor-pointer text-orange-500 hover:underline"
            >
              Go to Home
            </a>
          </p>
        </form>
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



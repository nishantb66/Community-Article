"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiBaseUrl } from "../../utils/api";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false); // State for loader
  const [successMessage, setSuccessMessage] = useState(""); // State for success message
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
        }

        // Show success message
        setSuccessMessage("Logged in");
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
    <div className="flex items-center justify-center min-h-screen px-4 bg-gradient-to-br from-orange-100 to-pink-100 sm:px-6 lg:px-8">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg sm:p-10 lg:p-12"
      >
        <h2 className="mb-6 text-2xl font-bold text-center text-gray-800 sm:text-3xl lg:text-4xl">
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
          className={`w-full py-2 mt-6 text-white bg-orange-400 rounded-lg hover:bg-orange-500 focus:outline-none focus:ring-4 focus:ring-orange-300 sm:text-base lg:text-lg ${
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
      </form>
    </div>
  );
}


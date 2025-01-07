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
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "username" && name === "name") {
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
    try {
      const res = await fetch(`${apiBaseUrl}/api/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        router.push("/interests?username=" + formData.username);
      } else {
        const errorData = await res.json();
        alert(errorData.message || "Failed to sign up");
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-100 to-pink-100 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-40 h-40 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
      <div className="absolute top-0 right-0 w-60 h-60 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-0 left-0 w-60 h-60 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>

      {/* Form Container */}
      <form
        onSubmit={handleSubmit}
        className="relative z-10 w-full max-w-lg p-8 bg-white shadow-2xl rounded-3xl sm:p-10 md:p-12"
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
          className="w-full py-3 mt-6 text-white bg-orange-400 rounded-lg hover:bg-orange-500 focus:outline-none focus:ring-4 focus:ring-orange-300 font-semibold shadow-lg transition"
        >
          Sign Up
        </button>
        <p className="mt-6 text-sm text-center text-gray-500 sm:text-base">
          Already have an account?{" "}
          <a href="/login" className="text-orange-500 hover:underline">
            Log in
          </a>
        </p>
      </form>

      {/* Additional Animation */}
      <div className="absolute -top-10 -right-10 w-96 h-96 bg-orange-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-6000"></div>
    </div>
  );
}


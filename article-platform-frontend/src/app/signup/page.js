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
    if (name === "username") {
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
    <div className="flex items-center justify-center min-h-screen px-4 bg-gradient-to-br from-orange-100 to-pink-100">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg p-6 space-y-6 bg-white rounded-lg shadow-lg sm:p-8 md:p-10"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800 sm:text-3xl md:text-4xl">
          Create an Account
        </h2>
        <div className="space-y-4">
          <input
            name="name"
            placeholder="Name"
            onChange={handleChange}
            required
            className="w-full px-4 py-2 text-gray-700 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300"
          />
          <input
            name="username"
            placeholder="Username"
            onChange={handleChange}
            required
            className="w-full px-4 py-2 text-gray-700 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
            className="w-full px-4 py-2 text-gray-700 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
            className="w-full px-4 py-2 text-gray-700 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300"
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            onChange={handleChange}
            required
            className="w-full px-4 py-2 text-gray-700 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300"
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 mt-4 text-white bg-orange-400 rounded-lg hover:bg-orange-500 focus:outline-none focus:ring-4 focus:ring-orange-300"
        >
          Sign Up
        </button>
        <p className="text-sm text-center text-gray-500 sm:text-base">
          Already have an account?{" "}
          <a href="/login" className="text-orange-500 hover:underline">
            Log in
          </a>
        </p>
      </form>
    </div>
  );
}


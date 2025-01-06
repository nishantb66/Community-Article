"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { apiBaseUrl } from "../../utils/api";

export default function InterestsPage() {
  const [domains, setDomains] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const username = searchParams.get("username");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${apiBaseUrl}/api/interests`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, domains: domains.split(",") }),
      });
      if (res.ok) {
        router.push("/login");
      } else {
        const errorData = await res.json();
        alert(errorData.error || "Failed to update interests");
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-gradient-to-br from-orange-100 to-pink-100 sm:px-6 lg:px-8">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg p-8 bg-white rounded-lg shadow-lg sm:p-10 lg:p-12"
      >
        <h2 className="mb-6 text-3xl font-bold text-center text-gray-800 sm:text-4xl lg:text-5xl">
          What Interests You?
        </h2>
        <p className="mb-6 text-sm text-center text-gray-500 sm:text-base lg:text-lg">
          Enter your favorite domains to customize your experience.
        </p>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="e.g., Technology, Sports, Education"
            value={domains}
            onChange={(e) => setDomains(e.target.value)}
            required
            className="w-full px-4 py-2 text-gray-700 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300 sm:text-base lg:text-lg"
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 mt-6 text-white bg-orange-400 rounded-lg hover:bg-orange-500 focus:outline-none focus:ring-4 focus:ring-orange-300 sm:text-base lg:text-lg"
        >
          Submit
        </button>
      </form>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";

export default function DeleteRequest() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [articleTitle, setArticleTitle] = useState("");
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
   var _mtm = window._mtm = window._mtm || [];
   _mtm.push({'mtm.startTime': (new Date().getTime()), 'event': 'mtm.Start'});
   var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
   g.async=true; g.src='https://cdn.matomo.cloud/simplearticlesspace.matomo.cloud/container_3s7vGxHg.js'; s.parentNode.insertBefore(g,s);
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !articleTitle || !reason) {
      setMessage("All fields are required.");
      return;
    }

    const mailtoLink = `mailto:nishantbaruah3@gmail.com?subject=Delete Request for Article: ${encodeURIComponent(
      articleTitle
    )}&body=${encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\nReason for Deletion:\n${reason}`
    )}`;

    // Open the user's email client with pre-filled email
    window.location.href = mailtoLink;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 to-pink-100 py-10 px-6 flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-md w-full">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">
          Request to Delete an Article
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Your Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:outline-none"
              placeholder="Enter your name"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Your Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:outline-none"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Article Title
            </label>
            <input
              type="text"
              value={articleTitle}
              onChange={(e) => setArticleTitle(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:outline-none"
              placeholder="Enter the article title"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Reason for Deletion
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:outline-none resize-none"
              rows="4"
              placeholder="Enter the reason for deletion"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-orange-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-orange-600 transition"
          >
            Submit Request
          </button>
        </form>
        {message && (
          <p
            className={`mt-4 text-center ${
              message.includes("required") ? "text-red-500" : "text-green-500"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

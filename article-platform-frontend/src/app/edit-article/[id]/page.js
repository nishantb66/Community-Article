"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion"; // Note: You'll need to install framer-motion

const QuillEditor = dynamic(() => import("../../../components/QuillEditor"), {
  ssr: false,
});

export default function EditArticle() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [showPopup, setShowPopup] = useState(true);
  const router = useRouter();
  const { id } = useParams();

  // Existing useEffect for fetching article
  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await fetch(
          `https://community-article-backend.onrender.com/api/articles/${id}`
        );
        if (response.ok) {
          const article = await response.json();
          const currentUsername = localStorage.getItem("userName");

          if (article.author !== currentUsername) {
            router.push("/");
            return;
          }

          setTitle(article.title);
          setContent(article.content);
          setIsAuthorized(true);
        } else {
          router.push("/");
        }
      } catch (error) {
        console.error("Error fetching article:", error);
        router.push("/");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchArticle();
    }
  }, [id, router]);

  const handleUpdate = async () => {
    const cleanedContent = content.replace(/<[^>]*>/g, "").trim();

    if (!title || !cleanedContent) {
      alert("All fields are required!");
      return;
    }

    const username = localStorage.getItem("userName");
    if (!username) {
      alert("You must be logged in to edit an article.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`https://community-article-backend.onrender.com/api/articles/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": localStorage.getItem("userId"),
        },
        body: JSON.stringify({
          title,
          content,
          author: username,
        }),
      });

      if (response.ok) {
        setNotification(true);
        setTimeout(() => {
          setNotification(false);
          router.push("/my-articles");
        }, 2000);
      } else {
        alert("Failed to update article.");
      }
    } catch (error) {
      console.error("Error updating article:", error);
      alert("Error updating article.");
    } finally {
      setLoading(false);
    }
  };

  // Popup component with animation
  const InstructionPopup = () => (
    <AnimatePresence>
      {showPopup && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm"
        >
          <motion.div
            initial={{ y: -50 }}
            animate={{ y: 0 }}
            exit={{ y: 50 }}
            className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full"
          >
            <div className="text-center">
              <div className="mb-4">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1 }}
                  className="inline-block text-3xl mb-2"
                >
                  ✏️
                </motion.div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  Edit Instructions
                </h3>
                <p className="text-gray-600">
                  Copy your article content and paste it in this edit text box
                  to make changes and republish it.
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowPopup(false)}
                className="bg-orange-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
              >
                Got it!
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl font-semibold text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return (
    <div className="bg-gradient-to-br from-orange-50 to-pink-100 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      {/* Success Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-5 left-1/2 transform -translate-x-1/2 z-50"
          >
            <div className="bg-green-500 text-white py-2 px-6 rounded-lg shadow-md flex items-center">
              <div className="mr-2 text-lg font-semibold">✔</div>
              <span>Article updated successfully!</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Instruction Popup */}
      <InstructionPopup />

      <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-xl overflow-hidden">
        <div className="bg-gradient-to-r from-orange-400 to-pink-400 py-8 px-6 text-white text-center">
          <h1 className="text-3xl font-bold">Edit Your Article</h1>
        </div>

        <div className="p-8 space-y-6">
          <div>
            <label
              htmlFor="title"
              className="block text-lg font-medium text-gray-700"
            >
              Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 text-base"
            />
          </div>
          <div>
            <label
              htmlFor="content"
              className="block text-lg font-medium text-gray-700"
            >
              Content
            </label>
            <div className="mt-2">
              <QuillEditor setContent={setContent} initialContent={content} />
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleUpdate}
            disabled={loading}
            className={`w-full py-3 rounded-lg text-lg font-semibold text-white ${
              loading
                ? "bg-orange-300 cursor-not-allowed"
                : "bg-orange-500 hover:bg-orange-600 transition"
            } shadow-lg`}
          >
            {loading ? "Updating..." : "Update Article"}
          </motion.button>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Quill from "quill";
import "quill/dist/quill.snow.css"; // Import Quill styles

const CreateArticle = () => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [notification, setNotification] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const editorRef = useRef(null);
  const quillInstance = useRef(null);

  useEffect(() => {
    if (editorRef.current) {
      // Initialize Quill editor
      quillInstance.current = new Quill(editorRef.current, {
        theme: "snow",
        placeholder: "Start writing your article...",
        modules: {
          toolbar: [
            [{ header: [1, 2, 3, false] }],
            ["bold", "italic", "underline", "strike"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["link", "image", "blockquote", "code-block"],
            ["clean"],
          ],
        },
      });
    }
  }, []);

  const handleSubmit = async () => {
    const content = quillInstance.current?.root.innerHTML || ""; // Get editor content

    if (!title || !content.trim() || !author) {
      alert("All fields are required!");
      return;
    }

    const formData = { title, content, author };

    setLoading(true);

    try {
      const response = await fetch("https://community-article-backend.onrender.com/api/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        setTitle("");
        quillInstance.current.root.innerHTML = ""; // Clear the editor
        setAuthor("");
        setNotification(true);

        setTimeout(() => {
          setNotification(false);
          router.push(`/article/${data._id}`);
        }, 3000);
      } else {
        alert("Failed to create article.");
      }
    } catch (err) {
      console.error(err);
      alert("Error creating article.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-orange-100 to-pink-100 min-h-screen py-10 px-6">
      {/* Notification */}
      {notification && (
        <div className="fixed top-5 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-green-500 text-white py-2 px-6 rounded-lg shadow-md flex items-center">
            <div className="mr-2 text-lg font-semibold">✔</div>
            <span>Article published successfully!</span>
          </div>
        </div>
      )}

      <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-xl overflow-hidden">
        <div className="bg-gradient-to-r from-orange-400 to-pink-400 py-6 px-8 text-white">
          <h1 className="text-2xl font-bold text-center">
            Write Anonymously or with Attribution
          </h1>
        </div>
        <div className="p-8">
          <div className="space-y-6">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700"
              >
                Title
              </label>
              <input
                id="title"
                type="text"
                placeholder="Enter a catchy title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 text-lg"
              />
            </div>
            <div>
              <label
                htmlFor="content"
                className="block text-sm font-medium text-gray-700"
              >
                Content
              </label>
              {/* Quill Editor */}
              <div
                id="editor"
                ref={editorRef}
                className="mt-2 h-64 border border-gray-300 rounded-md shadow-sm"
              ></div>
            </div>
            <div>
              <label
                htmlFor="author"
                className="block text-sm font-medium text-gray-700"
              >
                Your Name
              </label>
              <input
                id="author"
                type="text"
                placeholder="Your name"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 text-lg"
              />
            </div>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`w-full py-3 rounded-md text-lg font-semibold text-white ${
                loading
                  ? "bg-orange-300 cursor-not-allowed"
                  : "bg-orange-500 hover:bg-orange-600 transition"
              } shadow-md`}
            >
              {loading ? "Publishing..." : "Publish Article"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateArticle;



"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const StoriesPage = () => {
  const [stories, setStories] = useState([]);
  const router = useRouter();

  useEffect(() => {
    async function fetchStories() {
      try {
        const response = await fetch("https://community-article-backend.onrender.com/api/stories");
        const data = await response.json();
        setStories(data);
      } catch (err) {
        console.error("Error fetching stories:", err);
      }
    }

    fetchStories();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-orange-100 p-6">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
        Stories by SimpleArticles
      </h1>
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stories.map((story) => (
          <div
            key={story._id}
            className="bg-white shadow-lg rounded-lg overflow-hidden p-6"
          >
            <h2 className="text-xl font-bold text-gray-800">{story.title}</h2>
            <p className="text-sm text-gray-600 mt-2">{story.author}</p>
            <div
              className="text-gray-700 mt-4 text-sm sm:text-base line-clamp-3"
              dangerouslySetInnerHTML={{
                __html: story.content.slice(0, 120), // Display first 120 characters
              }}
            ></div>
            <button
              className="mt-4 text-orange-500 hover:underline"
              onClick={() => router.push(`/story/${story._id}`)} // Redirect to story details page
            >
              Read More
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StoriesPage;

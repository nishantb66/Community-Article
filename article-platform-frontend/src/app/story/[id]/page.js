"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

const StoryDetails = () => {
  const { id } = useParams();
  const [story, setStory] = useState(null);

  useEffect(() => {
    async function fetchStoryDetails() {
      try {
        const response = await fetch(`https://community-article-backend.onrender.com/api/stories/${id}`);
        const data = await response.json();
        setStory(data);
      } catch (err) {
        console.error("Error fetching story details:", err);
      }
    }

    if (id) fetchStoryDetails();
  }, [id]);

  if (!story) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-pink-50 to-orange-100">
        <p className="text-lg text-gray-700">Loading story...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-orange-100 p-6">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-4xl font-bold text-gray-800">{story.title}</h1>
        <p className="text-sm text-gray-600 mt-2">By {story.author}</p>
        <div
          className="text-gray-700 mt-6 text-lg"
          dangerouslySetInnerHTML={{ __html: story.content }}
        ></div>
      </div>
    </div>
  );
};

export default StoryDetails;

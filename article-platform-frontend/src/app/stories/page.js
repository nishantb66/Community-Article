"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const StoriesPage = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchStories() {
      try {
        const response = await fetch("https://community-article-backend.onrender.com/api/stories");
        const data = await response.json();
        setStories(data);
      } catch (err) {
        console.error("Error fetching stories:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchStories();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-pink-50 to-orange-100">
      {/* Header Section */}
      <header className="py-10 text-center">
        <h1 className="text-4xl font-extrabold text-gray-800">
          Stories by SimpleArticles
        </h1>
        <p className="mt-2 text-gray-600">
          Explore inspiring stories from the community
        </p>
        <p className="mt-4 text-orange-600 font-medium">
          More latest articles and stories on various topics will be coming
          soon. Stay tuned!
        </p>
      </header>

      {/* Content Section */}
      {loading ? (
        <div className="flex justify-center items-center flex-grow">
          <div className="flex space-x-2">
            <div className="w-5 h-5 bg-orange-500 rounded-full animate-pulse"></div>
            <div className="w-5 h-5 bg-orange-500 rounded-full animate-pulse delay-200"></div>
            <div className="w-5 h-5 bg-orange-500 rounded-full animate-pulse delay-400"></div>
          </div>
        </div>
      ) : (
        <main className="flex-grow container mx-auto px-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {stories.map((story) => (
            <div
              key={story._id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition duration-300 overflow-hidden"
            >
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-800 truncate">
                  {story.title}
                </h2>
                <p className="mt-2 text-sm text-gray-600">By {story.author}</p>
                <div
                  className="mt-4 text-gray-700 text-sm line-clamp-3"
                  dangerouslySetInnerHTML={{
                    __html: story.content.slice(0, 120),
                  }}
                ></div>
                <button
                  onClick={() => router.push(`/story/${story._id}`)}
                  className="mt-4 text-orange-500 font-semibold hover:underline"
                >
                  Read More
                </button>
              </div>
            </div>
          ))}
        </main>
      )}

      {/* Footer Section */}
      <footer className="bg-gray-900 text-white py-10 mt-12">
        <div className="container mx-auto px-6 md:px-10 lg:px-16">
          <div className="flex flex-col lg:flex-row justify-between items-center border-b border-gray-700 pb-6">
            <div className="text-center lg:text-left mb-6 lg:mb-0">
              <h2 className="text-2xl font-extrabold">SimpleArticle</h2>
              <p className="mt-2 text-sm text-gray-400">
                Building a better future, one article at a time.
              </p>
            </div>
            <div className="flex space-x-6">
              <a
                href="mailto:nishantbarua3@gmail.com"
                className="text-orange-400 hover:text-orange-500 transition duration-300 text-sm"
              >
                Email
              </a>
              <a
                href="https://www.linkedin.com/in/nishantbaru/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-400 hover:text-orange-500 transition duration-300 text-sm"
              >
                LinkedIn
              </a>
              <a
                href="https://nishantb66.github.io/MyPortfolio/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-400 hover:text-orange-500 transition duration-300 text-sm"
              >
                Portfolio
              </a>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center mt-6">
            <p className="text-xs text-gray-500 text-center md:text-left">
              © {new Date().getFullYear()} Nishant Baruah. All rights reserved.
            </p>
            <p className="text-xs text-gray-500 text-center md:text-right mt-4 md:mt-0">
              Developed and Designed by Nishant Baruah.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default StoriesPage;

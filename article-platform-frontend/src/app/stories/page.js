"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const StoriesPage = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const response = await fetch("https://community-article-backend.onrender.com/api/stories/all");
        const data = await response.json();
        setStories(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching stories:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStories();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-orange-50">
      {/* Header Section */}
      <header className="py-12 px-4 text-center">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight">
          Stories by SimpleArticles
        </h1>
        <p className="mt-4 text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
          Explore inspiring stories from the community
        </p>
        <div className="mt-6 inline-block px-4 py-2 bg-orange-50 border border-orange-200 rounded-lg">
          <p className="text-orange-600 font-medium">
            More latest articles and stories coming soon. Stay tuned!
          </p>
        </div>
      </header>

      {/* Content Section */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {!stories.length ? (
            <div className="text-center py-12">
              <p className="text-gray-600">
                No stories available at the moment.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {stories.map((story) => (
                <article
                  key={story._id}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden group"
                >
                  <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <time className="text-sm font-medium text-orange-500 bg-orange-50 px-3 py-1 rounded-full">
                        {new Date(story.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </time>
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-400 to-pink-400 flex items-center justify-center">
                          <span className="text-white font-medium text-sm">
                            {story.author?.charAt(0) || "A"}
                          </span>
                        </div>
                        <span className="text-sm text-gray-600 font-medium">
                          {story.author || "Anonymous"}
                        </span>
                      </div>
                    </div>

                    <h2
                      onClick={() => router.push(`/story/${story._id}`)}
                      className="text-xl font-bold text-gray-900 cursor-pointer group-hover:text-orange-500 transition-colors duration-300"
                    >
                      {story.title}
                    </h2>

                    <div
                      className="prose prose-sm text-gray-600 line-clamp-3"
                      dangerouslySetInnerHTML={{
                        __html: story.content?.slice(0, 150) + "..." || "",
                      }}
                    />

                    <div className="flex items-center justify-between pt-4 border-t">
                      <button
                        onClick={() => router.push(`/story/${story._id}`)}
                        className="text-gray-600 hover:text-orange-500 transition-colors duration-300"
                      >
                        Read More
                      </button>

                      <button
                        onClick={() => router.push(`/story/${story._id}`)}
                        className="inline-flex items-center px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-full transition-colors duration-300"
                      >
                        View Story
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </main>
      )}

      {/* Footer Section */}
      <footer className="bg-gray-900 mt-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Brand Section */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">
                simpleArticle
              </h2>
              <p className="text-gray-400 text-sm">
                Building a better future, one article at a time. Join our
                community of knowledge seekers.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">
                Quick Links
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <a
                  href="mailto:nishantbarua3@gmail.com"
                  className="text-gray-400 hover:text-orange-400 text-sm transition-colors"
                >
                  Email
                </a>
                <a
                  href="https://www.linkedin.com/in/nishantbaru/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-orange-400 text-sm transition-colors"
                >
                  LinkedIn
                </a>
                <a
                  href="https://nishantb66.github.io/MyPortfolio/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-orange-400 text-sm transition-colors"
                >
                  Portfolio
                </a>
              </div>
            </div>

            {/* Social Links */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">
                Stay Connected
              </h3>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="p-2 bg-gray-800 rounded-full text-orange-400 hover:bg-gray-700 transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="p-2 bg-gray-800 rounded-full text-orange-400 hover:bg-gray-700 transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.6.113.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-12 pt-8 border-t border-gray-800">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-400 text-sm">
                © {new Date().getFullYear()} Nishant Baruah. All rights
                reserved.
              </p>
              <div className="flex items-center space-x-4 text-sm text-gray-400">
                <span className="hover:text-orange-400 cursor-pointer transition-colors">
                  Privacy Policy
                </span>
                <span className="text-gray-700">•</span>
                <span className="hover:text-orange-400 cursor-pointer transition-colors">
                  Terms of Service
                </span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default StoriesPage;

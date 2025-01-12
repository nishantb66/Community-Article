"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { apiBaseUrl } from "../../utils/api";
import { motion } from "framer-motion";

export default function CommunityPage() {
  const [discussions, setDiscussions] = useState([]);
  const [newDiscussion, setNewDiscussion] = useState({ title: "", body: "" });
  const [loading, setLoading] = useState(false);

  const fetchDiscussions = async () => {
    try {
      const response = await fetch(`${apiBaseUrl}/api/community/all`);
      if (response.ok) {
        const data = await response.json();
        setDiscussions(data);
      } else {
        console.error("Failed to fetch discussions.");
      }
    } catch (error) {
      console.error("Error fetching discussions:", error);
    }
  };

  const handleCreateDiscussion = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("You must be logged in to create a discussion.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${apiBaseUrl}/api/community/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newDiscussion, userId }),
      });

      if (response.ok) {
        setNewDiscussion({ title: "", body: "" });
        fetchDiscussions();
      } else {
        console.error("Failed to create discussion.");
      }
    } catch (error) {
      console.error("Error creating discussion:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiscussions();
  }, []);

 return (
   <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
     {/* Modern Header */}
     <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-10 shadow-sm">
       <div className="relative">
         <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-orange-600/10" />
         <div className="container mx-auto px-4 py-6 relative">
           <h1 className="text-2xl md:text-3xl font-bold text-gray-900 text-center">
             Discussion Forum
           </h1>
           <p className="text-center text-gray-600 mt-2 max-w-2xl mx-auto">
             Share ideas, ask questions, and connect with the community
           </p>
         </div>
       </div>
       <nav className="container mx-auto px-4 py-2 flex justify-end">
         <Link
           href="/guidelines"
           className="inline-flex items-center px-4 py-2 text-sm text-gray-700 hover:text-orange-600 transition-colors"
         >
           <svg
             className="w-4 h-4 mr-2"
             fill="none"
             stroke="currentColor"
             viewBox="0 0 24 24"
           >
             <path
               strokeLinecap="round"
               strokeLinejoin="round"
               strokeWidth="2"
               d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
             />
           </svg>
           Guidelines
         </Link>
       </nav>
     </header>

     <main className="container mx-auto px-4 py-8 max-w-5xl">
       {/* Create Discussion Section */}
       <section className="mb-12 bg-white rounded-2xl shadow-sm border border-gray-100 hover:border-orange-100 transition-colors p-6 md:p-8">
         <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">
           Start a New Discussion
         </h2>
         <div className="space-y-4 max-w-3xl mx-auto">
           <input
             type="text"
             placeholder="What's on your mind?"
             value={newDiscussion.title}
             onChange={(e) =>
               setNewDiscussion({ ...newDiscussion, title: e.target.value })
             }
             className="w-full px-4 py-3 text-gray-900 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
           />
           <textarea
             placeholder="Share your thoughts in detail..."
             rows="4"
             value={newDiscussion.body}
             onChange={(e) =>
               setNewDiscussion({ ...newDiscussion, body: e.target.value })
             }
             className="w-full px-4 py-3 text-gray-900 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all resize-none"
           />
           <div className="text-right">
             <button
               onClick={handleCreateDiscussion}
               disabled={loading}
               className="px-6 py-2.5 text-white bg-orange-500 rounded-xl font-medium hover:bg-orange-600 focus:ring-4 focus:ring-orange-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
             >
               {loading ? (
                 <span className="inline-flex items-center">
                   <svg
                     className="w-4 h-4 animate-spin mr-2"
                     viewBox="0 0 24 24"
                   >
                     <circle
                       className="opacity-25"
                       cx="12"
                       cy="12"
                       r="10"
                       stroke="currentColor"
                       strokeWidth="4"
                     />
                     <path
                       className="opacity-75"
                       fill="currentColor"
                       d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                     />
                   </svg>
                   Creating...
                 </span>
               ) : (
                 "Create Discussion"
               )}
             </button>
           </div>
         </div>
       </section>

       {/* Discussions List */}
        <section className="space-y-4 sm:space-y-6 px-4 sm:px-0">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
            Recent Discussions
          </h2>
          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2">
            {discussions.map((discussion) => (
              <article
                key={discussion._id}
                className="group relative bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:border-orange-100 transition-all duration-200"
              >
                {/* Status Indicator */}
                <div className="absolute top-3 sm:top-4 right-3 sm:right-4">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                </div>
        
                {/* Title & Content */}
                <div className="mb-3 sm:mb-4">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 group-hover:text-orange-600 transition-colors mb-2">
                    {discussion.title}
                  </h3>
                  <p className="text-gray-600 text-xs sm:text-sm leading-relaxed line-clamp-2">
                    {discussion.body}
                  </p>
                </div>
        
                {/* Footer with Metadata */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-3 sm:space-y-0 pt-3 sm:pt-4 border-t border-gray-100">
                  <div className="flex items-center space-x-2 sm:space-x-3 w-full sm:w-auto">
                    <div className="flex items-center">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 text-sm">
                        {discussion.author?.username?.[0]?.toUpperCase()}
                      </div>
                      <span className="ml-2 text-xs sm:text-sm font-medium text-gray-700">
                        {discussion.author?.username}
                      </span>
                    </div>
                    <span className="text-xs sm:text-sm text-gray-500">•</span>
                    <span className="text-xs sm:text-sm text-gray-500">
                      {new Date(discussion.createdAt).toLocaleDateString()}
                    </span>
                  </div>
        
                  <Link
                    href={`/community/${discussion._id}`}
                    className="inline-flex items-center w-full sm:w-auto justify-center px-4 py-2 text-xs sm:text-sm font-medium text-orange-600 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"
                  >
                    View Discussion
                    <svg
                      className="w-3 h-3 sm:w-4 sm:h-4 ml-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
     </main>
   </div>
 );
}


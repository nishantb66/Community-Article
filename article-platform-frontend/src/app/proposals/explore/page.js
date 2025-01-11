"use client";

import { useState, useEffect } from "react";
import {
  DocumentTextIcon,
  UserCircleIcon,
  UsersIcon,
  CalendarIcon,
  EnvelopeIcon,
  PhoneIcon,
  MagnifyingGlassIcon,
  ArrowRightIcon,
  DocumentIcon,
} from "@heroicons/react/24/outline";

export default function ExploreProposalsPage() {
  const [proposals, setProposals] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeForm, setActiveForm] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
const fetchProposals = async () => {
  setIsLoading(true);
  try {
    const response = await fetch("https://community-article-backend.onrender.com/api/proposals/explore");
    const data = await response.json();
    setProposals(data);
  } catch (error) {
    console.error("Error fetching proposals:", error);
  } finally {
    setIsLoading(false);
  }
};
    fetchProposals();
  }, []);

  // Filter proposals based on search query
  const filteredProposals = proposals.filter((proposal) =>
    proposal.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRespond = async (proposalId, email, phone, message) => {
    try {
      const response = await fetch(
        "https://community-article-backend.onrender.com/api/proposals/respond",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ proposalId, email, phone, message }),
        }
      );

      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 2000);
      setActiveForm(null);
    } catch (error) {
      console.error("Error responding to proposal:", error);
    }
  };

  const LoadingSkeleton = () => (
    <div className="space-y-6">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="bg-white rounded-2xl shadow-sm border border-gray-100/50 overflow-hidden animate-pulse"
        >
          <div className="p-6 border-b border-gray-100/50">
            {/* Title Skeleton */}
            <div className="h-7 bg-gray-200 rounded-lg w-3/4 mb-4"></div>
            {/* Content Skeleton */}
            <div className="space-y-3">
              <div className="h-4 bg-gray-100 rounded w-full"></div>
              <div className="h-4 bg-gray-100 rounded w-5/6"></div>
            </div>
          </div>

          {/* Meta Info Skeleton */}
          <div className="px-6 py-4 bg-gray-50/50">
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center">
                <div className="w-5 h-5 bg-gray-200 rounded-full mr-2"></div>
                <div className="h-4 bg-gray-200 rounded w-24"></div>
              </div>
              <div className="flex items-center">
                <div className="w-5 h-5 bg-gray-200 rounded-full mr-2"></div>
                <div className="h-4 bg-gray-200 rounded w-32"></div>
              </div>
            </div>
          </div>

          {/* Action Button Skeleton */}
          <div className="p-6 flex justify-center">
            <div className="h-10 bg-gray-200 rounded-xl w-40"></div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="bg-white w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center shadow-sm">
            <DocumentTextIcon className="w-8 h-8 text-orange-500" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Explore Proposals
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover exciting projects and collaboration opportunities
          </p>
          {/* Search Bar */}
          <div className="max-w-xl mx-auto relative">
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search proposals by title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-colors bg-white/50 backdrop-blur-sm"
            />
          </div>
        </div>

        {/* Enhanced Proposals Grid with Loading State */}
        <div className="space-y-8">
          {isLoading ? (
            <LoadingSkeleton />
          ) : filteredProposals.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-gray-100/50 shadow-sm">
              <DocumentIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg mb-4">
                No proposals match your search.
              </p>
              <button
                onClick={() => setSearchQuery("")}
                className="text-orange-500 hover:text-orange-600 font-medium transition-colors"
              >
                Clear search
              </button>
            </div>
          ) : (
            filteredProposals.map((proposal) => (
              <div
                key={proposal._id}
                className="bg-white rounded-2xl shadow-sm hover:shadow-md border border-gray-100/50 overflow-hidden transition-all duration-300"
              >
                {/* Enhanced Proposal Header */}
                <div className="p-6 md:p-8 border-b border-gray-100/50">
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
                    {proposal.description}
                  </h2>
                  <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                    {proposal.details}
                  </p>
                </div>

                {/* Improved Meta Section */}
                <div className="px-6 md:px-8 py-4 bg-gray-50/80 border-b border-gray-100/50">
                  <div className="flex flex-wrap items-center gap-6">
                    <div className="flex items-center text-gray-600">
                      <UsersIcon className="w-5 h-5 mr-2 text-orange-500" />
                      <span className="font-medium">
                        {proposal.teamMembersRequired} Members Needed
                      </span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <UserCircleIcon className="w-5 h-5 mr-2 text-orange-500" />
                      <span>
                        Posted by: {proposal.userId?.name || "Unknown"}
                      </span>
                    </div>
                    {proposal.deadline && (
                      <div className="flex items-center text-gray-600">
                        <CalendarIcon className="w-5 h-5 mr-2 text-orange-500" />
                        <span>
                          Deadline:{" "}
                          {new Date(proposal.deadline).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Enhanced Response Section */}
                <div className="p-6 md:p-8">
                  {activeForm === proposal._id ? (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleRespond(
                          proposal._id,
                          e.target.email.value,
                          e.target.phone.value,
                          e.target.message.value
                        );
                      }}
                      className="space-y-6 max-w-2xl mx-auto"
                    >
                      {/* Form Fields */}
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Your Email
                          </label>
                          <div className="relative">
                            <EnvelopeIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                              name="email"
                              type="email"
                              required
                              className="w-full pl-10 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Your Phone (Optional)
                          </label>
                          <div className="relative">
                            <PhoneIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                              name="phone"
                              type="tel"
                              className="w-full pl-10 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Your Message
                          </label>
                          <textarea
                            name="message"
                            required
                            rows={4}
                            className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all resize-none"
                            placeholder="Write a brief message about why you're interested..."
                          />
                        </div>
                      </div>

                      {/* Form Actions */}
                      <div className="flex justify-end gap-4 pt-2">
                        <button
                          type="button"
                          onClick={() => setActiveForm(null)}
                          className="px-6 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-6 py-2.5 bg-orange-500 text-white rounded-xl hover:bg-orange-600 shadow-sm hover:shadow-md transition-all"
                        >
                          Submit Response
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="text-center">
                      <button
                        onClick={() => setActiveForm(proposal._id)}
                        className="inline-flex items-center px-6 py-3 bg-orange-500 text-white font-medium rounded-xl hover:bg-orange-600 shadow-sm hover:shadow-md transition-all"
                      >
                        <span>Respond to Proposal</span>
                        <ArrowRightIcon className="w-4 h-4 ml-2" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      {/* Notification Toast */}
      {showNotification && (
        <div className="fixed bottom-4 right-4 z-50 animate-fade-in">
          <div className="bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg flex items-center space-x-2">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span>Sent successfully!</span>
          </div>
        </div>
      )}
    </div>
  );
}


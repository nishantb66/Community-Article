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
} from "@heroicons/react/24/outline";

export default function ExploreProposalsPage() {
  const [proposals, setProposals] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeForm, setActiveForm] = useState(null);

  useEffect(() => {
    const fetchProposals = async () => {
      const response = await fetch(
        "https://community-article-backend.onrender.com/api/proposals/explore"
      );
      const data = await response.json();
      setProposals(data);
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

      if (response.ok) {
        setActiveForm(null);
        alert("Response submitted successfully!");
      } else {
        alert("Failed to submit response.");
      }
    } catch (error) {
      console.error("Error responding to proposal:", error);
    }
  };

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

        {/* Proposals Grid */}
        <div className="space-y-6">
          {filteredProposals.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No proposals match your search.</p>
            </div>
          ) : (
            filteredProposals.map((proposal) => (
              <div
                key={proposal._id}
                className="bg-white rounded-2xl shadow-[0_4px_20px_-4px_rgba(249,115,22,0.15)] border border-orange-100/50 overflow-hidden"
              >
                {/* Proposal Header */}
                <div className="p-6 border-b border-orange-100/50">
                  <h2 className="text-xl font-bold text-gray-900 mb-3">
                    {proposal.description}
                  </h2>
                  <p className="text-gray-600 whitespace-pre-wrap">
                    {proposal.details}
                  </p>
                </div>

                {/* Proposal Meta */}
                <div className="px-6 py-4 bg-orange-50/30 border-b border-orange-100/50">
                  <div className="flex flex-wrap gap-6">
                    <div className="flex items-center text-gray-600">
                      <UsersIcon className="w-5 h-5 mr-2 text-orange-500" />
                      <span>{proposal.teamMembersRequired} Members Needed</span>
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

                {/* Response Section */}
                <div className="p-6">
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
                      className="space-y-4 max-w-lg mx-auto"
                    >
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Your Email
                        </label>
                        <div className="relative">
                          <EnvelopeIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            name="email"
                            type="email"
                            required
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-colors"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Your Phone (Optional)
                        </label>
                        <div className="relative">
                          <PhoneIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            name="phone"
                            type="tel"
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-colors"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Your Message
                        </label>
                        <textarea
                          name="message"
                          required
                          rows={4}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-colors"
                          placeholder="Write a brief message about why you're interested..."
                        />
                      </div>

                      <div className="flex justify-center gap-4 pt-2">
                        <button
                          type="button"
                          onClick={() => setActiveForm(null)}
                          className="px-6 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-6 py-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors"
                        >
                          Submit Response
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="text-center">
                      <button
                        onClick={() => setActiveForm(proposal._id)}
                        className="inline-block px-6 py-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors"
                      >
                        Respond to Proposal
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}


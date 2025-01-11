"use client";

import { useState, useEffect } from "react";
import {
  EnvelopeIcon,
  UsersIcon,
  CalendarIcon,
  ClockIcon,
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
  UserCircleIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

export default function MyProposalsPage() {
  const [proposals, setProposals] = useState([]);
  const [editingProposal, setEditingProposal] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchProposals();
  }, []);

  const fetchProposals = async () => {
    const userId = localStorage.getItem("userId");
    const response = await fetch(
      `https://community-article-backend.onrender.com/api/proposals/my-proposals/${userId}`
    );
    const data = await response.json();
    setProposals(data);
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://community-article-backend.onrender.com/api/proposals/${editingProposal._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            description: e.target.description.value,
            details: e.target.details.value,
            deadline: e.target.deadline.value,
            teamMembersRequired: e.target.teamMembersRequired.value,
            isPaid: e.target.isPaid.checked,
          }),
        }
      );

      if (response.ok) {
        await fetchProposals();
        setEditingProposal(null);
      }
    } catch (error) {
      console.error("Error updating proposal:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (proposalId) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://community-article-backend.onrender.com/api/proposals/${proposalId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        await fetchProposals();
        setShowDeleteConfirm(null);
      }
    } catch (error) {
      console.error("Error deleting proposal:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            My Proposals
          </h1>
          <p className="text-gray-600 max-w-xl mx-auto">
            Track and manage your active proposals and their responses
          </p>
        </div>

        {/* Proposals List */}
        <div className="space-y-8">
          {proposals.map((proposal) => (
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
                <div className="flex space-x-2">
                  <button
                    onClick={() => setEditingProposal(proposal)}
                    className="p-2 text-gray-500 hover:text-orange-500 transition-colors"
                  >
                    <PencilIcon className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(proposal._id)}
                    className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Proposal Meta Info */}
              <div className="px-6 py-4 bg-orange-50/30">
                <div className="flex flex-wrap gap-6">
                  <div className="flex items-center text-gray-600">
                    <UsersIcon className="w-5 h-5 mr-2 text-orange-500" />
                    <span>{proposal.teamMembersRequired} Members Needed</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <EnvelopeIcon className="w-5 h-5 mr-2 text-orange-500" />
                    <span>{proposal.email}</span>
                  </div>
                  {proposal.deadline && (
                    <div className="flex items-center text-gray-600">
                      <CalendarIcon className="w-5 h-5 mr-2 text-orange-500" />
                      <span>
                        {new Date(proposal.deadline).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Responses Section */}
              <div className="p-6 border-t border-orange-100/50">
                <div className="flex items-center mb-4">
                  <ChatBubbleLeftRightIcon className="w-5 h-5 mr-2 text-orange-500" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    Responses ({proposal.responses.length})
                  </h3>
                </div>

                {proposal.responses.length > 0 ? (
                  <div className="space-y-4">
                    {proposal.responses.map((response, index) => (
                      <div
                        key={index}
                        className="bg-orange-50/50 p-4 rounded-xl border border-orange-100"
                      >
                        <div className="grid md:grid-cols-2 gap-3">
                          <p className="text-gray-600">
                            <span className="font-medium">Email: </span>
                            {response.email}
                          </p>
                          <p className="text-gray-600">
                            <span className="font-medium">Phone: </span>
                            {response.phone || "N/A"}
                          </p>
                        </div>
                        <p className="text-gray-600 mt-3 pt-3 border-t border-orange-100">
                          <span className="font-medium">Message: </span>
                          {response.message}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">
                    No responses received yet.
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
        {/* Edit Modal */}
        {editingProposal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Edit Proposal
              </h3>
              <form onSubmit={handleEdit} className="space-y-4">
                {/* Project Title */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Project Title
                  </label>
                  <input
                    name="description"
                    defaultValue={editingProposal.description}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  />
                </div>

                {/* Project Details */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Project Details
                  </label>
                  <textarea
                    name="details"
                    defaultValue={editingProposal.details}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  />
                </div>

                {/* Deadline & Team Size */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Project Deadline
                    </label>
                    <input
                      type="date"
                      name="deadline"
                      defaultValue={editingProposal.deadline?.split("T")[0]}
                      min={new Date().toISOString().split("T")[0]}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Team Size Needed
                    </label>
                    <input
                      name="teamMembersRequired"
                      type="number"
                      min="1"
                      defaultValue={editingProposal.teamMembersRequired}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                    />
                  </div>
                </div>

                {/* Email & Paid Status */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Contact Email
                    </label>
                    <input
                      name="email"
                      type="email"
                      defaultValue={editingProposal.email}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                    />
                  </div>
                  <label className="flex items-center space-x-3 p-4 border border-gray-200 rounded-xl">
                    <input
                      type="checkbox"
                      name="isPaid"
                      defaultChecked={editingProposal.isPaid}
                      className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                    />
                    <span className="text-gray-700">
                      This is a paid opportunity
                    </span>
                  </label>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setEditingProposal(null)}
                    className="px-6 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-6 py-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors disabled:opacity-50"
                  >
                    {isLoading ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-2xl max-w-sm w-full mx-4">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Confirm Delete
              </h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this proposal? This action
                cannot be undone.
              </p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="px-4 py-2 border border-gray-200 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(showDeleteConfirm)}
                  disabled={isLoading}
                  className="px-4 py-2 bg-red-500 text-white rounded-xl"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

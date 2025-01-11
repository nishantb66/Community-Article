"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DocumentTextIcon } from "@heroicons/react/24/outline";

export default function CreateProposalPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [formData, setFormData] = useState({
    description: "",
    details: "",
    deadline: "",
    teamMembersRequired: "",
    isPaid: false,
    email: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowConfirm(true);
  };

  const handleConfirm = async () => {
    setShowConfirm(false);
    setIsLoading(true);
    try {
      const userId = localStorage.getItem("userId");
      const response = await fetch(
        "https://community-article-backend.onrender.com/api/proposals/create",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...formData, userId }),
        }
      );

      if (response.ok) {
        setShowNotification(true);
        setTimeout(() => {
          setShowNotification(false);
          router.push("/proposals");
        }, 2000);
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Failed to create proposal.");
      }
    } catch (error) {
      console.error("Error creating proposal:", error);
      alert("Failed to create proposal. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="bg-white w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center shadow-sm">
            <DocumentTextIcon className="w-8 h-8 text-orange-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Create a Proposal
          </h1>
          <p className="text-gray-600">
            Share your project idea with the community
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-[0_4px_20px_-4px_rgba(249,115,22,0.15)] p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Project Description */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Project Title
              </label>
              <input
                name="description"
                value={formData.description}
                placeholder="Enter a clear, concise title"
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-colors"
              />
            </div>

            {/* Project Details */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Project Details
              </label>
              <textarea
                name="details"
                value={formData.details}
                placeholder="Describe your project in detail..."
                onChange={handleChange}
                required
                rows={6}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-colors"
                style={{ whiteSpace: "pre-wrap" }}
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
                  value={formData.deadline}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Team Size Needed
                </label>
                <input
                  name="teamMembersRequired"
                  type="number"
                  value={formData.teamMembersRequired}
                  min="1"
                  placeholder="Number of members"
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-colors"
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
                  value={formData.email}
                  placeholder="your@email.com"
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-colors"
                />
              </div>
              <label className="flex items-center space-x-3 p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-orange-50/50 transition-colors">
                <input
                  type="checkbox"
                  name="isPaid"
                  checked={formData.isPaid}
                  onChange={handleChange}
                  className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                />
                <span className="text-gray-700">
                  This is a paid opportunity
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-6 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-medium hover:shadow-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-100" />
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-200" />
                </div>
              ) : (
                "Create Proposal"
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl max-w-sm w-full mx-4">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Confirm Submission
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to post this proposal?
            </p>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors"
              >
                Post
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Notification */}
      {showNotification && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg">
          ✓ Posted Successfully!
        </div>
      )}
    </div>
  );
}

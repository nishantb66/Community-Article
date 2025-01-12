"use client"; // Add this directive to use client-side rendering features

import React, { useEffect, useState } from "react";

const ProfilePage = () => {
  const [profileData, setProfileData] = useState(null);
  const [showPassword, setShowPassword] = useState(false); // State for password visibility

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const userId = localStorage.getItem("userId"); // Retrieve user ID from localStorage
        const response = await fetch(
          `https://community-article-backend.onrender.com/api/${userId}`
        ); // Use native `fetch` to call the API
        const data = await response.json();
        setProfileData(data);
      } catch (error) {
        console.error("Failed to fetch profile data", error);
      }
    };

    fetchProfileData();
  }, []);

  if (!profileData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-md rounded-xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">My Profile</h1>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-shrink-0">
          <div className="w-32 h-32 bg-orange-500 text-white text-4xl font-bold flex items-center justify-center rounded-full">
            {profileData.name.charAt(0)}
          </div>
        </div>
        <div className="flex-1">
          <div className="text-lg font-medium text-gray-700 mb-2">
            <span className="text-gray-500">Name:</span> {profileData.name}
          </div>
          <div className="text-lg font-medium text-gray-700 mb-2">
            <span className="text-gray-500">Username:</span>{" "}
            {profileData.username}
          </div>
          <div className="text-lg font-medium text-gray-700 mb-2">
            <span className="text-gray-500">Email:</span> {profileData.email}
          </div>
          <div className="text-lg font-medium text-gray-700 mb-2">
            <span className="text-gray-500">Verified:</span>{" "}
            {profileData.isVerified ? (
              <span className="text-green-600">Yes</span>
            ) : (
              <span className="text-red-600">No</span>
            )}
          </div>
          <div className="text-lg font-medium text-gray-700 mb-2">
            <span className="text-gray-500">Password:</span>{" "}
            <span className="font-mono">
              {showPassword ? profileData.password : "••••••••"}
            </span>
            <button
              className="ml-4 text-sm text-blue-500 underline"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          <div className="text-lg font-medium text-gray-700">
            <span className="text-gray-500">Interests:</span>{" "}
            {profileData.interestedDomains.length > 0
              ? profileData.interestedDomains.join(", ")
              : "No interests added yet"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

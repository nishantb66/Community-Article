"use client";

import React, { useEffect, useState } from "react";

const ProfilePage = () => {
  const [profileData, setProfileData] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const response = await fetch(`https://community-article-backend.onrender.com/api/${userId}`);
        const data = await response.json();
        setProfileData(data);
      } catch (error) {
        console.error("Failed to fetch profile data", error);
      }
    };
    fetchProfileData();
  }, []);

  if (!profileData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-cover bg-center py-8 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-4xl mx-auto backdrop-blur-sm bg-white/60 rounded-2xl p-8 shadow-lg">
        {/* Profile Header */}
        <div className="relative">
          <div className="h-32 bg-gradient-to-r from-orange-400 to-pink-500 rounded-t-2xl"></div>
          <div className="relative px-6 pb-6 -mt-16">
            <div className="flex flex-col sm:flex-row items-center">
              <div>
                <div className="w-32 h-32 bg-white rounded-full p-2 shadow-lg">
                  <div className="w-full h-full bg-orange-500 rounded-full flex items-center justify-center">
                    <span className="text-4xl font-bold text-white">
                      {profileData.name.charAt(0)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-6 sm:mt-0 sm:ml-6 text-center sm:text-left">
                <h1 className="text-2xl font-bold text-gray-900">
                  {profileData.name}
                </h1>
                <p className="text-gray-900">@{profileData.username}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* Personal Information */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Personal Information
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Email
                </label>
                <p className="mt-1 text-gray-900">{profileData.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Password
                </label>
                <div className="mt-1 flex items-center">
                  <span className="font-mono text-gray-900">
                    {showPassword ? profileData.password : "••••••••"}
                  </span>
                  <button
                    className="ml-3 text-sm text-orange-500 hover:text-orange-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Account Status
                </label>
                <div className="mt-1">
                  {profileData.isVerified ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Verified
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      Unverified
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Interests */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Interests
            </h2>
            <div className="flex flex-wrap gap-2">
              {profileData.interestedDomains.length > 0 ? (
                profileData.interestedDomains.map((interest, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800"
                  >
                    {interest}
                  </span>
                ))
              ) : (
                <p className="text-gray-500">No interests added yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

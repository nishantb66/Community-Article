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
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-orange-400 to-pink-500 rounded-2xl shadow-xl">
          <div className="h-40 flex items-end pb-6 px-8">
            <div className="flex items-center gap-6">
              <div className="w-28 h-28 bg-white rounded-full p-1.5 shadow-2xl">
                <div className="w-full h-full bg-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-5xl font-bold text-white">
                    {profileData.name.charAt(0)}
                  </span>
                </div>
              </div>
              <div className="pb-2">
                <h1 className="text-3xl font-bold text-white">
                  {profileData.name}
                </h1>
                <p className="text-orange-100 text-lg">
                  @{profileData.username}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Personal Information Card */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-3">
              Personal Information
            </h2>
            <div className="space-y-5">
              <div>
                <div className="flex items-center gap-3 text-gray-600">
                  <svg
                    className="w-5 h-5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  <span className="text-sm font-medium">Email Address</span>
                </div>
                <p className="mt-1.5 text-gray-900 text-lg font-medium ml-8">
                  {profileData.email}
                </p>
              </div>

              <div>
                <div className="flex items-center gap-3 text-gray-600">
                  <svg
                    className="w-5 h-5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-sm font-medium">Password</span>
                </div>
                <div className="mt-1.5 flex items-center justify-between text-gray-900 text-lg font-medium ml-8">
                  <span className="font-mono">
                    {showPassword ? profileData.password : "••••••••"}
                  </span>
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-orange-500 hover:text-orange-600 p-1 rounded-lg"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      {showPassword ? (
                        <>
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M6 18L18 6M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </>
                      ) : (
                        <>
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </>
                      )}
                    </svg>
                  </button>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-3 text-gray-600">
                  <svg
                    className="w-5 h-5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-sm font-medium">Account Status</span>
                </div>
                <div className="mt-1.5 ml-8">
                  {profileData.isVerified ? (
                    <span className="inline-flex items-center px-4 py-2 rounded-full bg-green-50 text-green-700 text-sm font-medium">
                      Verified Account
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-4 py-2 rounded-full bg-red-50 text-red-700 text-sm font-medium">
                      Unverified Account
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Interests Card */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-3">
              Areas of Interest
            </h2>
            <div className="flex flex-wrap gap-3">
              {profileData.interestedDomains.length > 0 ? (
                profileData.interestedDomains.map((interest, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-gradient-to-r from-orange-100 to-pink-100 text-orange-800 rounded-full text-sm font-medium"
                  >
                    {interest}
                  </span>
                ))
              ) : (
                <div className="w-full text-center py-6">
                  <p className="text-gray-500 text-lg">
                    No interests selected yet
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

"use client";

import Link from "next/link";
import { useState } from "react";
import {
  PlusCircleIcon,
  ChartBarIcon,
  GlobeAltIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";

export default function ProposalsPage() {
  const [loading, setLoading] = useState({
    create: false,
    track: false,
    explore: false,
  });

  const handleClick = (type) => {
    setLoading((prev) => ({ ...prev, [type]: true }));
    setTimeout(() => {
      setLoading((prev) => ({ ...prev, [type]: false }));
    }, 2000);
  };

  const CardLoader = () => (
    <div className="flex items-center justify-center space-x-1">
      <div className="w-2 h-2 bg-orange-500 rounded-full animate-[bounce_0.7s_infinite]" />
      <div className="w-2 h-2 bg-orange-500 rounded-full animate-[bounce_0.7s_0.1s_infinite]" />
      <div className="w-2 h-2 bg-orange-500 rounded-full animate-[bounce_0.7s_0.2s_infinite]" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white">
      {/* Back Navigation */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b border-orange-100/50">
        <div className="container mx-auto px-4 py-4">
          <Link
            href="/"
            className="inline-flex items-center px-4 py-2 text-gray-600 hover:text-orange-500 transition-colors rounded-lg hover:bg-orange-50/50"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            <span className="font-medium">Back to Home</span>
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 pt-24 pb-16 max-w-6xl relative">
        {/* Decorative Elements */}
        <div className="absolute top-0 left-1/2 w-56 h-56 bg-orange-100 rounded-full opacity-20 -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-orange-100 rounded-full opacity-20 -translate-x-1/2 translate-y-1/2" />

        {/* Header Section */}
        <div className="text-center mb-16 relative">
          <div className="inline-flex items-center justify-center space-x-2 mb-4">
            <span className="text-orange-500 text-sm font-medium tracking-wider">
              SimpleArticle
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Proposals & Networking
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg mb-8">
            Your gateway to collaborative opportunities. Connect with peers,
            share ideas, and bring your projects to life.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500">
            <span className="flex items-center">
              <span className="w-2 h-2 bg-orange-500 rounded-full mr-2" />
              Collaborate on Projects
            </span>
            <span className="flex items-center">
              <span className="w-2 h-2 bg-orange-500 rounded-full mr-2" />
              Track Progress of applications
            </span>
            <span className="flex items-center">
              <span className="w-2 h-2 bg-orange-500 rounded-full mr-2" />
              Find Team Members
            </span>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-3 gap-8 relative z-10 max-w-4xl mx-auto">
          {/* Create Proposal Card */}
          <Link
            href="/proposals/create"
            onClick={() => handleClick("create")}
            className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-orange-100/50"
          >
            <div className="flex flex-col items-center text-center min-h-[180px] justify-between">
              <div className="bg-gradient-to-br from-orange-50 to-white p-4 rounded-xl mb-6 ring-1 ring-orange-100">
                <PlusCircleIcon className="w-10 h-10 text-orange-500" />
              </div>
              {loading.create ? (
                <CardLoader />
              ) : (
                <>
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">
                    Create a Proposal
                  </h2>
                  <p className="text-gray-600">
                    Share your innovative project ideas and find the perfect
                    collaborators
                  </p>
                </>
              )}
            </div>
          </Link>

          {/* Track Proposals Card */}
          <Link
            href="/proposals/my-proposals"
            onClick={() => handleClick("track")}
            className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-orange-100/50"
          >
            <div className="flex flex-col items-center text-center min-h-[180px] justify-between">
              <div className="bg-gradient-to-br from-orange-50 to-white p-4 rounded-xl mb-6 ring-1 ring-orange-100">
                <ChartBarIcon className="w-10 h-10 text-orange-500" />
              </div>
              {loading.track ? (
                <CardLoader />
              ) : (
                <>
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">
                    Track Proposals
                  </h2>
                  <p className="text-gray-600">
                    Monitor your active proposals and manage collaboration
                    responses
                  </p>
                </>
              )}
            </div>
          </Link>

          {/* Explore Proposals Card */}
          <Link
            href="/proposals/explore"
            onClick={() => handleClick("explore")}
            className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-orange-100/50"
          >
            <div className="flex flex-col items-center text-center min-h-[180px] justify-between">
              <div className="bg-gradient-to-br from-orange-50 to-white p-4 rounded-xl mb-6 ring-1 ring-orange-100">
                <GlobeAltIcon className="w-10 h-10 text-orange-500" />
              </div>
              {loading.explore ? (
                <CardLoader />
              ) : (
                <>
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">
                    Explore Proposals
                  </h2>
                  <p className="text-gray-600">
                    Discover exciting projects and join collaborative
                    opportunities
                  </p>
                </>
              )}
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

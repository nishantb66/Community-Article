"use client";
import Link from 'next/link';
import { useState } from 'react';

export default function About() {
  const [showPrivacy, setShowPrivacy] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <h1 className="text-2xl md:text-5xl font-bold text-center mb-6">
            <div className="flex items-center gap-2">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-orange-500">
                About
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-orange-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </h1>
        </div>
      </section>

      {/* What is SimpleArticle */}
      <section className="py-16 px-4 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-800">
                What is SimpleArticle?
              </h2>
              <p className="text-gray-600 leading-relaxed">
                SimpleArticle is a modern platform that connects writers with
                readers, fostering a community of knowledge sharing and creative
                expression. We provide a clean, distraction-free environment for
                both writing and reading.
              </p>
            </div>
            <div className="bg-orange-100 rounded-2xl p-8 transform hover:scale-105 transition-transform duration-300">
              <div className="aspect-video bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center text-white">
                <div className="text-center">
                  <h3 className="text-xl font-bold mb-2">SimpleArticle</h3>
                  <p className="text-sm opacity-90">
                    A platform designed for
                    <p>
                      writers, readers, creators, collaborator and knowledge
                      seekers.
                    </p>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4 text-center">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">
            What We Offer
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "AI Assitance",
                description:
                  "Get assistance from our AI model to enhance your understanding",
                icon: "✨",
              },
              {
                title: "Community Network",
                description: "Connect with like-minded writers and readers",
                icon: "🤝",
              },
              {
                title: "Personalised Experience",
                description:
                  "Write, edit, bookmark and keep a track of your stories and articles",
                icon: "💡",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="text-3xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Networking Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-orange-50 to-white">
        <div className="container mx-auto max-w-6xl">
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h2 className="text-3xl font-bold mb-8">
              Networking Opportunities
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                    <span className="text-orange-600">01</span>
                  </div>
                  <p className="text-gray-700">
                    Connect with professional writers
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                    <span className="text-orange-600">02</span>
                  </div>
                  <p className="text-gray-700">Join discussion forums</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                    <span className="text-orange-600">03</span>
                  </div>
                  <p className="text-gray-700">Collaborate on projects</p>
                </div>
              </div>
              <div className="bg-orange-50 rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4">Coming Soon</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Writing Workshops</li>
                  <li>• Mentorship Programs</li>
                  <li>• Writing Contests</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Privacy Policy Modal */}
      {showPrivacy && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">Privacy Policy</h2>
            <div className="prose prose-orange">
              <p></p>
              {/* Add privacy policy content */}
            </div>
            <button
              onClick={() => setShowPrivacy(false)}
              className="mt-6 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Footer CTA */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl text-center">
          <button
            onClick={() => setShowPrivacy(true)}
            className="text-orange-600 underline underline-offset-4 hover:text-orange-700 transition-colors"
          >
            View Privacy Policy
          </button>
        </div>
      </section>
    </div>
  );
}

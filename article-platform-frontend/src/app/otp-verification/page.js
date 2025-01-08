"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function EmailVerification() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false); // Loading state
  const [notification, setNotification] = useState(""); // Notification state
  const router = useRouter();

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => {
      setNotification(""); // Clear notification after 2 seconds
    }, 2000);
  };

  const handleSendOtp = async () => {
    setLoading(true); // Start loading
    try {
      const response = await fetch("https://community-article-backend.onrender.com/api/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        showNotification("OTP sent successfully!");
        setStep(2);
      } else {
        const data = await response.json();
        showNotification(data.message || "Email not found.");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      showNotification("An error occurred. Please try again.");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const handleVerifyOtp = async () => {
    setLoading(true); // Start loading
    try {
      const response = await fetch("https://community-article-backend.onrender.com/api/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      if (response.ok) {
        showNotification("Email verified successfully!");
        localStorage.setItem("isVerified", true); // Update verification status
        setTimeout(() => {
          router.push("/"); // Redirect to main page after notification
        }, 2000);
      } else {
        const data = await response.json();
        showNotification(data.message || "Failed to verify OTP.");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      showNotification("An error occurred. Please try again.");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-6">
      {/* Notification Banner */}
      {notification && (
        <div className="fixed top-5 left-1/2 transform -translate-x-1/2 bg-green-500 text-white py-2 px-4 rounded-lg shadow-lg text-sm z-50">
          {notification}
        </div>
      )}

      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        {step === 1 ? (
          <>
            <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
              Verify Your Email
            </h2>
            <p className="text-sm text-gray-600 mb-6 text-center">
              Enter your email to receive a one-time password (OTP) for
              verification.
            </p>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4"
            />
            <button
              onClick={handleSendOtp}
              disabled={loading}
              className={`w-full py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 focus:outline-none ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    ></path>
                  </svg>
                  <span>Sending...</span>
                </div>
              ) : (
                "Send OTP"
              )}
            </button>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
              Enter OTP
            </h2>
            <p className="text-sm text-gray-600 mb-6 text-center">
              Check your email for the OTP we sent you.
            </p>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4"
            />
            <button
              onClick={handleVerifyOtp}
              disabled={loading}
              className={`w-full py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 focus:outline-none ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    ></path>
                  </svg>
                  <span>Verifying...</span>
                </div>
              ) : (
                "Verify OTP"
              )}
            </button>
          </>
        )}
      </div>
      
    </div>
  );
}


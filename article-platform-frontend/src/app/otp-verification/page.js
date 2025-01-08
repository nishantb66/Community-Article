"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function EmailVerification() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const router = useRouter();

  const handleSendOtp = async () => {
    try {
      const response = await fetch("https://community-article-backend.onrender.com/api/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        alert("OTP sent to your email.");
        setStep(2);
      } else {
        const data = await response.json();
        alert(data.message || "Email not found.");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
    }
  };


  const handleVerifyOtp = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      if (response.ok) {
        alert("Email verified successfully.");
        localStorage.setItem("isVerified", true); // Update verification status
        router.push("/"); // Redirect to main page
      } else {
        const data = await response.json();
        alert(data.message || "Failed to verify OTP.");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      {step === 1 ? (
        <div className="w-full max-w-sm">
          <h2 className="text-xl font-bold mb-4">Verify Your Email</h2>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg mb-4"
          />
          <button
            onClick={handleSendOtp}
            className="w-full bg-blue-500 text-white py-2 rounded-lg"
          >
            Send OTP
          </button>
        </div>
      ) : (
        <div className="w-full max-w-sm">
          <h2 className="text-xl font-bold mb-4">Enter OTP</h2>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg mb-4"
          />
          <button
            onClick={handleVerifyOtp}
            className="w-full bg-green-500 text-white py-2 rounded-lg"
          >
            Verify OTP
          </button>
        </div>
      )}
    </div>
  );
}


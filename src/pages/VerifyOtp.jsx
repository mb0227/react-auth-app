import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { resendOtp, verifyOtp } from "../api/auth";

export default function VerifyOtp() {
  const navigate = useNavigate();
  const location = useLocation();
  const initialEmail = location?.state?.email || "";
  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await verifyOtp({ email, otp });
      alert("Email verified! You can now sign in.");
      navigate("/signin");
    } catch (err) {
      const msg = err?.response?.data?.errorMessage || "Verification failed";
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async (e) => {
    e.preventDefault();
    try {
      await resendOtp({ email });
      alert("OTP resent to your email.");
    } catch (err) {
      const msg = err?.response?.data?.errorMessage || "Resend failed";
      alert(msg);
    }
  };

  return (
    <div className="min-h-screen grid place-items-center bg-gray-50 p-4">
      <form onSubmit={handleVerify} className="bg-white p-6 rounded shadow w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4">Verify Email</h2>
        <label className="block text-sm mb-1">Email</label>
        <input
          type="email"
          className="border p-2 rounded w-full mb-3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label className="block text-sm mb-1">OTP</label>
        <input
          type="text"
          className="border p-2 rounded w-full mb-4"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
        />
        <button className="bg-blue-600 text-white py-2 rounded w-full disabled:opacity-50" disabled={loading}>
          {loading ? "Verifying..." : "Verify"}
        </button>
        <button className="text-blue-600 text-sm mt-3 underline hover:text-blue-400 hover:cursor-pointer" onClick={handleResend}>
          Resend OTP
        </button>
      </form>
    </div>
  );
}
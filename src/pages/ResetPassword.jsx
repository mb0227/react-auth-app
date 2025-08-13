import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { resetPassword } from "../api/auth";

export default function ResetPassword() {
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState(location?.state?.email || "");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await resetPassword({ email, password, otp });
      alert("Password reset successful. Please sign in.");
      navigate("/signin");
    } catch (err) {
      const msg = err?.response?.data?.errorMessage || "Reset failed";
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid place-items-center bg-gray-50 p-4">
      <form onSubmit={handleReset} className="bg-white p-6 rounded shadow w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4">Reset Password</h2>
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
          className="border p-2 rounded w-full mb-3"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
        />
        <label className="block text-sm mb-1">New Password</label>
        <input
          type="password"
          className="border p-2 rounded w-full mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button className="bg-green-600 text-white py-2 rounded w-full disabled:opacity-50" disabled={loading}>
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
}
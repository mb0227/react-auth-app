import React, { useState } from "react";
import { forgotPassword } from "../api/auth";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await forgotPassword({ email });
      alert("OTP sent to your email.");
      navigate("/reset-password", { state: { email } });
    } catch (err) {
      const msg = err?.response?.data?.errorMessage || "Request failed";
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid place-items-center bg-gray-50 p-4">
      <form onSubmit={handleSend} className="bg-white p-6 rounded shadow w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4">Forgot Password</h2>
        <label className="block text-sm mb-1">Email</label>
        <input
          type="email"
          className="border p-2 rounded w-full mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button className="bg-blue-600 text-white py-2 rounded w-full disabled:opacity-50" disabled={loading}>
          {loading ? "Sending..." : "Send OTP"}
        </button>
      </form>
    </div>
  );
}
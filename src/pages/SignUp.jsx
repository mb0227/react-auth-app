import React, { useState } from "react";
import { signUp } from "../api/auth";
import { Link, useNavigate } from "react-router-dom";

export default function SignUp() {
  const [username, setUsername] = useState("");
  const [email, setEmail]     = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signUp({ username, email, password });
      alert("Account created! Please verify your email.");
      navigate("/verify-otp", { state: { email } });
    } catch (err) {
      const msg =
        err?.response?.data?.errorMessage ||
        err?.response?.data?.responseMessage ||
        "Sign up failed";
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid place-items-center bg-gray-50 p-4">
      <form className="bg-white p-6 rounded shadow w-full max-w-md" onSubmit={handleSignUp}>
        <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
        <label className="block text-sm mb-1">Username</label>
        <input
          type="text"
          placeholder="name"
          className="border p-2 w-full mb-3 rounded"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <label className="block text-sm mb-1">Email</label>
        <input
          type="email"
          placeholder="you@example.com"
          className="border p-2 w-full mb-3 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label className="block text-sm mb-1">Password</label>
        <input
          type="password"
          placeholder="••••••••"
          className="border p-2 w-full mb-4 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button className="bg-green-600 text-white px-4 py-2 rounded w-full disabled:opacity-50" disabled={loading}>
          {loading ? "Creating..." : "Sign Up"}
        </button>
        <p className="text-sm text-center mt-3">
          Already have an account? <Link className="text-blue-600" to="/signin">Sign In</Link>
        </p>
      </form>
    </div>
  );
}
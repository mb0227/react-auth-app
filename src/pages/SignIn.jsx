import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { googleLogin } from "../api/auth";

export default function SignIn() {
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await signIn({ email, password });

      switch (result?.status) {
        case "ok":
          window.location.replace("/");
          return;
        case "inactive":
          alert(result?.message || "Account is not active. OTP sent to your email.");
          navigate("/verify-otp", { state: { email } });
          return;
        case "deleted":
          alert(result?.message || "User account is deleted.");
          return;
        case "invalid":
        case "error":
        default:
          alert(result?.message || "Invalid credentials");
          return;
      }
    } catch (err) {
      const msg =
        err?.response?.data?.errorMessage ||
        err?.response?.data?.responseMessage ||
        "Invalid credentials";
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    try {
      const data = await googleLogin();
      if (data?.url) window.location.assign(data.url);
      else alert("Failed to initiate Google login.");
    } catch (err) {
      const msg =
        err?.response?.data?.errorMessage ||
        err?.response?.data?.responseMessage ||
        "Google login failed";
      alert(msg);
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid place-items-center bg-gray-50 p-4">
      <form onSubmit={handleLogin} className="bg-white p-6 rounded shadow w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4">Sign In</h2>
        <label className="block text-sm mb-1">Email</label>
        <input
          type="email"
          placeholder="you@example.com"
          className="border p-2 rounded w-full mb-3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label className="block text-sm mb-1">Password</label>
        <div className="relative mb-4">
          <input
            type={showPass ? "text" : "password"}
            placeholder="••••••••"
            className="border p-2 rounded w-full pr-16"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-blue-600"
            onClick={() => setShowPass((s) => !s)}
          >
            {showPass ? "Hide" : "Show"}
          </button>
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 rounded w-full mb-3 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>

        <button
          type="button"
          onClick={handleGoogle}
          className="bg-white border border-gray-300 text-gray-800 py-2 rounded w-full mb-3 hover:bg-gray-50 disabled:opacity-50"
          disabled={googleLoading}
        >
          {googleLoading ? "Redirecting..." : "Continue with Google"}
        </button>

        <div className="flex items-center justify-between text-sm">
          <Link className="text-blue-600" to="/signup">Sign Up</Link>
          <Link className="text-blue-600" to="/forgot-password">Forgot Password?</Link>
        </div>
      </form>
    </div>
  );
}
import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { googleCallback } from "../api/auth";
import { setAccessToken, setRefreshToken } from "../api/tokenStorage";
import { getProfile } from "../api/user";
import { useAuth } from "../context/AuthContext";

export default function GoogleCallback() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [error, setError] = useState("");

  useEffect(() => {
    const code = params.get("code");
    const state = params.get("state");
    if (!code) {
      setError("Missing authorization code.");
      return;
    }
    (async () => {
      try {
        const res = await googleCallback({ code, state });
        const data = res?.data?.data || res?.data;
        if (data?.accessToken) setAccessToken(data.accessToken);
        if (data?.refreshToken) setRefreshToken(data.refreshToken);

        const profile = await getProfile();
        setUser(profile);
        navigate("/", { replace: true });
      } catch (err) {
        const msg =
          err?.response?.data?.errorMessage ||
          err?.response?.data?.responseMessage ||
          "Google sign-in failed.";
        setError(msg);
      }
    })();
  }, [params, navigate, setUser]);

  if (error) {
    return (
      <div className="min-h-screen grid place-items-center">
        <div className="p-6 border rounded bg-white shadow w-full max-w-md">
          <h1 className="text-xl font-semibold mb-2">Sign-in Error</h1>
          <p className="text-red-600 mb-4">{error}</p>
          <button className="text-blue-600 underline" onClick={() => navigate("/signin")}>
            Back to Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen grid place-items-center">
      <div className="p-6 border rounded bg-white shadow w-full max-w-md">
        <p>Signing you in with Google...</p>
      </div>
    </div>
  );
}
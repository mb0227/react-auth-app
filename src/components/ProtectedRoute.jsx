import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { authenticated, initializing } = useAuth();

  if (initializing) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-200 border-t-blue-600" />
      </div>
    );
  }

  return authenticated ? children : <Navigate to="/signin" replace />;
}
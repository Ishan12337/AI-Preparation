
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../features/auth/hooks/useAuth";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  
  if (loading) {
    return <div>Loading...</div>;
  }

  
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // user exists
  return children;
};

export default ProtectedRoute;



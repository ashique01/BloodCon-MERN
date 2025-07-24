import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const ProtectedRoute = ({ children, adminOnly = false }) => {
  // Destructure user, token, and the new isLoading state
  const { user, token, isLoading } = useAuth();

  // console.log('ProtectedRoute: Current user state:', user);
  // console.log('ProtectedRoute: Current token state:', token);
  // console.log('ProtectedRoute: isLoading state:', isLoading); 
  // console.log('ProtectedRoute: adminOnly prop:', adminOnly);

  
  if (isLoading) {
    //console.log('ProtectedRoute: Still loading authentication state...');
    return null; 
  }

  
  if (!user || !token) {
    //console.log('ProtectedRoute: User not authenticated after loading. Redirecting to /login.');
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && (!user.isAdmin || user.isAdmin === false)) {
    //console.log('ProtectedRoute: User is not an admin. Redirecting to /dashboard.');
    return <Navigate to="/dashboard" replace />;
  }

  // If authenticated and authorized, render the children
  //console.log('ProtectedRoute: Access granted. Rendering children.');
  return children;
};

export default ProtectedRoute;

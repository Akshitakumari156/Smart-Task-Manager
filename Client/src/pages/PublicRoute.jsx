import React from "react";
import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  if (token) {
    const role = localStorage.getItem("role");
    return role === "manager" 
      ? <Navigate to="/home-manager" replace />
      : <Navigate to="/home-employee" replace />;
  }
  return children;
};

export default PublicRoute;

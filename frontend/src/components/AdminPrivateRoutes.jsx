import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export const AdminPrivateRoutes = ({ children }) => {
  const { isAuthenticated, admin, isLoading } = useSelector(
    (state) => state.adminAuth
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated || !admin) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};
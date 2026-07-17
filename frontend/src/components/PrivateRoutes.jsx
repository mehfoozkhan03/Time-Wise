import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

export const PrivateRoutes = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  console.log(`🚀 ~ isAuthenticated:`, isAuthenticated);
  if (
    !isAuthenticated ||
    isAuthenticated === undefined ||
    isAuthenticated === null
  ) {
    return <Navigate to="/signup" />;
  }
  return children;
};

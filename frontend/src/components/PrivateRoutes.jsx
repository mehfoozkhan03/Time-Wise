import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

export const PrivateRoutes = ({ children }) => {
  const { token } = useSelector((state) => state.auth);
  console.log(`🚀 ~ token:`, token);
  if (token === false) {
    return <Navigate to="/signup" />;
  }
  return children;
};

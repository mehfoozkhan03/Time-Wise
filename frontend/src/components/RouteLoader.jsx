import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Loader from './Loader';
import { useSelector } from 'react-redux';

function RouteLoader() {
  const location = useLocation();

  const { isLoading } = useSelector((state) => {
    return state.auth;
  });
  console.log(`🚀 ~ isLoading:`, isLoading);

  if (isLoading) {
    return <Loader />;
  }
}

export default RouteLoader;

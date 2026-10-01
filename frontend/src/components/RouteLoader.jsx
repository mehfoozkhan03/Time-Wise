import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import Loader from "./Loader";

function RouteLoader() {
  const location = useLocation();

  const { isLoading } = useSelector((state) => state.auth);

  if (isLoading) {
    return <Loader />;
  }
}

export default RouteLoader;
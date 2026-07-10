import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Loader from "./Loader";

function RouteLoader() {

  const location = useLocation();

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    setLoading(true);

    const timer = setTimeout(() => {
      setLoading(false);
    }, 700);

    return () => clearTimeout(timer);

  }, [location.pathname]);

  if (!loading) return null;

  return <Loader />;
}

export default RouteLoader;
import { useCallback, useEffect } from "react";
import { useSelector } from "react-redux";

import { useTour } from "../hooks/useTour";
import { tourSteps } from "../tour/tourSteps";

export function AutoTour() {
  const { user, isAuthenticated, isLoading } = useSelector((state) => state.auth);
  const userId = user?._id;
  const seenKey = userId ? `tw_tour_seen_${userId}` : null;
  const getSteps = useCallback(() => tourSteps(), []);
  const markTourSeen = useCallback(() => {
    if (seenKey) localStorage.setItem(seenKey, "true");
  }, [seenKey]);
  const { triggerTour } = useTour(getSteps, markTourSeen);

  useEffect(() => {
    if (!isAuthenticated || isLoading || !userId || localStorage.getItem(seenKey) === "true") {
      return undefined;
    }

    const timer = setTimeout(() => {
      triggerTour();
    }, 1000);

    return () => clearTimeout(timer);
  }, [isAuthenticated, isLoading, seenKey, triggerTour, userId]);

  return null;
}

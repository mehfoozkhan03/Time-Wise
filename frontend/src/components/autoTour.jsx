import { useEffect } from "react";
import { useSelector } from "react-redux";

import { useTour } from "../hooks/useTour";
import { tourSteps } from "../tour/tourSteps";

export function AutoTour() {
  const hasSeenTour = useSelector((s) => s.tour.hasSeenTour);
  const { triggerTour } = useTour(tourSteps());

  useEffect(() => {
    // Only fire if user has never seen the tour
    if (!hasSeenTour) {
      // Small delay so all DOM elements are fully mounted
      const timer = setTimeout(() => triggerTour(), 800);
      return () => clearTimeout(timer);
    }
  }, []); // ← empty array = runs only once on mount

  return null; // renders nothing
}

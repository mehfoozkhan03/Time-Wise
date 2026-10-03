import { useEffect, useRef, useCallback } from "react";
import { useDispatch } from "react-redux";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import "../App.css";
import { startTour, endTour, setCurrentStep } from "../store/tourSlice";

export function useTour(steps, onTourEnd) {
  const dispatch = useDispatch();
  const driverRef = useRef(null);

  useEffect(() => {
    driverRef.current = driver({
      showProgress: true,
      animate: true,
      overlayOpacity: 0.75,
      smoothScroll: true,
      allowClose: true, // ← must be true
      steps,
      onHighlightStarted: (_el, step, { index }) => {
        dispatch(setCurrentStep(index));
      },
      // ← ADD BOTH of these
      onDestroyStarted: () => {
        driverRef.current?.destroy(); // force-destroy when X is clicked
        dispatch(endTour());
      },
      onDestroyed: () => {
        dispatch(endTour());
        onTourEnd?.();
      },
    });
  }, [dispatch, onTourEnd, steps]);

  const triggerTour = useCallback(() => {
    dispatch(startTour());
    driverRef.current?.drive();
  }, [dispatch]);

  return { triggerTour, driverRef };
}

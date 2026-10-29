import { useEffect, useRef, useCallback } from "react";
import { useDispatch } from "react-redux";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import "../App.css";
import { startTour, endTour, setCurrentStep } from "../store/tourSlice";

export function useTour(steps, onTourEnd) {
  const dispatch = useDispatch();
  const driverRef = useRef(null);

  const getAvailableSteps = useCallback(() => {
    const currentSteps = typeof steps === "function" ? steps() : steps;

    return currentSteps.filter((step) => {
      if (!step.element) return true;

      try {
        const target = document.querySelector(step.element);
        if (!target) return false;

        const style = window.getComputedStyle(target);
        return (
          style.display !== "none" &&
          style.visibility !== "hidden" &&
          target.getClientRects().length > 0
        );
      } catch {
        // Ignore invalid selectors so one bad target cannot stop the tour.
        return false;
      }
    });
  }, [steps]);

  useEffect(() => {
    driverRef.current = driver({
      showProgress: true,
      animate: true,
      overlayOpacity: 0.75,
      smoothScroll: true,
      allowClose: true, // ← must be true
      steps: [],
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
  }, [dispatch, onTourEnd]);

  const triggerTour = useCallback(() => {
    const availableSteps = getAvailableSteps();
    if (!availableSteps.length) return;

    driverRef.current?.setSteps(availableSteps);
    dispatch(startTour());
    driverRef.current?.drive();
  }, [dispatch, getAvailableSteps]);

  return { triggerTour, driverRef };
}

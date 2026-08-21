import { useEffect } from "react";
import { authService } from "../services/authService";

export const ActivityTracker = () => {
  useEffect(() => {
    const updateActivity = () => {
      authService.updateActivity().catch((error) => {
        console.error("Activity update failed:", error);
      });
    };

    // Update immediately
    updateActivity();

    // Then every 30 seconds
    const interval = setInterval(updateActivity, 1000);

    return () => clearInterval(interval);
  }, []);

  return null;
};
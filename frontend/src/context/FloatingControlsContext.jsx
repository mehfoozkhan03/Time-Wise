import { createContext, useContext, useEffect, useMemo, useState } from "react";

const FloatingControlsContext = createContext({ hideOnIdle: false });
const IDLE_DELAY_MS = 10000;

export function FloatingControlsProvider({ children }) {
  const [isIdle, setIsIdle] = useState(false);

  useEffect(() => {
    let idleTimer;

    const markActivity = () => {
      setIsIdle(false);
      window.clearTimeout(idleTimer);
      idleTimer = window.setTimeout(() => setIsIdle(true), IDLE_DELAY_MS);
    };

    const handleScroll = () => {
      markActivity();
    };

    const handleVisibilityChange = () => {
      if (!document.hidden) markActivity();
    };

    const activityEvents = ["pointerdown", "pointermove", "keydown", "touchstart", "wheel"];
    markActivity();
    activityEvents.forEach((eventName) =>
      window.addEventListener(eventName, markActivity, { passive: true }),
    );
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("focus", markActivity);
    window.addEventListener("pageshow", markActivity);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.clearTimeout(idleTimer);
      activityEvents.forEach((eventName) =>
        window.removeEventListener(eventName, markActivity),
      );
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("focus", markActivity);
      window.removeEventListener("pageshow", markActivity);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const value = useMemo(
    () => ({ hideOnIdle: isIdle }),
    [isIdle],
  );

  return (
    <FloatingControlsContext.Provider value={value}>
      {children}
    </FloatingControlsContext.Provider>
  );
}

export const useFloatingControls = () => useContext(FloatingControlsContext);

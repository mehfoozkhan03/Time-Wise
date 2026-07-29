import { useEffect, useRef } from "react";
import "./preogressBar.css";

export default function ScrollProgressBar() {
  const barRef = useRef(null);

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;

      const scrollHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;

      const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;

      if (barRef.current) {
        barRef.current.style.width = `${progress}%`;
      }
    };

    updateProgress(); // Set initial width

    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);

    return () => {
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, []);

  return (
    <div className="scroll_progress">
      <div ref={barRef} className="scroll_progress_bar" />
    </div>
  );
}

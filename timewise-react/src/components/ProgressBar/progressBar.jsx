import { useEffect } from "react";

import "./preogressBar.css";

export default function ScrollProgressBar() {
  useEffect(() => {
    const bar = document.getElementById("scroll_progress_bar");

    const onScroll = () => {
      const scrolled = window.scrollY;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrolled / total) * 100;
      bar.style.width = progress + "%";
    };

    window.addEventListener("scroll", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div className="scroll_progress" id="tour-progress-bar">
      <div className="scroll_progress_bar" id="scroll_progress_bar"></div>
    </div>
  );
}

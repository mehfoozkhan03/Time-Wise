import { useEffect } from "react";

import "./preogressBar.css";

export default function ScrollProgressBar() {
  useEffect(() => {
    const bar = document.getElementById("scroll_progress_bar");

    const onScroll = () => {
      const scrolled = window.scrollY;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrolled / total) * 100;

      const transparentPart = progress * 0.5;

      bar.style.width = `${progress - transparentPart}%`;
      bar.style.transform = `translateX(${transparentPart}%)`;

      // Transparent portion is always half of 100% (the bar's own width)
      // So at 50% scroll → bar is 50% wide, first 50% of bar is transparent
      // At 100% scroll → bar is 100% wide, first 50% of bar is transparent
      bar.style.background = `linear-gradient(
    to right,
    transparent 0%,
    transparent 50%,
    #29A3E0 100%
  )`;
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

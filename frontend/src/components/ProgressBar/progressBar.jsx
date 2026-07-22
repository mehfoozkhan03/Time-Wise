import { useEffect } from "react";

import "./preogressBar.css";

export default function ScrollProgressBar() {
  useEffect(() => {
    const bar = document.getElementById("scroll_progress_bar");

const onScroll = () => {
  const scrolled = window.scrollY
  const total    = document.documentElement.scrollHeight - window.innerHeight
  const progress = (scrolled / total) * 100

  // Bar width = full progress
  bar.style.width      = `${progress}%`
  bar.style.transform  = 'none'   // remove any leftover transform

  // First 50% of bar = transparent, second 50% = colored
  // These % are always relative to the bar's own width
  bar.style.background = `linear-gradient(
    to right,
    transparent 0%,
    transparent 50%,
    #29A3E0 100%
  )`
}
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

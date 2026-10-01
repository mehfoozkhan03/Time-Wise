import { useEffect, useState } from "react";
import { ChevronUp } from "lucide-react";
import "./scrollToTop.css";
import { useFloatingControls } from "../../context/FloatingControlsContext";

export function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);
  const { hideOnIdle } = useFloatingControls();

  useEffect(() => {
    const handleScroll = () => {
      const shouldShow = window.scrollY > 300 && !hideOnIdle;

      setVisible(shouldShow);

      document.body.classList.toggle(
        "ai-scroll-active",
        shouldShow
      );
    };

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);

      document.body.classList.remove("ai-scroll-active");
    };
  }, [hideOnIdle]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      className={`scroll_top_btn ${visible ? "show" : ""} ${hideOnIdle ? "idle_hidden" : ""}`}
      onClick={scrollToTop}
      aria-label="Back to top"
    >
      <ChevronUp size={23} strokeWidth={2.5} />
    </button>
  );
}

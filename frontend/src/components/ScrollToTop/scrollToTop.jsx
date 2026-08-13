import { useEffect, useState } from "react";
import { ChevronUp } from "lucide-react";
import "./scrollToTop.css";

export function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
<<<<<<< HEAD
    const handleScroll = () => {
      const shouldShow = window.scrollY > 300;

      setVisible(shouldShow);

      document.body.classList.toggle(
        "ai-scroll-active",
        shouldShow
      );
    };

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);

      document.body.classList.remove("ai-scroll-active");
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
=======
    const handleScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
>>>>>>> 2f5cb8235e940a7bee02d98a2a0eaab4a4b9edaf
  };

  return (
    <button
      className={`scroll_top_btn ${visible ? "show" : ""}`}
      onClick={scrollToTop}
      aria-label="Back to top"
    >
<<<<<<< HEAD
      <ChevronUp size={23} strokeWidth={2.5} />
    </button>
  );
}
=======
      <ChevronUp size={22} strokeWidth={2.5} />
    </button>
  );
}
>>>>>>> 2f5cb8235e940a7bee02d98a2a0eaab4a4b9edaf

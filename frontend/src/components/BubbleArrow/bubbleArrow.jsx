import { useEffect } from "react";
import "./bubbleArrow.css";

export default function BubbleCursor() {
  useEffect(() => {
    const dot = document.getElementById("cursor_dot");
    const ring = document.getElementById("cursor_ring");

    let mouseX = 0,
      mouseY = 0;
    let ringX = 0,
      ringY = 0;

    const onMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.left = mouseX + "px";
      dot.style.top = mouseY + "px";
    };

    let isHovering = false;
    let glowOutTimer = null;

    const onMouseOver = (e) => {
      if (
        e.target.closest(
          "a,button,input,textarea,select,label,[data-cursor-hover]",
        )
      ) {
        isHovering = true;

        // Cancel any pending cleanup from a previous glow_out
        if (glowOutTimer) {
          clearTimeout(glowOutTimer);
          glowOutTimer = null;
        }

        // Snap ring position to cursor before animating in
        ringX = mouseX;
        ringY = mouseY;
        ring.style.left = ringX + "px";
        ring.style.top = ringY + "px";

        // Remove glow_out first so the pulse-in restarts cleanly
        ring.classList.remove("glow_out");

        // Force a reflow so the animation restarts from scratch
        void ring.offsetWidth;

        dot.classList.add("hovered");
        ring.classList.add("hovered");
      }
    };

    const onMouseOut = (e) => {
      if (
        e.target.closest(
          "a,button,input,textarea,select,label,[data-cursor-hover]",
        )
      ) {
        isHovering = false;

        dot.classList.remove("hovered");

        // Switch from pulse → fade-out animation
        ring.classList.add("glow_out");
        ring.classList.remove("hovered");

        // Clean up glow_out after animation finishes
        glowOutTimer = setTimeout(() => {
          if (!isHovering) {
            ring.classList.remove("glow_out");
          }
          glowOutTimer = null;
        }, 450); // match cursor_glow_out duration
      }
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseover", onMouseOver);
    document.addEventListener("mouseout", onMouseOut);

    let animId;
    function animateRing() {
      if (!isHovering) {
        ringX += (mouseX - ringX) * 1;
        ringY += (mouseY - ringY) * 1;
        ring.style.left = ringX + "px";
        ring.style.top = ringY + "px";
      }
      animId = requestAnimationFrame(animateRing);
    }
    animateRing();

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseover", onMouseOver);
      document.removeEventListener("mouseout", onMouseOut);
      cancelAnimationFrame(animId);
      if (glowOutTimer) clearTimeout(glowOutTimer);
    };
  }, []);

  return (
    <>
      <div id="cursor_dot"></div>
      <div id="cursor_ring"></div>
    </>
  );
}

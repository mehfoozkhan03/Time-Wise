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

    const onMouseOver = (e) => {
      if (
        e.target.closest(
          "a,button,input,textarea,select,label,[data-cursor-hover]",
        )
      ) {
        isHovering = true;

        // Snap ring to cursor
        ringX = mouseX;
        ringY = mouseY;

        ring.style.left = ringX + "px";
        ring.style.top = ringY + "px";

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
        ring.classList.remove("hovered");
      }
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseover", onMouseOver);
    document.addEventListener("mouseout", onMouseOut);

    let animId;

    function animateRing() {
      if (!isHovering) {
        ringX += (mouseX - ringX) * 0.45;
        ringY += (mouseY - ringY) * 0.45;

        ring.style.left = ringX + "px";
        ring.style.top = ringY + "px";
      }

      animId = requestAnimationFrame(animateRing);
    }

    animateRing();

    // Cleanup when component unmounts
    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseover", onMouseOver);
      document.removeEventListener("mouseout", onMouseOut);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <>
      <div id="cursor_dot"></div>
      <div id="cursor_ring"></div>
    </>
  );
}

import { useNavigate } from "react-router-dom";
import { useRef } from "react";

import "./ActionCard.css";
import Card from "../../Card/Card";
import { FaArrowRight } from "react-icons/fa";

export default function ActionCard({ id, icon, title, description, to }) {
  const navigate = useNavigate();

  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateY = ((x - centerX) / centerX) * 8;
    const rotateX = -((y - centerY) / centerY) * 8;

    card.style.setProperty("--rotateX", `${rotateX}deg`);
    card.style.setProperty("--rotateY", `${rotateY}deg`);

    card.style.setProperty("--mouse-x", `${x}px`);
    card.style.setProperty("--mouse-y", `${y}px`);
  };

  const resetTilt = () => {
    const card = cardRef.current;
    if (!card) return;

    card.style.setProperty("--rotateX", "0deg");
    card.style.setProperty("--rotateY", "0deg");
  };

  return (
    <Card
      ref={cardRef}
      className="action_card"
      onClick={() => navigate(to)}
      onMouseMove={handleMouseMove}
      onMouseLeave={resetTilt}
    >
      <div data-id={id} className="action_icon">
        {icon}
      </div>

      <h3>{title}</h3>

      <p>{description}</p>

      <div className="action_arrow">
        <FaArrowRight />
      </div>
    </Card>
  );
}

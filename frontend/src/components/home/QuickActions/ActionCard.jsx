import { useNavigate } from "react-router-dom";

import "./ActionCard.css";
import Card from "../../Card/Card";
import { FaArrowRight } from "react-icons/fa";

export default function ActionCard({ icon, title, description, to }) {
  const navigate = useNavigate();

  return (
    <Card className="action_card" onClick={() => navigate(to)}>
      <div className="action_icon">{icon}</div>

      <h3>{title}</h3>

      <p>{description}</p>

      <div className="action_arrow">
        <FaArrowRight />
      </div>
    </Card>
  );
}

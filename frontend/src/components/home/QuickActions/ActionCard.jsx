import { useNavigate } from "react-router-dom";

import "./ActionCard.css";
import Card from "../../Card/Card";
import { FaArrowRight } from "react-icons/fa";

<<<<<<< HEAD
export default function ActionCard({id, icon, title, description, to }) {
  console.log("🚀 ~ ActionCard ~ data_id:", id)
  const navigate = useNavigate()
=======
export default function ActionCard({ icon, title, description, to }) {
  const navigate = useNavigate();
>>>>>>> 0623fba53cdf1a9ff7f23d796e88b3bf1df577de

  return (
    <Card className="action_card" onClick={() => navigate(to)}>
      <div data-id={id} className="action_icon">{icon}</div>

      <h3>{title}</h3>

      <p>{description}</p>

      <div className="action_arrow">
        <FaArrowRight />
      </div>
    </Card>
  );
}

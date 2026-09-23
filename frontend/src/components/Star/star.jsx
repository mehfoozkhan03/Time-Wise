import { FaStar } from "react-icons/fa";
import "./start.css";

export function Star({
  color = "#f59e0b",
  size = "1rem",
  speed = "2s",
  scale = "2.7",
  className = "",
}) {
  return (
    <span
      className={`glow_star_wrapper ${className}`.trim()}
      style={{
        "--glow-star-color": color,
        "--glow-star-size": size,
        "--glow-star-speed": speed,
        "--glow-star-scale": scale,
      }}
    >
      <FaStar className="glow_star glow_star_main" />
      <FaStar className="glow_star glow_star_ring glow_star_ring1" />
      <FaStar className="glow_star glow_star_ring glow_star_ring2" />
    </span>
  );
}

import { statusConfig } from "./statusConfig";
import "./statusPill.css";

export function StatusPill({ status }) {
  const c = statusConfig[status?.toLowerCase()] || {
    label: status || "Unknown",
    dot: "#94a3b8",
  };

  return (
    <span
      className="status_pill"
      style={{ "--status-pill-color": c.dot }}
    >
      <span className="status_pill_label">{c.label}</span>
    </span>
  );
}

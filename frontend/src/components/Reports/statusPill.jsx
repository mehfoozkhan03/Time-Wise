import { statusConfig } from "./statusConfig";

export function StatusPill({ status }) {
  const c = statusConfig[status?.toLowerCase()] || {
    label: status || "Unknown",
    dot: "#94a3b8",
    bg: "#e2e8f0",
    text: "#000",
  };

  return (
    <span
      style={{
        justifyContent: "center",
        alignItems: "center",
        gap: 5,
        background: c.bg,
        color: c.text,
        fontSize: 12,
        fontWeight: 600,
        padding: "3px 9px",
        borderRadius: 20,
      }}
    >
      <span
        style={{
          width: 5,
          height: 5,
          borderRadius: "50%",
          background: c.dot,
          display: "inline-block",
        }}
      />
      {c.label}
    </span>
  );
}

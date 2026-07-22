export function TrendBadge({ value, suffix = "%" }) {
  const positive = value >= 0;

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 2,
        fontSize: 11,
        fontWeight: 600,
        fontFamily: "JetBrains Mono, monospace",
        color: positive ? "#10b981" : "#ef4444",
        background: positive ? "rgba(16,185,129,0.12)" : "rgba(239,68,68,0.12)",
        padding: "2px 6px",
        borderRadius: 6,
      }}
    >
      {positive ? "↑" : "↓"} {Math.abs(value)}
      {suffix}
    </span>
  );
}

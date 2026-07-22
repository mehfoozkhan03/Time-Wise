export function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  return (
    <div
      style={{
        background: "#111827",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 10,
        padding: "10px 14px",
        boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
      }}
    >
      <div
        style={{
          fontSize: 11,
          color: "#64748b",
          marginBottom: 6,
          fontFamily: "JetBrains Mono, monospace",
        }}
      >
        {label}
      </div>

      {payload.map((p) => (
        <div
          key={p.name}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 2,
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: 2,
              background: p.color,
              display: "inline-block",
            }}
          />

          <span
            style={{
              fontSize: 12,
              color: "#94a3b8",
            }}
          >
            {p.name}:
          </span>

          <span
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: "#e8edf5",
              fontFamily: "JetBrains Mono, monospace",
            }}
          >
            {p.value}
            {typeof p.value === "number" &&
            p.name?.toLowerCase().includes("score")
              ? "pts"
              : "h"}
          </span>
        </div>
      ))}
    </div>
  );
}

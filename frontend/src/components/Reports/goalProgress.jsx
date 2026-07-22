export function GoalProgress({ label, current, target, unit, color }) {
  const pct = Math.min((current / target) * 100, 100);
  const exceeded = current >= target;

  return (
    <div style={{ marginBottom: 18 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 8,
        }}
      >
        <span
          style={{
            fontSize: 13,
            fontWeight: 500,
          }}
        >
          {label}
        </span>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span
            style={{
              fontFamily: "JetBrains Mono, monospace",
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            {current}
            <span>
              {" "}
              / {target} {unit}
            </span>
          </span>

          {exceeded && (
            <span
              style={{
                fontSize: 10,
                background: "rgba(16,185,129,0.15)",
                color: "#10b981",
                padding: "2px 7px",
                borderRadius: 5,
                fontWeight: 600,
              }}
            >
              ✓ Goal Met
            </span>
          )}
        </div>
      </div>

      <div
        style={{
          height: 6,
          background: "rgba(255,255,255,0.05)",
          borderRadius: 99,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${pct}%`,
            borderRadius: 99,
            background: `linear-gradient(90deg, ${color}bb, ${color})`,
            transition: "width 1s cubic-bezier(0.4,0,0.2,1)",
            boxShadow: `0 0 8px ${color}66`,
          }}
        />
      </div>
    </div>
  );
}

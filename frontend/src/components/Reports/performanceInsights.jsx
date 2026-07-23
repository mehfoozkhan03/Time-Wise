import { SectionLabel } from "./sectionLabel";

export function PerformanceInsights({ insights }) {
  return (
    <div className="glass-card" style={{ padding: 24 }}>
      <SectionLabel>Performance Insights</SectionLabel>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        {insights.map((ins, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              gap: 12,
              padding: "12px 14px",
              borderRadius: 10,
              background:
                ins.type === "positive"
                  ? "rgba(16,185,129,0.05)"
                  : ins.type === "neutral"
                    ? "rgba(245,158,11,0.05)"
                    : "rgba(99,102,241,0.06)",
              border: `1px solid ${
                ins.type === "positive"
                  ? "rgba(16,185,129,0.12)"
                  : ins.type === "neutral"
                    ? "rgba(245,158,11,0.12)"
                    : "rgba(99,102,241,0.12)"
              }`,
            }}
          >
            <span
              style={{
                fontSize: 15,
                flexShrink: 0,
              }}
            >
              {ins.icon}
            </span>

            <span
              style={{
                fontSize: 13,
                lineHeight: 1.5,
              }}
            >
              {ins.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

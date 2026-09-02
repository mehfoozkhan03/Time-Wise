
import { SectionLabel } from "./sectionLabel";
import { useState, useEffect } from "react";
import Skeleton from "../../components/Skeleton/Skeleton";

export function PerformanceInsights({ insights }) {
const [showSkeleton, setShowSkeleton] = useState(true);

useEffect(() => {
  const timer = setTimeout(() => {
    setShowSkeleton(false);
  }, 1500);

  return () => clearTimeout(timer);
}, []);

  return (
  <div className="glass-card" style={{ padding: 24 }}>

    {showSkeleton ? (
      <div style={{ marginBottom: 20 }}>
        <Skeleton
          width="220px"
          height="28px"
        />
      </div>
    ) : (
      <SectionLabel>Performance Insights</SectionLabel>
    )}

    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}
    >
     {showSkeleton
  ? [...Array(6)].map((_, i) => (
      <div
        key={i}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "12px 14px",
          borderRadius: 10,
          border: "1px solid var(--border)",
          background: "var(--surface)",
        }}
      >
        {/* Icon */}
        <Skeleton
          width="20px"
          height="20px"
          radius="50%"
        />

        {/* Single Text */}
        <Skeleton
          width="85%"
          height="15px"
        />
      </div>
    ))
  : insights.map((ins, i) => (
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

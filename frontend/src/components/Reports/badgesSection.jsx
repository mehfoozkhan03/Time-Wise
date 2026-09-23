
import { SectionLabel } from "../SectionLabel";
import { useState, useEffect } from "react";
import Skeleton from "../../components/Skeleton/Skeleton";

export function BadgesSection({ badges }) {

  //skeleton//
const [showSkeleton, setShowSkeleton] = useState(true);

useEffect(() => {
  const timer = setTimeout(() => {
    setShowSkeleton(false);
  }, 1500);

  return () => clearTimeout(timer);
}, []);

if (showSkeleton) {
  return (
    <div className="glass-card" style={{ padding: 24 }}>

      <Skeleton
        width="220px"
        height="30px"
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 12,
          marginTop: 20,
        }}
      >
        {[...Array(6)].map((_, index) => (
          <div
            key={index}
            style={{
              padding: "16px 10px",
              borderRadius: 12,
              border: "1px solid var(--border)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 10,
            }}
          >
            <Skeleton
              width="44px"
              height="44px"
              radius="12px"
            />

            <Skeleton
              width="80%"
              height="16px"
            />

            <Skeleton
              width="100%"
              height="12px"
            />

            <Skeleton
              width="60px"
              height="20px"
              radius="5px"
            />
          </div>
        ))}
      </div>

    </div>
  );
}
//skeleton//
  return (
    <div className="glass-card" style={{ padding: 24 }}>
      <SectionLabel>Achievement Badges</SectionLabel>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 12,
        }}
      >
        {badges.map((badge) => (
          <div
            key={badge.id}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 8,
              padding: "16px 10px",
              borderRadius: 12,
              textAlign: "center",
              background: badge.earned
                ? `${badge.color}0f`
                : "rgba(255,255,255,0.02)",
              border: badge.earned
                ? `1px solid ${badge.color}2a`
                : "1px solid rgba(255,255,255,0.04)",
              opacity: badge.earned ? 1 : 0.45,
              transition: "transform 0.15s",
              cursor: "default",
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 22,
                background: badge.earned
                  ? `${badge.color}18`
                  : "rgba(255,255,255,0.03)",
                boxShadow: badge.earned ? `0 0 16px ${badge.color}30` : "none",
                border: badge.earned
                  ? `1px solid ${badge.color}30`
                  : "1px solid rgba(255,255,255,0.05)",
              }}
            >
              {badge.icon}
            </div>

            <div
              style={{
                fontSize: 11.5,
                fontWeight: 600,
                color: badge.earned ? "#e8edf5" : "#334155",
                lineHeight: 1.3,
              }}
            >
              {badge.label}
            </div>

            <div
              style={{
                fontSize: 10,
                color: badge.earned ? "#475569" : "#1e2d4a",
              }}
            >
              {badge.desc}
            </div>

            {!badge.earned && (
              <span
                style={{
                  fontSize: 9.5,
                  color: "#334155",
                  background: "rgba(255,255,255,0.03)",
                  padding: "2px 7px",
                  borderRadius: 5,
                }}
              >
                Locked
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

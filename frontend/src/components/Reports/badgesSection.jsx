import { SectionLabel } from "./SectionLabel";

export function BadgesSection({ badges }) {
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

import { Sparkline } from "./Sparkline";
import { TrendBadge } from "./TrendBadge";

export function KPICard({
  icon,
  label,
  value,
  unit,
  trend,
  trendSuffix,
  sparkData,
  sparkColor,
  sub,
}) {
  return (
    <div
      className="glass-card card-hover"
      style={{
        padding: "20px 20px 16px",
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <div>
          <div
            style={{
              fontSize: 11,
              fontWeight: 500,
              color: "#64748b",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              marginBottom: 6,
            }}
          >
            {label}
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: 4,
            }}
          >
            <span
              style={{
                fontFamily: "Outfit, sans-serif",
                fontSize: 28,
                fontWeight: 700,
                color: "#e8edf5",
                lineHeight: 1,
              }}
            >
              {value}
            </span>

            {unit && (
              <span
                style={{
                  fontSize: 13,
                  color: "#475569",
                  fontWeight: 500,
                }}
              >
                {unit}
              </span>
            )}
          </div>

          {sub && (
            <div
              style={{
                fontSize: 11.5,
                color: "#475569",
                marginTop: 4,
              }}
            >
              {sub}
            </div>
          )}
        </div>

        <div
          style={{
            width: 38,
            height: 38,
            borderRadius: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(255,255,255,0.04)",
            fontSize: 18,
            border: "1px solid rgba(255,255,255,0.06)",
            flexShrink: 0,
          }}
        >
          {icon}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
        }}
      >
        <Sparkline data={sparkData} color={sparkColor || "#6366f1"} />

        {trend !== undefined && (
          <TrendBadge value={trend} suffix={trendSuffix || "%"} />
        )}
      </div>

      <div
        style={{
          fontSize: 10.5,
          color: "#334155",
          marginTop: -4,
        }}
      >
        vs. previous period
      </div>
    </div>
  );
}

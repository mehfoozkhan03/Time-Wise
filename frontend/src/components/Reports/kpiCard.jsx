import { Sparkline } from "./Sparkline";
import { TrendBadge } from "./TrendBadge";

export function KPICard(props) {
  const {
    icon,
    label,
    value,
    unit,
    trend,
    trendSuffix,
    sparkData,
    sparkColor,
    sub,
  } = props;
  {
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
                fontSize: 15,
                fontWeight: 500,
                textTransform: "uppercase",
                letterSpacing: "0.01em",
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
                  lineHeight: 1,
                }}
              >
                {value}
              </span>

              {unit && (
                <span
                  style={{
                    fontSize: 15,
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
                  fontSize: 13,
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
            fontSize: 13,
            marginTop: -4,
          }}
        >
          vs. previous period
        </div>
      </div>
    );
  }
}

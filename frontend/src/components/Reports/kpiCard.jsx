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

  const handleMouseMove = (e) => {
    const card = e.currentTarget;

    const rect = card.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const rotateX = -((y - rect.height / 2) / (rect.height / 2)) * 5;
    const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 5;

    requestAnimationFrame(() => {
      card.style.transform = `
      perspective(1000px)
      rotateX(${rotateX}deg)
      rotateY(${rotateY}deg)
    `;

      card.style.setProperty("--mouse-x", `${x}px`);
      card.style.setProperty("--mouse-y", `${y}px`);
    });
  };

  const handleMouseLeave = (e) => {
    const card = e.currentTarget;

    card.style.transition = "transform .25s ease";

    card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg)";

    requestAnimationFrame(() => {
      setTimeout(() => {
        card.style.transition = "";
      }, 250);
    });
  };

  {
    return (
      <div
        className="glass-card card-hover kpi-tilt-card"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
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

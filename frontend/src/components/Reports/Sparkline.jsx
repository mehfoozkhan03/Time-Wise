export function Sparkline({ data, color = "#6366f1", height = 36 }) {
  if (!data || data.length === 0) {
    return null;
  }

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const w = 80;
  const h = height;

  const pts = data.map((v, i) => {
    const x = data.length === 1 ? w / 2 : (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * h;
    return `${x},${y}`;
  });

  const path = `M ${pts.join(" L ")}`;
  const areaPath = `M ${pts[0]} L ${pts.join(" L ")} L ${w},${h} L 0,${h} Z`;

  const lastPoint = pts.at(-1)?.split(",") || [0, h];

  return (
    <svg width={w} height={h} style={{ overflow: "visible" }}>
      <defs>
        <linearGradient
          id={`sg-${color.replace("#", "")}`}
          x1="0"
          y1="0"
          x2="0"
          y2="1"
        >
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>

      <path d={areaPath} fill={`url(#sg-${color.replace("#", "")})`} />

      <path
        d={path}
        stroke={color}
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <circle cx={lastPoint[0]} cy={lastPoint[1]} r="2.5" fill={color} />
    </svg>
  );
}

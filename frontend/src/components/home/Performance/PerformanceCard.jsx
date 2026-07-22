import './PerformanceCard.css'

import Card from '../../Card/Card'

export default function PerformanceCard({
  title,
  value,
  subtitle,
  progress,
  color,
  icon,
}) {
  const safeProgress = Math.max(0, Math.min(progress || 0, 100))

  return (
    <Card className="performance_card">
      <div className="performance_top">
        <div
          className="performance_icon"
          style={{
            color,
            background: `${color}20`,
          }}
        >
          {icon}
        </div>

        <div>
          <p>{title}</p>
          <h2>{value}</h2>
        </div>
      </div>

      <div className="performance_progress">
        <div
          className="performance_fill"
          style={{
            width: `${safeProgress}%`,
            background: color,
          }}
        />
      </div>

      <span>{subtitle}</span>
    </Card>
  )
}

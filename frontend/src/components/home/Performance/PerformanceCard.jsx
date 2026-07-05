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
  return (
    <Card className="performance_card">
      <div className="performance_top">
        <div className="performance_icon">{icon}</div>

        <div>
          <p>{title}</p>
          <h2>{value}</h2>
        </div>
      </div>

      <div className="performance_progress">
        <div
          className="performance_fill"
          style={{
            width: `${progress}%`,
            background: color,
          }}
        ></div>
      </div>

      <span>{subtitle}</span>
    </Card>
  )
}

import './StatCard.css'
import Card from '../Card/Card'

export default function StatCard({ icon, title, value, subtitle, progress }) {
  return (
    <Card className="stat_card">
      <div className="stat_card_header">
        <div className="stat_icon">{icon}</div>

        <div className="stat_content">
          <p>{title}</p>
          <h2>{value}</h2>
        </div>
      </div>

      <div className="stat_progress">
        <div className="progress_fill" style={{ width: `${progress}%` }}></div>
      </div>

      <span className="stat_subtitle">{subtitle}</span>
    </Card>
  )
}

import './UpdateCard.css'

export default function UpdateCard({ icon, title, description, time, color }) {
  return (
    <div className="update_card">
      <div className="update_icon" style={{ background: color }}>
        {icon}
      </div>

      <div className="update_content">
        <h4>{title}</h4>

        <p>{description}</p>
      </div>

      <span>{time}</span>
    </div>
  )
}

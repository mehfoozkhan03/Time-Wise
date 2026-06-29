import "./Card.css"

export default function Card({ children, className = "", hover = true,}) {
  return (
    <div className={`tw_card${hover ? "tw_Card_hover" : ""}${className}`}>
     {children}
    </div>
  )
}

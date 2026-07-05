import './Card.css'

export default function Card({
  children,
  className = '',
  hover = true,
  ...props
}) {
  return (
    <div
      className={`tw_card ${hover ? 'tw_card_hover' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

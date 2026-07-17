import './BreakModal.css'

import { FaCoffee, FaPlay } from 'react-icons/fa'

export default function BreakModal({ isOpen, onResume, breakSeconds }) {
  const BREAK_LIMIT = 30 * 60

  if (!isOpen) return null

  const formatTime = (value) => {
    const mins = Math.floor(value / 60)
    const secs = value % 60

    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }

  const remaining = Math.max(BREAK_LIMIT - breakSeconds, 0)

  return (
    <div className="break_overlay">
      <div className="break_modal">
        <div className="break_icon">
          <FaCoffee />
        </div>

        <h2>Break Started</h2>

        <p>Relax for a while. Your break timer is running.</p>

        <div className="break_timer">{formatTime(breakSeconds)}</div>

        <div className="break_remaining">
          Remaining
          <strong>{formatTime(remaining)}</strong>
        </div>

        <button className="resume_button" onClick={onResume}>
          <FaPlay />
          Resume Work
        </button>
      </div>
    </div>
  )
}

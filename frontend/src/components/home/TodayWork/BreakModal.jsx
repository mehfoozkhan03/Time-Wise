import './BreakModal.css'

import { FaCoffee, FaPlay, FaExclamationTriangle } from 'react-icons/fa'

export default function BreakModal({ isOpen, onResume, breakSeconds }) {
  const BREAK_LIMIT = 30 * 60

  if (!isOpen) return null

  const formatTime = (value) => {
    const safeValue = Math.max(Math.floor(value), 0)

    const mins = Math.floor(safeValue / 60)
    const secs = safeValue % 60

    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }

  const remaining = Math.max(BREAK_LIMIT - breakSeconds, 0)
  const exceededSeconds = Math.max(breakSeconds - BREAK_LIMIT, 0)
  const hasExceededLimit = breakSeconds >= BREAK_LIMIT

  return (
    <div className="break_overlay">
      <div
        className={`break_modal ${
          hasExceededLimit ? 'break_limit_reached' : ''
        }`}
      >
        <div className="break_icon">
          {hasExceededLimit ? <FaExclamationTriangle /> : <FaCoffee />}
        </div>

        <h2>{hasExceededLimit ? 'Break Limit Reached' : 'Break Started'}</h2>

        <p>
          {hasExceededLimit
            ? 'Your 30-minute break limit has been reached. Please resume work.'
            : 'Relax for a while. Your break timer is running.'}
        </p>

        <div className="break_timer">{formatTime(breakSeconds)}</div>

        {!hasExceededLimit ? (
          <div className="break_remaining">
            Remaining
            <strong>{formatTime(remaining)}</strong>
          </div>
        ) : (
          <div className="break_exceeded">
            <span>Exceeded by</span>
            <strong>{formatTime(exceededSeconds)}</strong>
          </div>
        )}

        <button className="resume_button" onClick={onResume}>
          <FaPlay />
          Resume Work
        </button>
      </div>
    </div>
  )
}

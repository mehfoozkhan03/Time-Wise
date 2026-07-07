import './BreakModal.css'

import { useEffect, useState } from 'react'

import { FaCoffee, FaPlay } from 'react-icons/fa'

export default function BreakModal({ isOpen, onResume }) {
  const BREAK_LIMIT = 30 * 60 // 30 minutes

  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    if (!isOpen) {
      setSeconds(0)
      return
    }

    const interval = setInterval(() => {
      setSeconds((prev) => prev + 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [isOpen])

  if (!isOpen) return null

  const formatTime = (value) => {
    const mins = Math.floor(value / 60)
    const secs = value % 60

    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }

  const remaining = Math.max(BREAK_LIMIT - seconds, 0)

  return (
    <div className="break_overlay">
      <div className="break_modal">
        <div className="break_icon">
          <FaCoffee />
        </div>

        <h2>Break Started</h2>

        <p>Relax for a while. Your break timer is running.</p>

        <div className="break_timer">{formatTime(seconds)}</div>

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

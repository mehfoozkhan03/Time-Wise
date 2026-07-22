import './TodayWork.css'

import { useEffect, useState } from 'react'

import Card from '../../Card/Card'
import BreakModal from './BreakModal'

import useAttendance from '../../../hooks/useAttendance'

import { FaCircle, FaClock, FaCoffee, FaSignInAlt } from 'react-icons/fa'

export default function TodayWork() {
  const {
    attendance,
    loading,
    status,
    checkIn,
    startBreak,
    endBreak,
    checkOut,
    sessionTime,
    workingTime,
    breakTime,
    breakSeconds,
  } = useAttendance()

  const [showBreakModal, setShowBreakModal] = useState(false)

  useEffect(() => {
    setShowBreakModal(status === 'break')
  }, [status])

  const handleBreak = async () => {
    await startBreak()
  }

  const handleResume = async () => {
    await endBreak()
  }

  const getStatus = () => {
    switch (status) {
      case 'idle':
        return 'Not Checked In'

      case 'working':
        return 'Working'

      case 'break':
        return 'On Break'

      case 'checkedout':
        return 'Checked Out'

      default:
        return 'Not Checked In'
    }
  }

  const renderButton = () => {
    switch (status) {
      case 'idle':
        return (
          <button
            className="today_primary_button"
            onClick={checkIn}
            disabled={loading}
          >
            Check In
          </button>
        )

      case 'working':
        return (
          <>
            <button
              className="today_primary_button break"
              onClick={handleBreak}
              disabled={loading}
            >
              Take Break
            </button>

            <button
              className="today_primary_button checkout"
              onClick={checkOut}
              disabled={loading}
            >
              Check Out
            </button>
          </>
        )

      case 'break':
        return (
          <button
            className="today_primary_button resume"
            onClick={handleResume}
            disabled={loading}
          >
            Resume Work
          </button>
        )

      case 'checkedout':
        return (
          <button className="today_primary_button finished" disabled>
            Work Completed
          </button>
        )

      default:
        return null
    }
  }

  return (
    <>
      <Card className="today_work" id="tour-today-work">
        <div className="today_header">
          <div>
            <h2>Today's Work</h2>

            <p>Your attendance summary for today</p>
          </div>

          <div className={`today_status ${status}`}>
            <FaCircle />
            {getStatus()}
          </div>
        </div>

        <div className="today_content">
          <div className="today_stat">
            <FaSignInAlt />

            <div>
              <span>Checked In</span>

              <strong>
                {attendance?.checkInTime
                  ? new Date(attendance.checkInTime).toLocaleTimeString()
                  : '--:--'}
              </strong>
            </div>
          </div>

          <div className="today_stat">
            <FaClock />

            <div>
              <span>Current Session</span>

              <strong>{sessionTime}</strong>
            </div>
          </div>

          <div className="today_stat">
            <FaClock />

            <div>
              <span>Working Time</span>

              <strong>{workingTime}</strong>
            </div>
          </div>

          <div className="today_stat">
            <FaCoffee />

            <div>
              <span>Break Used</span>

              <strong>{breakTime}</strong>
            </div>
          </div>
        </div>

        <div className="today_action">{renderButton()}</div>
      </Card>

      <BreakModal
        isOpen={showBreakModal}
        onResume={handleResume}
        breakSeconds={breakSeconds}
      />
    </>
  )
}

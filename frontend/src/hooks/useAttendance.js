import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import {
  checkIn,
  checkOut,
  startBreak,
  endBreak,
  getTodayAttendance,
  getAttendanceHistory,
} from '../store/attendanceSlice'

export default function useAttendance() {
  const dispatch = useDispatch()

  const {
    today: attendance,
    history,
    loading,
    error,
  } = useSelector((state) => state.attendance)

  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    dispatch(getTodayAttendance())

    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(interval)
  }, [dispatch])

  // ================= API Actions =================

  // ================= API Actions =================

  const handleCheckIn = () => dispatch(checkIn())

  const handleStartBreak = () => dispatch(startBreak())

  const handleEndBreak = () => dispatch(endBreak())

  const handleCheckOut = () => dispatch(checkOut())

  const fetchAttendanceHistory = () => dispatch(getAttendanceHistory())

  // ================= Derived Status =================

  const status = useMemo(() => {
    if (!attendance) return 'idle'

    if (attendance.checkOutTime) return 'checkedout'

    const breaks = attendance.breaks || []

    const lastBreak = breaks[breaks.length - 1]

    if (lastBreak && !lastBreak.breakEnd) {
      return 'break'
    }

    return 'working'
  }, [attendance])

  // ================= Session Time =================

  const sessionSeconds = useMemo(() => {
    if (!attendance?.checkInTime) return 0

    const start = new Date(attendance.checkInTime)

    const end = attendance.checkOutTime
      ? new Date(attendance.checkOutTime)
      : currentTime

    return Math.max(Math.floor((end.getTime() - start.getTime()) / 1000), 0)
  }, [attendance, currentTime])

  // ================= Break Time =================

  const breakSeconds = useMemo(() => {
    if (!attendance) return 0

    let seconds = attendance.totalBreakSeconds || 0

    const breaks = attendance.breaks || []

    const lastBreak = breaks[breaks.length - 1]

    if (lastBreak && !lastBreak.breakEnd) {
      seconds += Math.floor(
        (currentTime.getTime() - new Date(lastBreak.breakStart).getTime()) /
          1000,
      )
    }

    return seconds
  }, [attendance, currentTime])

  // ================= Working Time =================

  const workingSeconds = useMemo(() => {
    return Math.max(sessionSeconds - breakSeconds, 0)
  }, [sessionSeconds, breakSeconds])

  // ================= Formatter =================

  function formatTime(seconds) {
    const h = String(Math.floor(seconds / 3600)).padStart(2, '0')
    const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0')
    const s = String(seconds % 60).padStart(2, '0')

    return `${h}:${m}:${s}`
  }

  return {
    attendance,

    history,

    loading,

    error,

    status,

    checkIn: handleCheckIn,

    startBreak: handleStartBreak,

    endBreak: handleEndBreak,

    checkOut: handleCheckOut,

    fetchAttendanceHistory,

    sessionTime: formatTime(sessionSeconds),

    workingTime: formatTime(workingSeconds),

    breakTime: formatTime(breakSeconds),

    sessionSeconds,

    workingSeconds,

    breakSeconds,
  }
}

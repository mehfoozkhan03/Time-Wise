/* import { useEffect, useMemo, useState } from 'react'

export default function useAttendance() {
  const [attendance, setAttendance] = useState({
    status: 'idle', // idle | working | break | checkedout

    checkInTime: null,

    checkOutTime: null,

    breakStart: null,

    totalBreakSeconds: 0,
  })

  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  function checkIn() {
    setAttendance((prev) => ({
      ...prev,
      status: 'working',
      checkInTime: new Date(),
      checkOutTime: null,
      totalBreakSeconds: 0,
      breakStart: null,
    }))
  }

  function startBreak() {
    setAttendance((prev) => ({
      ...prev,
      status: 'break',
      breakStart: new Date(),
    }))
  }

  function endBreak() {
    setAttendance((prev) => {
      const seconds = Math.floor((new Date() - prev.breakStart) / 1000) || 0

      return {
        ...prev,
        status: 'working',
        breakStart: null,
        totalBreakSeconds: prev.totalBreakSeconds + seconds,
      }
    })
  }

  function checkOut() {
    setAttendance((prev) => ({
      ...prev,
      status: 'checkedout',
      checkOutTime: new Date(),
    }))
  }

  const sessionSeconds = useMemo(() => {
    if (!attendance.checkInTime) return 0

    return Math.floor((currentTime - attendance.checkInTime) / 1000)
  }, [currentTime, attendance.checkInTime])

  const workingSeconds = useMemo(() => {
    let total = sessionSeconds - attendance.totalBreakSeconds

    if (attendance.status === 'break' && attendance.breakStart) {
      total -= Math.floor((currentTime - attendance.breakStart) / 1000)
    }

    return Math.max(total, 0)
  }, [
    sessionSeconds,
    attendance.totalBreakSeconds,
    attendance.breakStart,
    attendance.status,
    currentTime,
  ])

  function formatTime(seconds) {
    const h = String(Math.floor(seconds / 3600)).padStart(2, '0')

    const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0')

    const s = String(seconds % 60).padStart(2, '0')

    return `${h}:${m}:${s}`
  }

  return {
    attendance,

    checkIn,

    startBreak,

    endBreak,

    checkOut,

    sessionTime: formatTime(sessionSeconds),

    workingTime: formatTime(workingSeconds),

    breakTime: formatTime(attendance.totalBreakSeconds),
  }
}
 */

import { useEffect, useMemo, useState } from 'react'

export default function useAttendance() {
  const [attendance, setAttendance] = useState({
    status: 'idle', // idle | working | break | checkedout

    checkInTime: null,
    checkOutTime: null,

    breakStart: null,
    totalBreakSeconds: 0,
  })

  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  function checkIn() {
    setAttendance((prev) => {
      if (prev.status !== 'idle' && prev.status !== 'checkedout') return prev

      return {
        status: 'working',
        checkInTime: new Date(),
        checkOutTime: null,
        breakStart: null,
        totalBreakSeconds: 0,
      }
    })
  }

  function startBreak() {
    setAttendance((prev) => {
      if (prev.status !== 'working') return prev

      return {
        ...prev,
        status: 'break',
        breakStart: new Date(),
      }
    })
  }

  function endBreak() {
    setAttendance((prev) => {
      if (prev.status !== 'break' || !prev.breakStart) return prev

      const seconds = Math.floor((new Date() - prev.breakStart) / 1000)

      return {
        ...prev,
        status: 'working',
        breakStart: null,
        totalBreakSeconds: prev.totalBreakSeconds + seconds,
      }
    })
  }

  function checkOut() {
    setAttendance((prev) => {
      if (prev.status === 'idle' || prev.status === 'checkedout') return prev

      let extraBreak = 0

      // Automatically end an active break on checkout
      if (prev.status === 'break' && prev.breakStart) {
        extraBreak = Math.floor((new Date() - prev.breakStart) / 1000)
      }

      return {
        ...prev,
        status: 'checkedout',
        checkOutTime: new Date(),
        breakStart: null,
        totalBreakSeconds: prev.totalBreakSeconds + extraBreak,
      }
    })
  }

  const sessionSeconds = useMemo(() => {
    if (!attendance.checkInTime) return 0

    const endTime = attendance.checkOutTime || currentTime

    return Math.max(Math.floor((endTime - attendance.checkInTime) / 1000), 0)
  }, [attendance.checkInTime, attendance.checkOutTime, currentTime])

  const breakSeconds = useMemo(() => {
    if (attendance.status === 'break' && attendance.breakStart) {
      return (
        attendance.totalBreakSeconds +
        Math.floor((currentTime - attendance.breakStart) / 1000)
      )
    }

    return attendance.totalBreakSeconds
  }, [
    attendance.status,
    attendance.breakStart,
    attendance.totalBreakSeconds,
    currentTime,
  ])

  const workingSeconds = useMemo(() => {
    return Math.max(sessionSeconds - breakSeconds, 0)
  }, [sessionSeconds, breakSeconds])

  function formatTime(seconds) {
    const h = String(Math.floor(seconds / 3600)).padStart(2, '0')
    const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0')
    const s = String(seconds % 60).padStart(2, '0')

    return `${h}:${m}:${s}`
  }

  return {
    attendance,

    checkIn,
    startBreak,
    endBreak,
    checkOut,

    sessionTime: formatTime(sessionSeconds),
    workingTime: formatTime(workingSeconds),
    breakTime: formatTime(breakSeconds),
  }
}

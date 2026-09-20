import { formatWorkingHours } from '../utils/attendanceHelper.js'

import { attendanceConfig } from '../config/attendanceConfig.js'

import { attendanceModel } from '../models/Attendance.model.js'

import { holidayModel } from '../models/Holidays.model.js'
import { userModel } from '../models/User.model.js'

// =======================================================
// Constants
// =======================================================

const INDIA_TIME_ZONE = 'Asia/Kolkata'

// =======================================================
// Date Helpers
// =======================================================

const getIndiaDateParts = (date = new Date()) => {
  const value = new Date(date)

  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: INDIA_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    weekday: 'long',
  })

  const parts = formatter.formatToParts(value)

  const getPart = (type) => parts.find((part) => part.type === type)?.value

  return {
    year: Number(getPart('year')),
    month: Number(getPart('month')),
    day: Number(getPart('day')),
    weekday: getPart('weekday'),
  }
}

// =======================================================
// Date Key
// =======================================================

const getDateKey = (date = new Date()) => {
  const { year, month, day } = getIndiaDateParts(date)

  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(
    2,
    '0',
  )}`
}

// =======================================================
// Weekday
// =======================================================

const getWeekday = (date = new Date()) => {
  const { weekday } = getIndiaDateParts(date)

  const weekdayMap = {
    Sunday: 0,
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
  }

  return weekdayMap[weekday]
}

// =======================================================
// India Midnight
// =======================================================

const getIndiaMidnight = (date = new Date()) => {
  const { year, month, day } = getIndiaDateParts(date)

  /*
    Midnight in India = previous day 18:30 UTC.
  */

  return new Date(Date.UTC(year, month - 1, day, -5, -30, 0, 0))
}

// =======================================================
// Start / End Of India Day
// =======================================================

const startOfDay = (date = new Date()) => {
  return getIndiaMidnight(date)
}

const endOfDay = (date = new Date()) => {
  const result = new Date(startOfDay(date))

  result.setUTCDate(result.getUTCDate() + 1)
  result.setUTCMilliseconds(result.getUTCMilliseconds() - 1)

  return result
}

// =======================================================
// Add Days
// =======================================================

const addDays = (date, amount) => {
  const result = new Date(date)

  result.setUTCDate(result.getUTCDate() + amount)

  return result
}

// =======================================================
// Working Day
// =======================================================

const isConfiguredWorkingDay = (date) => {
  const weekday = getWeekday(date)

  return attendanceConfig.workingDays.includes(weekday)
}

// =======================================================
// Holiday Date Key
// =======================================================

const getHolidayDateKey = (holiday) => {
  return getDateKey(holiday.date)
}

// =======================================================
// Effective Working Seconds
// =======================================================

/*
  Returns the actual working seconds for an attendance record.

  For completed sessions:
    totalWorkingSeconds is already stored by checkout.

  For an active session:
    current time
    - check-in time
    - completed breaks
    - currently active break

  This allows the dashboard to show live working hours.
*/

const getEffectiveWorkingSeconds = (record, now = new Date()) => {
  // -----------------------------------------------------
  // No check-in
  // -----------------------------------------------------

  if (!record?.checkInTime) {
    return 0
  }

  // -----------------------------------------------------
  // Already checked out
  // -----------------------------------------------------

  if (record.checkOutTime) {
    return Math.max(record.totalWorkingSeconds || 0, 0)
  }

  // -----------------------------------------------------
  // IMPORTANT:
  // Only calculate live time for TODAY'S open session.
  //
  // An old attendance record without checkout must NOT
  // continue accumulating hours indefinitely.
  // -----------------------------------------------------

  const recordDateKey = getDateKey(record.date)
  const todayDateKey = getDateKey(now)

  if (recordDateKey !== todayDateKey) {
    return Math.max(record.totalWorkingSeconds || 0, 0)
  }

  // -----------------------------------------------------
  // Today's active session
  // -----------------------------------------------------

  const elapsedSeconds = Math.floor(
    (new Date(now).getTime() - new Date(record.checkInTime).getTime()) / 1000,
  )

  // -----------------------------------------------------
  // Completed breaks
  // -----------------------------------------------------

  const completedBreakSeconds = record.totalBreakSeconds || 0

  // -----------------------------------------------------
  // Currently active break
  // -----------------------------------------------------

  let activeBreakSeconds = 0

  const breaks = record.breaks || []

  const lastBreak = breaks[breaks.length - 1]

  if (lastBreak?.breakStart && !lastBreak?.breakEnd) {
    activeBreakSeconds = Math.floor(
      (new Date(now).getTime() - new Date(lastBreak.breakStart).getTime()) /
        1000,
    )
  }

  // -----------------------------------------------------
  // Final live working time
  // -----------------------------------------------------

  return Math.max(
    elapsedSeconds - completedBreakSeconds - activeBreakSeconds,
    0,
  )
}

// =======================================================
// Get Attendance Stats
// =======================================================

export const getAttendanceStats = async (userID) => {
  const now = new Date()

  // =====================================================
  // Today
  // =====================================================

  const todayStart = startOfDay(now)
  const todayEnd = endOfDay(now)

  // =====================================================
  // Today's Attendance - All Employees
  // =====================================================

  const totalPresentToday = await attendanceModel.countDocuments({
    date: {
      $gte: todayStart,
      $lte: todayEnd,
    },
    checkInTime: {
      $ne: null,
    },
  })

  const totalOnBreakToday = await attendanceModel.countDocuments({
    date: {
      $gte: todayStart,
      $lte: todayEnd,
    },
    breaks: {
      $elemMatch: {
        breakStart: { $ne: null },
        breakEnd: null,
      },
    },
  })

  const totalLateCheckInsToday = await attendanceModel.countDocuments({
    date: {
      $gte: todayStart,
      $lte: todayEnd,
    },
    checkInTime: {
      $ne: null,
    },
    status: 'Late',
  })

  // =====================================================
  // Today's Attendance Records
  // =====================================================

  const todayAttendance = await attendanceModel
    .find({
      date: {
        $gte: todayStart,
        $lte: todayEnd,
      },
    })
    .populate('user', 'firstName lastName department designation')

  const formatTime = (date) => {
    if (!date) return '--'

    return new Date(date).toLocaleTimeString('en-US', {
      timeZone: INDIA_TIME_ZONE,
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })
  }

  const formatBreakTime = (breaks = []) => {
    if (!breaks.length) return '--'

    return breaks
      .filter((item) => item.breakStart)
      .map((item) => {
        const start = formatTime(item.breakStart)
        const end = item.breakEnd ? formatTime(item.breakEnd) : '--'

        return `${start}–${end}`
      })
      .join(', ')
  }

  const formatRecordWorkingHours = (seconds = 0) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)

    return `${hours}h ${minutes}m`
  }

  const todayAttendanceRecords = todayAttendance.map((record) => {
    const user = record.user

    return {
      _id: record._id,

      avatar: `${user?.firstName?.[0] || ''}${
        user?.lastName?.[0] || ''
      }`.toUpperCase(),

      name: `${user?.firstName || ''} ${user?.lastName || ''}`.trim(),

      department: user?.department || user?.designation || '--',

      checkIn: formatTime(record.checkInTime),

      breakTime: formatBreakTime(record.breaks),

      checkOut: formatTime(record.checkOutTime),

      workingHours: formatRecordWorkingHours(
        getEffectiveWorkingSeconds(record, now),
      ),

      status: record.status || 'Absent',
    }
  })

  // =====================================================
  // Current India Date
  // =====================================================

  const indiaToday = getIndiaMidnight(now)

  const todayWeekday = getWeekday(now)

  // =====================================================
  // Week Range - Monday to Sunday - India Time
  // =====================================================

  const daysSinceMonday = todayWeekday === 0 ? 6 : todayWeekday - 1

  const weekStart = addDays(indiaToday, -daysSinceMonday)

  const weekEnd = new Date(addDays(weekStart, 7).getTime() - 1)

  // =====================================================
  // Month Range - India Time
  // =====================================================

  const { year: currentYear, month: currentMonth } = getIndiaDateParts(now)

  const monthStart = new Date(
    Date.UTC(currentYear, currentMonth - 1, 1, -5, -30, 0, 0),
  )

  const nextMonthStart = new Date(
    Date.UTC(currentYear, currentMonth, 1, -5, -30, 0, 0),
  )

  const monthEnd = new Date(nextMonthStart.getTime() - 1)

  // =====================================================
  // Weekly Attendance Chart
  // =====================================================

  const totalEmployees = await userModel.countDocuments()

  const weeklyCompanyAttendance = await attendanceModel.find({
    date: {
      $gte: weekStart,
      $lte: weekEnd,
    },
  })

  const weeklyAttendanceChart = []

  for (let i = 6; i >= 0; i--) {
    const date = addDays(indiaToday, -i)

    const dayStart = startOfDay(date)
    const dayEnd = endOfDay(date)

    const dayAttendance = weeklyCompanyAttendance.filter(
      (record) => record.date >= dayStart && record.date <= dayEnd,
    )

    const present = dayAttendance.filter(
      (record) =>
        record.checkInTime &&
        ['Present', 'Late', 'Half Day'].includes(record.status),
    ).length

    const absent = Math.max(totalEmployees - present, 0)

    weeklyAttendanceChart.push({
      day: new Intl.DateTimeFormat('en-US', {
        timeZone: INDIA_TIME_ZONE,
        weekday: 'short',
      }).format(date),

      present,
      absent,
    })
  }

  // =====================================================
  // Active Holidays
  // =====================================================

  const holidays = await holidayModel
    .find({
      isActive: true,
    })
    .select('date')
    .lean()

  const holidayDateSet = new Set(
    holidays.map((holiday) => getHolidayDateKey(holiday)),
  )

  const isAttendanceWorkingDay = (date) => {
    if (!isConfiguredWorkingDay(date)) {
      return false
    }

    return !holidayDateSet.has(getDateKey(date))
  }

  // =====================================================
  // Weekly Attendance - USER
  // =====================================================

  const weeklyAttendance = await attendanceModel.find({
    user: userID,
    date: {
      $gte: weekStart,
      $lte: weekEnd,
    },
  })

  const validWeeklyAttendance = weeklyAttendance.filter((record) =>
    isAttendanceWorkingDay(record.date),
  )

  // =====================================================
  // WEEKLY HOURS - LIVE
  // =====================================================

  /*
    IMPORTANT:

    For a completed attendance record:
      use totalWorkingSeconds.

    For today's currently active record:
      calculate elapsed working time live.

    Therefore Weekly Hours updates even before checkout.
  */

  const totalWeeklySeconds = validWeeklyAttendance.reduce((sum, record) => {
    return sum + getEffectiveWorkingSeconds(record, now)
  }, 0)

  const weeklyHours = totalWeeklySeconds / 3600

  // =====================================================
  // Monthly Attendance
  // =====================================================

  const monthlyAttendance = await attendanceModel.find({
    user: userID,
    date: {
      $gte: monthStart,
      $lte: monthEnd,
    },
  })

  const validMonthlyAttendance = monthlyAttendance.filter((record) =>
    isAttendanceWorkingDay(record.date),
  )

  // =====================================================
  // Monthly Hours
  // =====================================================

  const totalMonthlySeconds = validMonthlyAttendance.reduce((sum, record) => {
    return sum + getEffectiveWorkingSeconds(record, now)
  }, 0)

  const monthlyHours = formatWorkingHours(totalMonthlySeconds)

  // =====================================================
  // All Attendance History
  // =====================================================

  const attendanceHistory = await attendanceModel
    .find({
      user: userID,
    })
    .sort({
      date: -1,
    })

  const validAttendanceHistory = attendanceHistory.filter((record) =>
    isAttendanceWorkingDay(record.date),
  )

  // =====================================================
  // Total Working Hours
  // =====================================================

  const totalWorkingSeconds = validAttendanceHistory.reduce((sum, record) => {
    return sum + getEffectiveWorkingSeconds(record, now)
  }, 0)

  const totalWorkingHours = formatWorkingHours(totalWorkingSeconds)

  // =====================================================
  // Average Daily Working Hours
  // =====================================================

  const averageDailyHours =
    validAttendanceHistory.length === 0
      ? 0
      : +(totalWorkingSeconds / validAttendanceHistory.length / 3600).toFixed(1)

  // =====================================================
  // Average Check-in Time
  // =====================================================

  const checkInRecords = validMonthlyAttendance.filter(
    (record) => record.checkInTime,
  )

  let averageCheckIn = '--:--'

  if (checkInRecords.length > 0) {
    const totalMinutes = checkInRecords.reduce((sum, record) => {
      const parts = new Intl.DateTimeFormat('en-US', {
        timeZone: INDIA_TIME_ZONE,
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }).formatToParts(new Date(record.checkInTime))

      const hours = Number(
        parts.find((part) => part.type === 'hour')?.value || 0,
      )

      const minutes = Number(
        parts.find((part) => part.type === 'minute')?.value || 0,
      )

      return sum + hours * 60 + minutes
    }, 0)

    const averageMinutes = Math.round(totalMinutes / checkInRecords.length)

    const hours = Math.floor(averageMinutes / 60)

    const minutes = averageMinutes % 60

    averageCheckIn = `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}`
  }

  // =====================================================
  // Average Break Duration
  // =====================================================

  const averageBreakDuration =
    checkInRecords.length === 0
      ? 0
      : Math.round(
          validMonthlyAttendance.reduce(
            (sum, record) => sum + (record.totalBreakSeconds || 0),
            0,
          ) /
            checkInRecords.length /
            60,
        )

  // =====================================================
  // Leaves Taken
  // =====================================================

  const leavesTaken = validMonthlyAttendance.filter(
    (record) => record.status === 'Leave',
  ).length

  // =====================================================
  // Overtime
  // =====================================================

  const requiredDailySeconds = attendanceConfig.requiredDailyHours * 60 * 60

  const totalOvertimeSeconds = validMonthlyAttendance.reduce(
    (total, record) => {
      const workingSeconds = getEffectiveWorkingSeconds(record, now)

      if (workingSeconds <= requiredDailySeconds) {
        return total
      }

      return total + (workingSeconds - requiredDailySeconds)
    },
    0,
  )

  const overtimeHours = formatWorkingHours(totalOvertimeSeconds)

  // =====================================================
  // Total Overtime Hours
  // =====================================================

  /*
    Match Reports behavior:
    count ALL historical records.
  */

  let allTimeOvertimeSeconds = 0

  for (const record of attendanceHistory) {
    const workingSeconds = getEffectiveWorkingSeconds(record, now)

    const overtimeSeconds = Math.max(0, workingSeconds - requiredDailySeconds)

    allTimeOvertimeSeconds += overtimeSeconds
  }

  const totalOvertimeHours = formatWorkingHours(allTimeOvertimeSeconds)

  // =====================================================
  // Attendance Percentage
  // =====================================================

  let workingDays = 0

  for (
    let date = new Date(monthStart);
    date <= indiaToday;
    date = addDays(date, 1)
  ) {
    if (isAttendanceWorkingDay(date)) {
      workingDays++
    }
  }

  const attendanceCredits = validMonthlyAttendance.reduce((total, record) => {
    switch (record.status) {
      case 'Present':
        return total + 1

      case 'Late':
        return total + 0.75

      case 'Half Day':
        return total + 0.5

      default:
        return total
    }
  }, 0)

  const attendancePercentage =
    workingDays === 0
      ? 0
      : Math.min(Math.round((attendanceCredits / workingDays) * 100), 100)

  const attendedDays = validMonthlyAttendance.filter((record) =>
    ['Present', 'Late', 'Half Day'].includes(record.status),
  ).length

  // =====================================================
  // Weekly Goal Score
  // =====================================================

  const weeklyGoalScore = Math.min(
    (weeklyHours / attendanceConfig.requiredWeeklyHours) * 100,
    100,
  )

  // =====================================================
  // Punctuality
  // =====================================================

  let punctualityCredits = 0

  validMonthlyAttendance.forEach((record) => {
    switch (record.status) {
      case 'Present':
        punctualityCredits += 1
        break

      case 'Late':
        punctualityCredits += 0.5
        break

      default:
        break
    }
  })

  const punctuality =
    attendedDays === 0
      ? 100
      : Math.round((punctualityCredits / attendedDays) * 100)

  // =====================================================
  // Break Discipline
  // =====================================================

  const allowedBreak = attendanceConfig.maxBreakMinutes

  let breakScore = 100

  if (averageBreakDuration > allowedBreak) {
    breakScore = Math.max(0, 100 - (averageBreakDuration - allowedBreak) * 2)
  }

  // =====================================================
  // Productivity
  // =====================================================

  const productivity = Math.round(
    weeklyGoalScore * 0.5 +
      attendancePercentage * 0.2 +
      punctuality * 0.2 +
      breakScore * 0.1,
  )

  // =====================================================
  // Attendance Records For Streaks
  // =====================================================

  const attendanceRecords = attendanceHistory
    .filter(
      (record) =>
        isAttendanceWorkingDay(record.date) &&
        ['Present', 'Late', 'Half Day'].includes(record.status),
    )
    .sort((a, b) => b.date - a.date)

  const attendanceDateSet = new Set(
    attendanceRecords.map((record) => getDateKey(record.date)),
  )

  // =====================================================
  // Current Streak
  // =====================================================

  let dayStreak = 0

  /*
    IMPORTANT:

    indiaToday is already midnight for the
    current Indian business date.

    Friday September 11 therefore remains
    Friday regardless of the server timezone.
  */

  let cursor = new Date(indiaToday)

  while (!isAttendanceWorkingDay(cursor)) {
    cursor = addDays(cursor, -1)
  }

  while (true) {
    const cursorKey = getDateKey(cursor)

    if (!attendanceDateSet.has(cursorKey)) {
      break
    }

    dayStreak++

    cursor = addDays(cursor, -1)

    while (!isAttendanceWorkingDay(cursor)) {
      cursor = addDays(cursor, -1)
    }
  }

  // =====================================================
  // Longest Streak
  // =====================================================

  let longestStreak = 0
  let currentStreak = 0

  const sortedDateKeys = [
    ...new Set(attendanceRecords.map((record) => getDateKey(record.date))),
  ].sort()

  let previousDate = null

  for (const dateKey of sortedDateKeys) {
    const [year, month, day] = dateKey.split('-').map(Number)

    const currentDate = new Date(Date.UTC(year, month - 1, day, -5, -30, 0, 0))

    if (!previousDate) {
      currentStreak = 1

      longestStreak = 1

      previousDate = currentDate

      continue
    }

    let expectedDate = addDays(previousDate, 1)

    while (!isAttendanceWorkingDay(expectedDate)) {
      expectedDate = addDays(expectedDate, 1)
    }

    if (getDateKey(currentDate) === getDateKey(expectedDate)) {
      currentStreak++
    } else {
      currentStreak = 1
    }

    longestStreak = Math.max(longestStreak, currentStreak)

    previousDate = currentDate
  }

  // =====================================================
  // Weekly Goal
  // =====================================================

  const weeklyTarget = attendanceConfig.requiredWeeklyHours

  const weeklyHoursRemaining = Math.max(weeklyTarget - weeklyHours, 0)

  const weeklyGoalPercentage = Math.min(
    Math.round((weeklyHours / weeklyTarget) * 100),
    100,
  )

  // =====================================================
  // Return Stats
  // =====================================================

  return {
    dayStreak,
    longestStreak,

    attendancePercentage,

    weeklyHours,
    monthlyHours,
    totalWorkingHours,

    averageDailyHours,

    leavesTaken,

    overtimeHours,
    totalOvertimeHours,

    productivity,

    punctuality,
    breakScore,

    weeklyGoalScore,

    weeklyTarget,
    weeklyHoursRemaining,
    weeklyGoalPercentage,

    averageCheckIn,
    averageBreakDuration,

    totalPresentToday,

    totalOnBreakToday,

    totalLateCheckInsToday,

    weeklyAttendanceChart,
  }
}

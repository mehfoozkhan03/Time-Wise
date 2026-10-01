import { attendanceConfig } from '../config/attendanceConfig.js'
import { holidayModel } from '../models/Holidays.model.js'
import { ATTENDANCE_BLOCKING_HOLIDAY_TYPES } from '../config/attendanceRules.js'

export const INDIA_TIME_ZONE = 'Asia/Kolkata'

const getIndiaDateParts = (date = new Date()) => {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: INDIA_TIME_ZONE,
    year: 'numeric', month: '2-digit', day: '2-digit', weekday: 'long',
  }).formatToParts(new Date(date))
  return Object.fromEntries(parts.map(({ type, value }) => [type, value]))
}

export const getIndiaDateKey = (date = new Date()) => {
  const parts = getIndiaDateParts(date)
  return `${parts.year}-${parts.month}-${parts.day}`
}

export const getIndiaWeekday = (date = new Date()) => {
  const weekday = getIndiaDateParts(date).weekday
  return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].indexOf(weekday)
}

export const getIndiaMidnight = (date = new Date()) => {
  const parts = getIndiaDateParts(date)
  return new Date(Date.UTC(Number(parts.year), Number(parts.month) - 1, Number(parts.day), -5, -30))
}

export const getIndiaMonthStart = (date = new Date()) => {
  const parts = getIndiaDateParts(date)
  return new Date(Date.UTC(Number(parts.year), Number(parts.month) - 1, 1, -5, -30))
}

// =======================================================
// Date Ranges
// =======================================================

export const getTodayRange = (date = new Date()) => {
  const startOfDay = getIndiaMidnight(date)
  const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000 - 1)

  return {
    startOfDay,
    endOfDay,
  }
}

export const getWeekRange = (date = new Date()) => {
  const weekStart = getIndiaMidnight(date)
  const day = getIndiaWeekday(date)

  const diff = day === 0 ? -6 : 1 - day

  weekStart.setUTCDate(weekStart.getUTCDate() + diff)

  const weekEnd = new Date(weekStart)

  weekEnd.setUTCDate(weekEnd.getUTCDate() + 7)
  weekEnd.setUTCMilliseconds(weekEnd.getUTCMilliseconds() - 1)

  return {
    weekStart,
    weekEnd,
  }
}

export const getMonthRange = (date = new Date()) => {
  const parts = getIndiaDateParts(date)
  const year = Number(parts.year)
  const month = Number(parts.month)
  const monthStart = new Date(Date.UTC(year, month - 1, 1, -5, -30))
  const monthEnd = new Date(Date.UTC(year, month, 1, -5, -30) - 1)

  return {
    monthStart,
    monthEnd,
  }
}

// =======================================================
// Time Helpers
// =======================================================

export const getMinutesSinceMidnight = (date = new Date()) => {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: INDIA_TIME_ZONE, hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
  }).formatToParts(new Date(date))
  const hour = Number(parts.find((part) => part.type === 'hour')?.value || 0)
  const minute = Number(parts.find((part) => part.type === 'minute')?.value || 0)
  return hour * 60 + minute
}

export const timeStringToMinutes = (time) => {
  const [hours, minutes] = time.split(':').map(Number)

  return hours * 60 + minutes
}

// =======================================================
// Basic Working Day
// =======================================================

export const isWeekdayWorkingDay = (date = new Date()) => {
  return attendanceConfig.workingDays.includes(getIndiaWeekday(date))
}

// =======================================================
// Holiday Check
// =======================================================

export const isHoliday = async (date = new Date()) => {
  const { startOfDay, endOfDay } = getTodayRange(date)

  const holiday = await holidayModel.exists({
    date: {
      $gte: startOfDay,
      $lte: endOfDay,
    },
    isActive: true,
    type: { $in: ATTENDANCE_BLOCKING_HOLIDAY_TYPES },
  })

  return Boolean(holiday)
}

// =======================================================
// Attendance Working Day
// =======================================================

/*
  A date counts as an attendance working day only when:

  1. It is configured as a working day
  2. It is NOT an active attendance-blocking holiday

  This is the main rule used by attendance calculations.
*/

export const isAttendanceWorkingDay = async (date = new Date()) => {
  if (!isWeekdayWorkingDay(date)) {
    return false
  }

  const holiday = await isHoliday(date)

  return !holiday
}

// =======================================================
// Get Holiday
// =======================================================

export const getHolidayForDate = async (date = new Date()) => {
  const { startOfDay, endOfDay } = getTodayRange(date)

  return holidayModel.findOne({
    date: {
      $gte: startOfDay,
      $lte: endOfDay,
    },
    isActive: true,
    type: { $in: ATTENDANCE_BLOCKING_HOLIDAY_TYPES },
  })
}

// =======================================================
// Formatting
// =======================================================

export const formatWorkingHours = (seconds) => {
  return Number((seconds / 3600).toFixed(1))
}



import { attendanceConfig } from '../config/attendanceConfig.js'
import { holidayModel } from '../models/Holidays.model.js'

// =======================================================
// Date Ranges
// =======================================================

export const getTodayRange = (date = new Date()) => {
  const startOfDay = new Date(date)
  startOfDay.setHours(0, 0, 0, 0)

  const endOfDay = new Date(date)
  endOfDay.setHours(23, 59, 59, 999)

  return {
    startOfDay,
    endOfDay,
  }
}

export const getWeekRange = (date = new Date()) => {
  const weekStart = new Date(date)

  const day = weekStart.getDay()

  const diff = day === 0 ? -6 : 1 - day

  weekStart.setDate(weekStart.getDate() + diff)
  weekStart.setHours(0, 0, 0, 0)

  const weekEnd = new Date(weekStart)

  weekEnd.setDate(weekEnd.getDate() + 6)
  weekEnd.setHours(23, 59, 59, 999)

  return {
    weekStart,
    weekEnd,
  }
}

export const getMonthRange = (date = new Date()) => {
  const monthStart = new Date(date.getFullYear(), date.getMonth(), 1)

  monthStart.setHours(0, 0, 0, 0)

  const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0)

  monthEnd.setHours(23, 59, 59, 999)

  return {
    monthStart,
    monthEnd,
  }
}

// =======================================================
// Time Helpers
// =======================================================

export const getMinutesSinceMidnight = (date = new Date()) => {
  return date.getHours() * 60 + date.getMinutes()
}

export const timeStringToMinutes = (time) => {
  const [hours, minutes] = time.split(':').map(Number)

  return hours * 60 + minutes
}

// =======================================================
// Basic Working Day
// =======================================================

export const isWeekdayWorkingDay = (date = new Date()) => {
  return attendanceConfig.workingDays.includes(date.getDay())
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
  })

  return Boolean(holiday)
}

// =======================================================
// Attendance Working Day
// =======================================================

/*
  A date counts as an attendance working day only when:

  1. It is configured as a working day
  2. It is NOT an active holiday

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
  })
}

// =======================================================
// Formatting
// =======================================================

export const formatWorkingHours = (seconds) => {
  return Number((seconds / 3600).toFixed(1))
}

import { attendanceConfig } from '../config/attendanceConfig.js'

export const getTodayRange = () => {
  const startOfDay = new Date()
  startOfDay.setHours(0, 0, 0, 0)

  const endOfDay = new Date()
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

export const getMinutesSinceMidnight = (date = new Date()) => {
  return date.getHours() * 60 + date.getMinutes()
}

export const timeStringToMinutes = (time) => {
  const [hours, minutes] = time.split(':').map(Number)

  return hours * 60 + minutes
}

export const isWorkingDay = (date = new Date()) => {
  return attendanceConfig.workingDays.includes(date.getDay())
}

export const formatWorkingHours = (seconds) => {
  return Number((seconds / 3600).toFixed(1))
}

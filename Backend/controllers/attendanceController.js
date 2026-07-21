import {
  getTodayRange,
  getWeekRange,
  getMonthRange,
  getMinutesSinceMidnight,
  timeStringToMinutes,
  isWorkingDay,
  formatWorkingHours,
} from '../utils/attenndaceHelper.js'

import { attendanceConfig } from '../config/attendanceConfig.js'
import { attendanceModel } from '../models/Attendance.model.js'

// ================= Check In =================

export const checkIn = async (req, res) => {
  try {
    const userID = req.user.userID

    const { startOfDay, endOfDay } = getTodayRange()

    const existingAttendance = await attendanceModel.findOne({
      user: userID,
      date: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    })

    if (existingAttendance) {
      return res.status(409).json({
        success: false,
        message: 'You have already checked in today.',
      })
    }

    const currentMinutes = getMinutesSinceMidnight()

    const lateMinutes = timeStringToMinutes(attendanceConfig.lateAfter)

    const halfDayMinutes = timeStringToMinutes(attendanceConfig.halfDayAfter)

    let status = 'Present'

    if (currentMinutes >= halfDayMinutes) {
      status = 'Half Day'
    } else if (currentMinutes >= lateMinutes) {
      status = 'Late'
    }

    const attendance = await attendanceModel.create({
      user: userID,
      date: startOfDay,
      checkInTime: new Date(),
      status,
    })

    return res.status(201).json({
      success: true,
      message: 'Checked in successfully.',
      attendance,
    })
  } catch (error) {
    console.error('Check In Error:', error)

    return res.status(500).json({
      success: false,
      message: 'Internal Server Error.',
    })
  }
}

// ================= Start Break =================

export const startBreak = async (req, res) => {
  try {
    const userID = req.user.userID

    const { startOfDay, endOfDay } = getTodayRange()

    const attendance = await attendanceModel.findOne({
      user: userID,
      date: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    })

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: 'Please check in first.',
      })
    }

    if (attendance.checkOutTime) {
      return res.status(400).json({
        success: false,
        message: 'You have already checked out.',
      })
    }

    const lastBreak = attendance.breaks[attendance.breaks.length - 1]

    if (lastBreak && !lastBreak.breakEnd) {
      return res.status(400).json({
        success: false,
        message: 'Break already started.',
      })
    }

    attendance.breaks.push({
      breakStart: new Date(),
    })

    await attendance.save()

    return res.status(200).json({
      success: true,
      message: 'Break started successfully.',
      attendance,
    })
  } catch (error) {
    console.error('Start Break Error:', error)

    return res.status(500).json({
      success: false,
      message: 'Internal Server Error.',
    })
  }
}

// ================= End Break =================

export const endBreak = async (req, res) => {
  try {
    const userID = req.user.userID

    const { startOfDay, endOfDay } = getTodayRange()

    const attendance = await attendanceModel.findOne({
      user: userID,
      date: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    })

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: 'Attendance not found.',
      })
    }

    const currentBreak = attendance.breaks[attendance.breaks.length - 1]

    if (!currentBreak || currentBreak.breakEnd) {
      return res.status(400).json({
        success: false,
        message: 'You are not on a break.',
      })
    }

    currentBreak.breakEnd = new Date()

    const duration = Math.floor(
      (currentBreak.breakEnd.getTime() - currentBreak.breakStart.getTime()) /
        1000,
    )

    currentBreak.duration = duration

    attendance.totalBreakSeconds += duration

    await attendance.save()

    return res.status(200).json({
      success: true,
      message: 'Break ended successfully.',
      attendance,
    })
  } catch (error) {
    console.error('End Break Error:', error)

    return res.status(500).json({
      success: false,
      message: 'Internal Server Error.',
    })
  }
}

// ================= Check Out =================

export const checkOut = async (req, res) => {
  try {
    const userID = req.user.userID

    const { startOfDay, endOfDay } = getTodayRange()

    const attendance = await attendanceModel.findOne({
      user: userID,
      date: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    })

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: 'Attendance not found.',
      })
    }

    if (attendance.checkOutTime) {
      return res.status(400).json({
        success: false,
        message: 'You have already checked out.',
      })
    }

    const lastBreak = attendance.breaks[attendance.breaks.length - 1]

    if (lastBreak && !lastBreak.breakEnd) {
      return res.status(400).json({
        success: false,
        message: 'Please end your break before checking out.',
      })
    }

    attendance.checkOutTime = new Date()

    const sessionSeconds = Math.floor(
      (attendance.checkOutTime.getTime() - attendance.checkInTime.getTime()) /
        1000,
    )

    attendance.totalWorkingSeconds = Math.max(
      sessionSeconds - attendance.totalBreakSeconds,
      0,
    )

    await attendance.save()

    return res.status(200).json({
      success: true,
      message: 'Checked out successfully.',
      attendance,
    })
  } catch (error) {
    console.error('Check Out Error:', error)

    return res.status(500).json({
      success: false,
      message: 'Internal Server Error.',
    })
  }
}

// ================= Today's Attendance =================

export const getTodayAttendance = async (req, res) => {
  try {
    const userID = req.user.userID

    const { startOfDay, endOfDay } = getTodayRange()

    const attendance = await attendanceModel.findOne({
      user: userID,
      date: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    })

    return res.status(200).json({
      success: true,
      attendance,
      message: attendance
        ? 'Attendance fetched successfully.'
        : 'No attendance found for today.',
    })
  } catch (error) {
    console.error('Get Today Attendance Error:', error)

    return res.status(500).json({
      success: false,
      message: 'Internal Server Error.',
    })
  }
}

// ================= Attendance History =================

export const getAttendanceHistory = async (req, res) => {
  try {
    const userID = req.user.userID

    const history = await attendanceModel
      .find({
        user: userID,
      })
      .sort({
        date: -1,
      })

    return res.status(200).json({
      success: true,
      attendance: history,
    })
  } catch (error) {
    console.error('Attendance History Error:', error)

    return res.status(500).json({
      success: false,
      message: 'Internal Server Error.',
    })
  }
}

// ================= Dashboard Stats =================

export const getDashboardStats = async (req, res) => {
  try {
    const userID = req.user.userID

    const now = new Date()

    const { weekStart, weekEnd } = getWeekRange(now)

    const { monthStart, monthEnd } = getMonthRange(now)

    // ---------- Weekly Attendance ----------

    const weeklyAttendance = await attendanceModel.find({
      user: userID,
      date: {
        $gte: weekStart,
        $lte: weekEnd,
      },
    })

    const totalWeeklySeconds = weeklyAttendance.reduce(
      (sum, record) => sum + record.totalWorkingSeconds,
      0,
    )

    const weeklyHours = formatWorkingHours(totalWeeklySeconds)

    // ---------- Monthly Attendance ----------

    const monthlyAttendance = await attendanceModel.find({
      user: userID,
      date: {
        $gte: monthStart,
        $lte: monthEnd,
      },
    })

    const totalMonthlySeconds = monthlyAttendance.reduce(
      (sum, record) => sum + record.totalWorkingSeconds,
      0,
    )

    const monthlyHours = formatWorkingHours(totalMonthlySeconds)

    // ---------- Attendance Percentage ----------

    let workingDays = 0

    for (
      let date = new Date(monthStart);
      date <= now;
      date.setDate(date.getDate() + 1)
    ) {
      if (isWorkingDay(date)) {
        workingDays++
      }
    }

    const attendedDays = monthlyAttendance.filter((record) =>
      ['Present', 'Late', 'Half Day'].includes(record.status),
    ).length

    const attendancePercentage =
      workingDays === 0 ? 0 : Math.round((attendedDays / workingDays) * 100)

    // ---------- Productivity ----------

    const productivity = Math.min(
      Math.round((weeklyHours / attendanceConfig.requiredWeeklyHours) * 100),
      100,
    )

    // ---------- Current Streak ----------

    const attendanceRecords = await attendanceModel
      .find({
        user: userID,
        status: {
          $in: ['Present', 'Late', 'Half Day'],
        },
      })
      .sort({
        date: -1,
      })

    let dayStreak = 0

    const cursor = new Date(now)
    cursor.setHours(0, 0, 0, 0)

    while (true) {
      if (!isWorkingDay(cursor)) {
        cursor.setDate(cursor.getDate() - 1)
        continue
      }

      const found = attendanceRecords.find(
        (record) => record.date.toDateString() === cursor.toDateString(),
      )

      if (!found) {
        break
      }

      dayStreak++

      cursor.setDate(cursor.getDate() - 1)
    }

    return res.status(200).json({
      success: true,
      stats: {
        dayStreak,
        attendancePercentage,
        weeklyHours,
        monthlyHours,
        productivity,
      },
    })
  } catch (error) {
    console.error('Dashboard Stats Error:', error)

    return res.status(500).json({
      success: false,
      message: 'Internal Server Error.',
    })
  }
}

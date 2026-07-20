import { getTodayRange } from '../utils/attenndaceHelper.js';
import { attendanceModel } from '../models/Attendance.model.js';

// ================= Check In =================

export const checkIn = async (req, res) => {
  try {
    const userID = req.user.userID;

    const { startOfDay, endOfDay } = getTodayRange();

    const existingAttendance = await attendanceModel.findOne({
      user: userID,
      date: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    });

    if (existingAttendance) {
      return res.status(409).json({
        success: false,
        message: 'You have already checked in today.',
      });
    }

    const attendance = await attendanceModel.create({
      user: userID,
      date: startOfDay,
      checkInTime: new Date(),
      status: 'Present',
    });

    return res.status(201).json({
      success: true,
      message: 'Checked in successfully.',
      attendance,
    });
  } catch (error) {
    console.error('Check In Error:', error);

    return res.status(500).json({
      success: false,
      message: 'Internal Server Error.',
    });
  }
};

// ================= Start Break =================

export const startBreak = async (req, res) => {
  try {
    const userID = req.user.userID;

    const { startOfDay, endOfDay } = getTodayRange();

    const attendance = await attendanceModel.findOne({
      user: userID,
      date: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    });

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: 'Please check in first.',
      });
    }

    if (attendance.checkOutTime) {
      return res.status(400).json({
        success: false,
        message: 'You have already checked out.',
      });
    }

    const lastBreak = attendance.breaks[attendance.breaks.length - 1];

    if (lastBreak && !lastBreak.breakEnd) {
      return res.status(400).json({
        success: false,
        message: 'Break already started.',
      });
    }

    attendance.breaks.push({
      breakStart: new Date(),
    });

    await attendance.save();

    return res.status(200).json({
      success: true,
      message: 'Break started successfully.',
      attendance,
    });
  } catch (error) {
    console.error('Start Break Error:', error);

    return res.status(500).json({
      success: false,
      message: 'Internal Server Error.',
    });
  }
};

// ================= End Break =================

export const endBreak = async (req, res) => {
  try {
    const userID = req.user.userID;

    const { startOfDay, endOfDay } = getTodayRange();

    const attendance = await attendanceModel.findOne({
      user: userID,
      date: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    });

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: 'Attendance not found.',
      });
    }

    const currentBreak = attendance.breaks[attendance.breaks.length - 1];

    if (!currentBreak || currentBreak.breakEnd) {
      return res.status(400).json({
        success: false,
        message: 'You are not on a break.',
      });
    }

    currentBreak.breakEnd = new Date();

    const duration = Math.floor(
      (currentBreak.breakEnd.getTime() - currentBreak.breakStart.getTime()) /
        1000,
    );

    currentBreak.duration = duration;

    attendance.totalBreakSeconds += duration;

    await attendance.save();

    return res.status(200).json({
      success: true,
      message: 'Break ended successfully.',
      attendance,
    });
  } catch (error) {
    console.error('End Break Error:', error);

    return res.status(500).json({
      success: false,
      message: 'Internal Server Error.',
    });
  }
};

// ================= Check Out =================

export const checkOut = async (req, res) => {
  try {
    const userID = req.user.userID;

    const { startOfDay, endOfDay } = getTodayRange();

    const attendance = await attendanceModel.findOne({
      user: userID,
      date: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    });

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: 'Attendance not found.',
      });
    }

    if (attendance.checkOutTime) {
      return res.status(400).json({
        success: false,
        message: 'You have already checked out.',
      });
    }

    const lastBreak = attendance.breaks[attendance.breaks.length - 1];

    if (lastBreak && !lastBreak.breakEnd) {
      return res.status(400).json({
        success: false,
        message: 'Please end your break before checking out.',
      });
    }

    attendance.checkOutTime = new Date();

    const sessionSeconds = Math.floor(
      (attendance.checkOutTime.getTime() - attendance.checkInTime.getTime()) /
        1000,
    );

    attendance.totalWorkingSeconds = Math.max(
      sessionSeconds - attendance.totalBreakSeconds,
      0,
    );

    await attendance.save();

    return res.status(200).json({
      success: true,
      message: 'Checked out successfully.',
      attendance,
    });
  } catch (error) {
    console.error('Check Out Error:', error);

    return res.status(500).json({
      success: false,
      message: 'Internal Server Error.',
    });
  }
};

// ================= Today's Attendance =================

export const getTodayAttendance = async (req, res) => {
  try {
    const userID = req.user.userID;

    const { startOfDay, endOfDay } = getTodayRange();

    const attendance = await attendanceModel.findOne({
      user: userID,
      date: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    });

    return res.status(200).json({
      success: true,
      attendance,
      message: attendance
        ? 'Attendance fetched successfully.'
        : 'No attendance found for today.',
    });
  } catch (error) {
    console.error('Get Today Attendance Error:', error);

    return res.status(500).json({
      success: false,
      message: 'Internal Server Error.',
    });
  }
};

// ================= Attendance History =================

export const getAttendanceHistory = async (req, res) => {
  try {
    const userID = req.user.userID;

    const history = await attendanceModel
      .find({
        user: userID,
      })
      .sort({
        date: -1,
      });

    return res.status(200).json({
      success: true,
      attendance: history,
    });
  } catch (error) {
    console.error('Attendance History Error:', error);

    return res.status(500).json({
      success: false,
      message: 'Internal Server Error.',
    });
  }
};

// ================= Dashboard Stats =================

export const getDashboardStats = async (req, res) => {
  try {
    const userID = req.user.userID

    const now = new Date()

    // ---------- Current Week (Monday -> Sunday) ----------

    const weekStart = new Date(now)
    const day = weekStart.getDay()

    const diff = day === 0 ? -6 : 1 - day

    weekStart.setDate(weekStart.getDate() + diff)
    weekStart.setHours(0, 0, 0, 0)

    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekEnd.getDate() + 6)
    weekEnd.setHours(23, 59, 59, 999)

    // ---------- Current Month ----------

    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)

    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0)
    monthEnd.setHours(23, 59, 59, 999)

    // ---------- Weekly Hours ----------

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

    const weeklyHours = Number(
      (totalWeeklySeconds / 3600).toFixed(1),
    )

    // ---------- Attendance Percentage ----------

    const monthlyAttendance = await attendanceModel.find({
      user: userID,
      date: {
        $gte: monthStart,
        $lte: monthEnd,
      },
    })

    let workingDays = 0

    for (
      let d = new Date(monthStart);
      d <= now;
      d.setDate(d.getDate() + 1)
    ) {
      const day = d.getDay()

      if (day !== 0 && day !== 6) {
        workingDays++
      }
    }

    const presentDays = monthlyAttendance.filter(
      (record) => record.status === 'Present',
    ).length

    const attendancePercentage =
      workingDays === 0
        ? 0
        : Math.round((presentDays / workingDays) * 100)

    // ---------- Productivity ----------

    const productivity = Math.min(
      Math.round((weeklyHours / 40) * 100),
      100,
    )

    // ---------- Day Streak ----------

    const allAttendance = await attendanceModel
      .find({
        user: userID,
        status: 'Present',
      })
      .sort({
        date: -1,
      })

    let streak = 0

    let cursor = new Date(now)
    cursor.setHours(0, 0, 0, 0)

    while (true) {
      if (cursor.getDay() === 0 || cursor.getDay() === 6) {
        cursor.setDate(cursor.getDate() - 1)
        continue
      }

      const found = allAttendance.find(
        (record) =>
          record.date.toDateString() === cursor.toDateString(),
      )

      if (!found) break

      streak++

      cursor.setDate(cursor.getDate() - 1)
    }

    return res.status(200).json({
      success: true,
      stats: {
        dayStreak: streak,
        attendancePercentage,
        weeklyHours,
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

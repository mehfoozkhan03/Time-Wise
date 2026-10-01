import {
  getTodayRange,
  getMinutesSinceMidnight,
  timeStringToMinutes,
  getIndiaDateKey,
  getIndiaWeekday,
  getIndiaMonthStart,
} from "../../utils/attendanceHelper.js";

import { attendanceConfig } from "../../config/attendanceConfig.js";

import { attendanceModel } from "../../models/Attendance.model.js";

import { holidayModel } from "../../models/Holidays.model.js";

// Approved leave is checked before allowing attendance actions.
import { leaveModel } from "../../models/Leave.model.js";

import { getAttendanceStats } from "../../services/attendanceStats.service.js";
import { getEmployeeReport } from "../../services/reports.service.js";
import { ATTENDANCE_BLOCKING_HOLIDAY_TYPES } from "../../config/attendanceRules.js";

// =======================================================
// Attendance Rules
// =======================================================

// Only these holiday types should block employee attendance.
//
// Attendance is blocked for:
// - HOLIDAY
// - GOVERNMENT_HOLIDAY
// - COMPANY_HOLIDAY
// - FESTIVAL
//
// Attendance remains allowed for:
// - OPTIONAL_HOLIDAY
// - OBSERVANCE
// =======================================================
// Helpers
// =======================================================

const getDateKey = (date) => {
  return getIndiaDateKey(date);
};

const isConfiguredWorkingDay = (date = new Date()) => {
  return attendanceConfig.workingDays.includes(getIndiaWeekday(date));
};

const getTodayHoliday = async () => {
  const { startOfDay, endOfDay } = getTodayRange();

  // CHANGED:
  // Only the four configured attendance-blocking holiday types
  // should prevent Check-In, Break, and Check-Out.
  //
  // Optional Holiday and Observance are intentionally excluded
  // from this query, so employees can still check in on those days.
  return holidayModel.findOne({
    date: {
      $gte: startOfDay,
      $lte: endOfDay,
    },
    isActive: true,
    type: {
      $in: ATTENDANCE_BLOCKING_HOLIDAY_TYPES,
    },
  });
};

// Find an approved leave that covers today.
const getTodayApprovedLeave = async (userID) => {
  const { startOfDay, endOfDay } = getTodayRange();

  return leaveModel
    .findOne({
      user: userID,
      status: "Approved",
      startDate: {
        $lte: endOfDay,
      },
      endDate: {
        $gte: startOfDay,
      },
    })
    .select("startDate endDate leaveType reason status")
    .lean();
};

// Centralize working-day, holiday, and approved-leave validation
// so every attendance action uses the same business rule.
const isAttendanceAllowedToday = async (userID) => {
  const today = new Date();

  // ---------------------------------------------------
  // Non-working day / weekend
  // ---------------------------------------------------

  if (!isConfiguredWorkingDay(today)) {
    return {
      allowed: false,
      reason: "weekend",
      holiday: null,
      leave: null,
    };
  }

  // ---------------------------------------------------
  // Attendance-blocking holiday
  // ---------------------------------------------------

  const holiday = await getTodayHoliday();

  if (holiday) {
    return {
      allowed: false,
      reason: "holiday",
      holiday,
      leave: null,
    };
  }

  // ---------------------------------------------------
  // Approved employee leave
  // ---------------------------------------------------

  const leave = await getTodayApprovedLeave(userID);

  if (leave) {
    return {
      allowed: false,
      reason: "approved_leave",
      holiday: null,
      leave,
    };
  }

  // ---------------------------------------------------
  // Normal working day
  // ---------------------------------------------------

  return {
    allowed: true,
    reason: null,
    holiday: null,
    leave: null,
  };
};

/*
 * CHANGED:
 * Keep all blocked-attendance responses in one place.
 *
 * This prevents the same holiday, leave, and non-working-day
 * response logic from being repeated in check-in, break,
 * and checkout.
 */
const sendAttendanceRestriction = (res, attendanceDay) => {
  if (attendanceDay.reason === "holiday") {
    return res.status(400).json({
      success: false,
      message: `Today is a holiday${
        attendanceDay.holiday?.title ? ` (${attendanceDay.holiday.title})` : ""
      }. Attendance is not required.`,
      code: "HOLIDAY",
      holiday: attendanceDay.holiday,
    });
  }

  if (attendanceDay.reason === "approved_leave") {
    return res.status(400).json({
      success: false,
      message: "You are on approved leave today. Attendance is not required.",
      code: "APPROVED_LEAVE",
      leave: attendanceDay.leave,
    });
  }

  return res.status(400).json({
    success: false,
    message: "Today is a non-working day. Attendance is not required.",
    code: "NON_WORKING_DAY",
  });
};

// =======================================================
// Check In
// =======================================================

export const checkIn = async (req, res) => {
  try {
    const userID = req.user.userID;

    // ---------------------------------------------------
    // Prevent check-in on:
    // - Non-working days
    // - Attendance-blocking holidays
    // - Approved leave
    // ---------------------------------------------------

    const attendanceDay = await isAttendanceAllowedToday(userID);

    if (!attendanceDay.allowed) {
      return sendAttendanceRestriction(res, attendanceDay);
    }

    // ---------------------------------------------------
    // Get today's attendance
    // ---------------------------------------------------

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
        message: "You have already checked in today.",
      });
    }

    // ---------------------------------------------------
    // Determine attendance status
    // ---------------------------------------------------

    const currentMinutes = getMinutesSinceMidnight();

    const lateMinutes = timeStringToMinutes(attendanceConfig.lateAfter);

    const halfDayMinutes = timeStringToMinutes(attendanceConfig.halfDayAfter);

    let status = "Present";

    if (currentMinutes >= halfDayMinutes) {
      status = "Half Day";
    } else if (currentMinutes >= lateMinutes) {
      status = "Late";
    }

    // ---------------------------------------------------
    // Create attendance
    // ---------------------------------------------------

    const attendance = await attendanceModel.create({
      user: userID,
      date: startOfDay,
      checkInTime: new Date(),
      status,
    });

    return res.status(201).json({
      success: true,
      message: "Checked in successfully.",
      attendance,
    });
  } catch (error) {
    console.error("Check In Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};

// =======================================================
// Start Break
// =======================================================

export const startBreak = async (req, res) => {
  try {
    const userID = req.user.userID;

    // ---------------------------------------------------
    // Prevent break actions on:
    // - Non-working days
    // - Attendance-blocking holidays
    // - Approved leave
    // ---------------------------------------------------

    const attendanceDay = await isAttendanceAllowedToday(userID);

    if (!attendanceDay.allowed) {
      return sendAttendanceRestriction(res, attendanceDay);
    }

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
        message: "Please check in first.",
      });
    }

    if (attendance.checkOutTime) {
      return res.status(400).json({
        success: false,
        message: "You have already checked out.",
      });
    }

    const lastBreak = attendance.breaks[attendance.breaks.length - 1];

    if (lastBreak && !lastBreak.breakEnd) {
      return res.status(400).json({
        success: false,
        message: "Break already started.",
      });
    }

    attendance.breaks.push({
      breakStart: new Date(),
    });

    await attendance.save();

    return res.status(200).json({
      success: true,
      message: "Break started successfully.",
      attendance,
    });
  } catch (error) {
    console.error("Start Break Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};

// =======================================================
// End Break
// =======================================================

export const endBreak = async (req, res) => {
  try {
    const userID = req.user.userID;

    // ---------------------------------------------------
    // Prevent break actions on:
    // - Non-working days
    // - Attendance-blocking holidays
    // - Approved leave
    // ---------------------------------------------------

    const attendanceDay = await isAttendanceAllowedToday(userID);

    if (!attendanceDay.allowed) {
      return sendAttendanceRestriction(res, attendanceDay);
    }

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
        message: "Attendance not found.",
      });
    }

    const currentBreak = attendance.breaks[attendance.breaks.length - 1];

    if (!currentBreak || currentBreak.breakEnd) {
      return res.status(400).json({
        success: false,
        message: "You are not on a break.",
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
      message: "Break ended successfully.",
      attendance,
    });
  } catch (error) {
    console.error("End Break Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};

// =======================================================
// Check Out
// =======================================================

export const checkOut = async (req, res) => {
  try {
    const userID = req.user.userID;

    // ---------------------------------------------------
    // Prevent checkout on:
    // - Non-working days
    // - Attendance-blocking holidays
    // - Approved leave
    // ---------------------------------------------------

    const attendanceDay = await isAttendanceAllowedToday(userID);

    if (!attendanceDay.allowed) {
      return sendAttendanceRestriction(res, attendanceDay);
    }

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
        message: "Attendance not found.",
      });
    }

    if (attendance.checkOutTime) {
      return res.status(400).json({
        success: false,
        message: "You have already checked out.",
      });
    }

    const lastBreak = attendance.breaks[attendance.breaks.length - 1];

    if (lastBreak && !lastBreak.breakEnd) {
      return res.status(400).json({
        success: false,
        message: "Please end your break before checking out.",
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
      message: "Checked out successfully.",
      attendance,
    });
  } catch (error) {
    console.error("Check Out Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};

// =======================================================
// Today's Attendance
// =======================================================

export const getTodayAttendance = async (req, res) => {
  try {
    const userID = req.user.userID;

    const { startOfDay, endOfDay } = getTodayRange();

    // ---------------------------------------------------
    // Check whether today requires attendance
    // ---------------------------------------------------

    const attendanceDay = await isAttendanceAllowedToday(userID);

    const attendance = await attendanceModel.findOne({
      user: userID,
      date: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    });

    // ---------------------------------------------------
    // Attendance-blocking Holiday
    // ---------------------------------------------------

    if (attendanceDay.reason === "holiday") {
      return res.status(200).json({
        success: true,
        attendance,
        isWorkingDay: false,
        isHoliday: true,
        isOnLeave: false,
        holiday: attendanceDay.holiday,
        leave: null,
        message: attendance
          ? "Attendance record found for today."
          : "Today is a holiday. Attendance is not required.",
      });
    }

    // ---------------------------------------------------
    // Approved leave
    // ---------------------------------------------------

    if (attendanceDay.reason === "approved_leave") {
      return res.status(200).json({
        success: true,
        attendance,
        isWorkingDay: false,
        isHoliday: false,
        isOnLeave: true,
        holiday: null,
        leave: attendanceDay.leave,
        message: attendance
          ? "Attendance record found for today."
          : "You are on leave today. Attendance is not required.",
      });
    }

    // ---------------------------------------------------
    // Weekend / non-working day
    // ---------------------------------------------------

    if (attendanceDay.reason === "weekend") {
      return res.status(200).json({
        success: true,
        attendance,
        isWorkingDay: false,
        isHoliday: false,
        isOnLeave: false,
        holiday: null,
        leave: null,
        message: attendance
          ? "Attendance record found for today."
          : "Today is a non-working day. Attendance is not required.",
      });
    }

    // ---------------------------------------------------
    // Normal working day
    //
    // This also includes:
    // - OPTIONAL_HOLIDAY
    // - OBSERVANCE
    //
    // because those types are not included in
    // ATTENDANCE_BLOCKING_HOLIDAY_TYPES.
    // ---------------------------------------------------

    return res.status(200).json({
      success: true,
      attendance,
      isWorkingDay: true,
      isHoliday: false,
      isOnLeave: false,
      holiday: null,
      leave: null,
      message: attendance
        ? "Attendance fetched successfully."
        : "No attendance found for today.",
    });
  } catch (error) {
    console.error("Get Today Attendance Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};

// =======================================================
// Attendance History (with generated Absent records)
// =======================================================

export const getAttendanceHistory = async (req, res) => {
  try {
    const userID = req.user.userID;

    const history = await attendanceModel
      .find({
        user: userID,
      })
      .sort({
        date: -1,
      })
      .lean();

    // Map existing records by YYYY-MM-DD
    const existingKeys = new Set();

    for (const record of history) {
      if (record.date) {
        existingKeys.add(getDateKey(record.date));
      }
    }

    // ---------------------------------------------------
    // Fetch only attendance-blocking holidays
    // ---------------------------------------------------
    //
    // CHANGED:
    // Optional Holiday and Observance should not be treated
    // as non-working holidays in attendance history.
    //
    // This keeps history consistent with Check-In behavior.

    const holidays = await holidayModel
      .find({
        isActive: true,
        type: {
          $in: ATTENDANCE_BLOCKING_HOLIDAY_TYPES,
        },
      })
      .select("date")
      .lean();

    const holidaySet = new Set(
      holidays.map((holiday) => getDateKey(holiday.date)),
    );

    // Generate working days for current month up to today
    const now = new Date();

    const startDate = getIndiaMonthStart(now);
    const endDate = getTodayRange(now).endOfDay;

    const completeHistory = [...history];

    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const dateKey = getDateKey(currentDate);

      const isWorkingDay = isConfiguredWorkingDay(currentDate);

      const isHoliday = holidaySet.has(dateKey);

      // Inject virtual Absent record for missing working days.
      //
      // Only the four attendance-blocking holiday types are
      // excluded here. Optional Holiday and Observance remain
      // eligible working days.
      if (isWorkingDay && !isHoliday && !existingKeys.has(dateKey)) {
        completeHistory.push({
          _id: `absent-${dateKey}`,
          user: userID,
          date: new Date(currentDate),
          status: "Absent",
          totalWorkingSeconds: 0,
          checkInTime: null,
          checkOutTime: null,
          breaks: [],
        });
      }

      currentDate.setUTCDate(currentDate.getUTCDate() + 1);
    }

    // Sort descending by date
    completeHistory.sort((a, b) => new Date(b.date) - new Date(a.date));

    return res.status(200).json({
      success: true,
      attendance: completeHistory,
    });
  } catch (error) {
    console.error("Attendance History Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};

//# ====================== Dashboard Stats =====================

export const getDashboardStats = async (req, res) => {
  try {
    const userID = req.user.userID;

    const stats = await getAttendanceStats(userID);

    return res.status(200).json({
      success: true,
      stats,
    });
  } catch (error) {
    console.error("Dashboard Stats Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};

export const getEmployeeAttendanceReport = async (req, res) => {
  try {
    const data = await getEmployeeReport(req.user.userID, req.query);

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    const status = error.message?.includes("date") || error.message?.includes("range")
      ? 400
      : 500;

    console.error("Attendance Report Error:", error);

    return res.status(status).json({
      success: false,
      message: error.message || "Failed to fetch attendance report.",
    });
  }
};

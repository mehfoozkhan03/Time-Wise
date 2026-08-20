import { getAttendanceStats } from "./attendanceStats.service.js";
import { attendanceModel } from "../models/Attendance.model.js";
import { getTodayRange } from "../utils/attenndaceHelper.js";

export const getAIUserContext = async (userID) => {
  const stats = await getAttendanceStats(userID);

  // --------------------------------------------------
  // Attendance history
  // Used only when WiseBot needs today's/detailed data.
  // --------------------------------------------------

  const attendanceHistory = await attendanceModel
    .find({
      user: userID,
    })
    .sort({
      date: -1,
    })
    .lean();

  // --------------------------------------------------
  // Today's Working Hours
  // --------------------------------------------------

  const { startOfDay, endOfDay } = getTodayRange();

  const todayRecord = await attendanceModel.findOne({
    user: userID,
    date: {
      $gte: startOfDay,
      $lte: endOfDay,
    },
  });

  const todayHours = todayRecord
    ? Number(((todayRecord.totalWorkingSeconds || 0) / 3600).toFixed(1))
    : 0;

  // --------------------------------------------------
  // Return AI Context
  //
  // IMPORTANT:
  // Dashboard/Reports metrics come directly from
  // getAttendanceStats() so WiseBot and Reports
  // use the same source of truth.
  // --------------------------------------------------

  return {
    attendance: {
      percentage: stats.attendancePercentage,

      weeklyHours: stats.weeklyHours,
      monthlyHours: stats.monthlyHours,

      totalWorkingHours: stats.totalWorkingHours,
      averageDailyHours: stats.averageDailyHours,

      leavesTaken: stats.leavesTaken,
      overtimeHours: stats.overtimeHours,
      totalOvertimeHours: stats.totalOvertimeHours,

      todayHours,
    },

    // Compact history only.
    // Do not send this unless the selector specifically requests it.
    attendanceHistory: attendanceHistory.map((record) => ({
      date: record.date,
      status: record.status,
      checkInTime: record.checkInTime,
      checkOutTime: record.checkOutTime,
      totalWorkingSeconds: record.totalWorkingSeconds || 0,
      totalBreakSeconds: record.totalBreakSeconds || 0,
    })),

    productivity: {
      percentage: stats.productivity,
      punctuality: stats.punctuality,
      breakScore: stats.breakScore,
    },

    streak: {
      current: stats.dayStreak,
      longest: stats.longestStreak,
    },

    goals: {
      weeklyTarget: stats.weeklyTarget,
      weeklyHoursRemaining: stats.weeklyHoursRemaining,
      weeklyGoalPercentage: stats.weeklyGoalPercentage,
      weeklyGoalScore: stats.weeklyGoalScore,
    },

    work: {
      averageCheckIn: stats.averageCheckIn,
      averageBreakDuration: stats.averageBreakDuration,
    },
  };
};

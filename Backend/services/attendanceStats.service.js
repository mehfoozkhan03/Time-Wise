import {
  getWeekRange,
  getMonthRange,
  formatWorkingHours,
} from "../utils/attendanceHelper.js";

import { attendanceConfig } from "../config/attendanceConfig.js";

import { attendanceModel } from "../models/Attendance.model.js";

import { holidayModel } from "../models/Holidays.model.js";
import { userModel } from "../models/User.model.js";

// =======================================================
// Helpers
// =======================================================

const startOfDay = (date) => {
  const result = new Date(date);

  result.setHours(0, 0, 0, 0);

  return result;
};

const endOfDay = (date) => {
  const result = new Date(date);

  result.setHours(23, 59, 59, 999);

  return result;
};

const isConfiguredWorkingDay = (date) => {
  return attendanceConfig.workingDays.includes(date.getDay());
};

const getDateKey = (date) => {
  const value = new Date(date);

  return `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(
    2,
    "0",
  )}-${String(value.getDate()).padStart(2, "0")}`;
};

const getHolidayDateKey = (holiday) => {
  return getDateKey(holiday.date);
};

// =======================================================
// Get Attendance Stats
// =======================================================

export const getAttendanceStats = async (userID) => {
  const now = new Date();

  const todayStart = startOfDay(now);
  const todayEnd = endOfDay(now);

  const totalPresentToday = await attendanceModel.countDocuments({
    date: {
      $gte: todayStart,
      $lte: todayEnd,
    },
    checkInTime: {
      $ne: null,
    },
  });

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
  });

  const totalLateCheckInsToday = await attendanceModel.countDocuments({
    date: {
      $gte: todayStart,
      $lte: todayEnd,
    },
    checkInTime: {
      $ne: null,
    },
    status: "Late",
  });


  //# ====================== Today's Attendance Records - All Employees ======================
// const todayAttendance = await attendanceModel
//   .find({
//     date: {
//       $gte: todayStart,
//       $lte: todayEnd,
//     },
//   })
//   .populate("user", "firstName lastName department designation");

// const formatTime = (date) => {
//   if (!date) return "--";

//   return new Date(date).toLocaleTimeString("en-US", {
//     hour: "2-digit",
//     minute: "2-digit",
//     hour12: false,
//   });
// };

// const formatBreakTime = (breaks = []) => {
//   if (!breaks.length) return "--";

//   return breaks
//     .filter((item) => item.breakStart)
//     .map((item) => {
//       const start = formatTime(item.breakStart);
//       const end = item.breakEnd ? formatTime(item.breakEnd) : "--";

//       return `${start}–${end}`;
//     })
//     .join(", ");
// };

// const formatWorkingHours = (seconds = 0) => {
//   const hours = Math.floor(seconds / 3600);
//   const minutes = Math.floor((seconds % 3600) / 60);

//   return `${hours}h ${minutes}m`;
// };

// const todayAttendanceRecords = todayAttendance.map((record) => {
//   const user = record.user;

//   return {
//     _id: record._id,

//     avatar: `${user?.firstName?.[0] || ""}${
//       user?.lastName?.[0] || ""
//     }`.toUpperCase(),

//     name: `${user?.firstName || ""} ${user?.lastName || ""}`.trim(),

//     department:
//       user?.department ||
//       user?.designation ||
//       "--",

//     checkIn: formatTime(record.checkInTime),

//     breakTime: formatBreakTime(record.breaks),

//     checkOut: formatTime(record.checkOutTime),

//     workingHours: formatWorkingHours(
//       record.totalWorkingSeconds
//     ),

//     status: record.status || "Absent",
//   };
// });

  const { weekStart, weekEnd } = getWeekRange(now);

  const { monthStart, monthEnd } = getMonthRange(now);

  //# ====================== Weekly Attendance Chart - All Employees =============================
const totalEmployees = await userModel.countDocuments();

const weeklyCompanyAttendance = await attendanceModel.find({
  date: {
    $gte: weekStart,
    $lte: weekEnd,
  },
});

const weeklyAttendanceChart = [];

for (let i = 6; i >= 0; i--) {
  const date = new Date(todayStart);

  date.setDate(date.getDate() - i);

  const dayStart = startOfDay(date);
  const dayEnd = endOfDay(date);

  const dayAttendance = weeklyCompanyAttendance.filter(
    (record) =>
      record.date >= dayStart &&
      record.date <= dayEnd
  );

  const present = dayAttendance.filter(
    (record) =>
      record.checkInTime &&
      ["Present", "Late", "Half Day"].includes(record.status)
  ).length;

  const absent = totalEmployees - present;

  weeklyAttendanceChart.push({
    day: date.toLocaleDateString("en-US", {
      weekday: "short",
    }),
    present,
    absent,
  });
}

  // =====================================================
  // Get Active Holidays
  // =====================================================

  /*
    We fetch holidays once instead of querying MongoDB
    separately for every date.

    This is important for streaks and attendance percentage
    because those calculations inspect many dates.
  */

  const holidays = await holidayModel
    .find({
      isActive: true,
    })
    .select("date")
    .lean();

  const holidayDateSet = new Set(
    holidays.map((holiday) => getHolidayDateKey(holiday)),
  );

  const isAttendanceWorkingDay = (date) => {
    if (!isConfiguredWorkingDay(date)) {
      return false;
    }

    return !holidayDateSet.has(getDateKey(date));
  };

  // =====================================================
  // Weekly Attendance
  // =====================================================

  const weeklyAttendance = await attendanceModel.find({
    user: userID,
    date: {
      $gte: weekStart,
      $lte: weekEnd,
    },
  });

  /*
    Only attendance recorded on valid working days
    contributes to working hours.

    This prevents Saturday/Sunday/holiday check-ins from
    inflating weekly hours.
  */

  const validWeeklyAttendance = weeklyAttendance.filter((record) =>
    isAttendanceWorkingDay(record.date),
  );

  const totalWeeklySeconds = validWeeklyAttendance.reduce(
    (sum, record) => sum + (record.totalWorkingSeconds || 0),
    0,
  );

  const weeklyHours = formatWorkingHours(totalWeeklySeconds);

  // =====================================================
  // Monthly Attendance
  // =====================================================

  const monthlyAttendance = await attendanceModel.find({
    user: userID,
    date: {
      $gte: monthStart,
      $lte: monthEnd,
    },
  });

  /*
    This is the important filtering layer.

    Any attendance record created on:
      - Saturday
      - Sunday
      - Active holiday

    is excluded from normal attendance calculations.
  */

  const validMonthlyAttendance = monthlyAttendance.filter((record) =>
    isAttendanceWorkingDay(record.date),
  );

  const totalMonthlySeconds = validMonthlyAttendance.reduce(
    (sum, record) => sum + (record.totalWorkingSeconds || 0),
    0,
  );

  const monthlyHours = formatWorkingHours(totalMonthlySeconds);

  // =====================================================
  // All Attendance History
  // =====================================================

  const attendanceHistory = await attendanceModel
    .find({
      user: userID,
    })
    .sort({
      date: -1,
    });

  /*
    Normal working statistics should only include
    actual attendance working days.

    A historical Saturday/holiday check-in therefore
    does not inflate total working hours.
  */

  const validAttendanceHistory = attendanceHistory.filter((record) =>
    isAttendanceWorkingDay(record.date),
  );

  const totalWorkingSeconds = validAttendanceHistory.reduce(
    (sum, record) => sum + (record.totalWorkingSeconds || 0),
    0,
  );

  const totalWorkingHours = formatWorkingHours(totalWorkingSeconds);

  // =====================================================
  // Average Daily Working Hours
  // =====================================================

  const averageDailyHours =
    validAttendanceHistory.length === 0
      ? 0
      : +(totalWorkingSeconds / validAttendanceHistory.length / 3600).toFixed(
          1,
        );

  // =====================================================
  // Average Check-in Time
  // =====================================================

  const checkInRecords = validMonthlyAttendance.filter(
    (record) => record.checkInTime,
  );

  let averageCheckIn = "--:--";

  if (checkInRecords.length > 0) {
    const totalMinutes = checkInRecords.reduce((sum, record) => {
      const checkIn = new Date(record.checkInTime);

      return sum + checkIn.getHours() * 60 + checkIn.getMinutes();
    }, 0);

    const averageMinutes = Math.round(totalMinutes / checkInRecords.length);

    const hours = Math.floor(averageMinutes / 60);

    const minutes = averageMinutes % 60;

    averageCheckIn = `${hours
      .toString()
      .padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
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
        );

  // =====================================================
  // Leaves Taken
  // =====================================================

  const leavesTaken = validMonthlyAttendance.filter(
    (record) => record.status === "Leave",
  ).length;

  // =====================================================
  // Overtime
  // =====================================================

  const requiredDailySeconds = attendanceConfig.requiredDailyHours * 60 * 60;

  const totalOvertimeSeconds = validMonthlyAttendance.reduce(
    (total, record) => {
      const workingSeconds = record.totalWorkingSeconds || 0;

      if (workingSeconds <= requiredDailySeconds) {
        return total;
      }

      return total + (workingSeconds - requiredDailySeconds);
    },
    0,
  );

  const overtimeHours = formatWorkingHours(totalOvertimeSeconds);

  // =====================================================
  // Total Overtime Hours
  // =====================================================

  // Match the Reports page: count ALL records (including weekends/holidays).
  // This ensures AI and Reports show the same overtime value.
  let allTimeOvertimeSeconds = 0;

  for (const record of attendanceHistory) {
    const workingSeconds = record.totalWorkingSeconds || 0;

    const overtimeSeconds = Math.max(0, workingSeconds - requiredDailySeconds);

    allTimeOvertimeSeconds += overtimeSeconds;
  }

  const totalOvertimeHours = formatWorkingHours(allTimeOvertimeSeconds);

  // =====================================================
  // Attendance Percentage
  // =====================================================

  /*
    Count only actual attendance-required days.

    Example:

      Monday  -> working day
      Tuesday -> working day
      Wednesday -> holiday
      Thursday -> working day
      Friday -> working day
      Saturday -> weekend
      Sunday -> weekend

    Attendance denominator = 4

    NOT 7.

    Therefore even if someone has a database attendance
    record on Wednesday/Saturday, those records cannot
    push the percentage above 100%.
  */

  let workingDays = 0;

  for (
    let date = new Date(monthStart);
    date <= now;
    date.setDate(date.getDate() + 1)
  ) {
    if (isAttendanceWorkingDay(date)) {
      workingDays++;
    }
  }

  const attendanceCredits = validMonthlyAttendance.reduce((total, record) => {
    switch (record.status) {
      case "Present":
        return total + 1;

      case "Late":
        return total + 0.75;

      case "Half Day":
        return total + 0.5;

      default:
        return total;
    }
  }, 0);

  const attendancePercentage =
    workingDays === 0
      ? 0
      : Math.min(Math.round((attendanceCredits / workingDays) * 100), 100);

  const attendedDays = validMonthlyAttendance.filter((record) =>
    ["Present", "Late", "Half Day"].includes(record.status),
  ).length;

  // =====================================================
  // Weekly Goal Score
  // =====================================================

  const weeklyGoalScore = Math.min(
    (weeklyHours / attendanceConfig.requiredWeeklyHours) * 100,
    100,
  );

  // =====================================================
  // Punctuality
  // =====================================================

  let punctualityCredits = 0;

  validMonthlyAttendance.forEach((record) => {
    switch (record.status) {
      case "Present":
        punctualityCredits += 1;
        break;

      case "Late":
        punctualityCredits += 0.5;
        break;

      default:
        break;
    }
  });

  const punctuality =
    attendedDays === 0
      ? 100
      : Math.round((punctualityCredits / attendedDays) * 100);

  // =====================================================
  // Break Discipline
  // =====================================================

  const allowedBreak = attendanceConfig.maxBreakMinutes;

  let breakScore = 100;

  if (averageBreakDuration > allowedBreak) {
    breakScore = Math.max(0, 100 - (averageBreakDuration - allowedBreak) * 2);
  }

  // =====================================================
  // Work Efficiency / Productivity
  // =====================================================

  const productivity = Math.round(
    weeklyGoalScore * 0.5 +
      attendancePercentage * 0.2 +
      punctuality * 0.2 +
      breakScore * 0.1,
  );

  // =====================================================
  // Attendance Records For Streaks
  // =====================================================

  /*
    We deliberately filter these records again.

    A Present record on a holiday or weekend must NOT
    become part of a streak.
  */

  const attendanceRecords = attendanceHistory
    .filter(
      (record) =>
        isAttendanceWorkingDay(record.date) &&
        ["Present", "Late", "Half Day"].includes(record.status),
    )
    .sort((a, b) => b.date - a.date);

  // =====================================================
  // Current Streak
  // =====================================================

  let dayStreak = 0;

  const cursor = startOfDay(now);

  /*
    If today is a weekend/holiday, skip backwards until
    the most recent attendance-required day.
  */

  while (!isAttendanceWorkingDay(cursor)) {
    cursor.setDate(cursor.getDate() - 1);
  }

  while (true) {
    const found = attendanceRecords.find(
      (record) => getDateKey(record.date) === getDateKey(cursor),
    );

    if (!found) {
      break;
    }

    dayStreak++;

    cursor.setDate(cursor.getDate() - 1);

    while (!isAttendanceWorkingDay(cursor)) {
      cursor.setDate(cursor.getDate() - 1);
    }
  }

  // =====================================================
  // Longest Streak
  // =====================================================

  let longestStreak = 0;

  let currentStreak = 0;

  const sortedAttendance = [...attendanceRecords].sort(
    (a, b) => a.date - b.date,
  );

  let previousDate = null;

  for (const record of sortedAttendance) {
    const currentDate = startOfDay(record.date);

    if (!previousDate) {
      currentStreak = 1;

      longestStreak = 1;

      previousDate = currentDate;

      continue;
    }

    /*
      Find the next attendance-required day after the
      previous attendance record.

      This automatically skips:
        - Saturday
        - Sunday
        - Holidays
    */

    const expectedDate = new Date(previousDate);

    expectedDate.setDate(expectedDate.getDate() + 1);

    while (!isAttendanceWorkingDay(expectedDate)) {
      expectedDate.setDate(expectedDate.getDate() + 1);
    }

    if (currentDate.getTime() === expectedDate.getTime()) {
      currentStreak++;
    } else {
      currentStreak = 1;
    }

    longestStreak = Math.max(longestStreak, currentStreak);

    previousDate = currentDate;
  }

  // =====================================================
  // Weekly Goal
  // =====================================================

  const weeklyTarget = attendanceConfig.requiredWeeklyHours;

  const weeklyHoursRemaining = Math.max(weeklyTarget - weeklyHours, 0);

  const weeklyGoalPercentage = Math.min(
    Math.round((weeklyHours / weeklyTarget) * 100),
    100,
  );

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

    todayAttendanceRecords,

    weeklyAttendanceChart,
  };
};

import {
  getWeekRange,
  getMonthRange,
  isWorkingDay,
  formatWorkingHours,
} from "../utils/attenndaceHelper.js";
import { attendanceConfig } from "../config/attendanceConfig.js";
import { attendanceModel } from "../models/Attendance.model.js";

export const getAttendanceStats = async (userID) => {
  const now = new Date();

  const { weekStart, weekEnd } = getWeekRange(now);
  const { monthStart, monthEnd } = getMonthRange(now);

  // ---------- Weekly Attendance ----------

  const weeklyAttendance = await attendanceModel.find({
    user: userID,
    date: {
      $gte: weekStart,
      $lte: weekEnd,
    },
  });

  const totalWeeklySeconds = weeklyAttendance.reduce(
    (sum, record) => sum + record.totalWorkingSeconds,
    0,
  );

  const weeklyHours = formatWorkingHours(totalWeeklySeconds);

  // ---------- Monthly Attendance ----------

  const monthlyAttendance = await attendanceModel.find({
    user: userID,
    date: {
      $gte: monthStart,
      $lte: monthEnd,
    },
  });

  const totalMonthlySeconds = monthlyAttendance.reduce(
    (sum, record) => sum + record.totalWorkingSeconds,
    0,
  );

  const monthlyHours = formatWorkingHours(totalMonthlySeconds);

  // ---------- Average Check-in Time ----------

  const checkInRecords = monthlyAttendance.filter(
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

    averageCheckIn = `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;
  }

  // ---------- Average Break Duration ----------

  const averageBreakDuration =
    checkInRecords.length === 0
      ? 0
      : Math.round(
          monthlyAttendance.reduce(
            (sum, record) => sum + record.totalBreakSeconds,
            0,
          ) /
            checkInRecords.length /
            60,
        );

  // ---------- Attendance Percentage ----------

  let workingDays = 0;

  for (
    let date = new Date(monthStart);
    date <= now;
    date.setDate(date.getDate() + 1)
  ) {
    if (isWorkingDay(date)) {
      workingDays++;
    }
  }

  const attendanceCredits = monthlyAttendance.reduce((total, record) => {
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
    workingDays === 0 ? 0 : Math.round((attendanceCredits / workingDays) * 100);

  const attendedDays = monthlyAttendance.filter((record) =>
    ["Present", "Late", "Half Day"].includes(record.status),
  ).length;

  // ---------- Weekly Goal Score ----------

  const weeklyGoalScore = Math.min(
    (weeklyHours / attendanceConfig.requiredWeeklyHours) * 100,
    100,
  );

  // ---------- Punctuality ----------

  let punctualityCredits = 0;

  monthlyAttendance.forEach((record) => {
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

  // ---------- Break Discipline ----------

  const allowedBreak = attendanceConfig.maxBreakMinutes;

  let breakScore = 100;

  if (averageBreakDuration > allowedBreak) {
    breakScore = Math.max(0, 100 - (averageBreakDuration - allowedBreak) * 2);
  }

  // ---------- Work Efficiency ----------

  const productivity = Math.round(
    weeklyGoalScore * 0.5 +
      attendancePercentage * 0.2 +
      punctuality * 0.2 +
      breakScore * 0.1,
  );

  // ---------- Current Streak ----------

  const attendanceRecords = await attendanceModel
    .find({
      user: userID,
      status: {
        $in: ["Present", "Late", "Half Day"],
      },
    })
    .sort({
      date: -1,
    });

  let dayStreak = 0;

  const cursor = new Date(now);

  cursor.setHours(0, 0, 0, 0);

  while (true) {
    if (!isWorkingDay(cursor)) {
      cursor.setDate(cursor.getDate() - 1);
      continue;
    }

    const found = attendanceRecords.find(
      (record) => record.date.toDateString() === cursor.toDateString(),
    );

    if (!found) {
      break;
    }

    dayStreak++;

    cursor.setDate(cursor.getDate() - 1);
  }

  // ---------- Longest Streak ----------

  let longestStreak = 0;
  let currentStreak = 0;

  const sortedAttendance = [...attendanceRecords].sort(
    (a, b) => a.date - b.date,
  );

  let previousDate = null;

  for (const record of sortedAttendance) {
    if (!previousDate) {
      currentStreak = 1;
      longestStreak = 1;

      previousDate = new Date(record.date);
      previousDate.setHours(0, 0, 0, 0);

      continue;
    }

    const expectedDate = new Date(previousDate);

    expectedDate.setDate(expectedDate.getDate() + 1);

    while (!isWorkingDay(expectedDate)) {
      expectedDate.setDate(expectedDate.getDate() + 1);
    }

    const currentDate = new Date(record.date);

    currentDate.setHours(0, 0, 0, 0);

    if (currentDate.getTime() === expectedDate.getTime()) {
      currentStreak++;
    } else {
      currentStreak = 1;
    }

    longestStreak = Math.max(longestStreak, currentStreak);

    previousDate = currentDate;
  }

  // ---------- Weekly Goal ----------

  const weeklyTarget = attendanceConfig.requiredWeeklyHours;

  const weeklyHoursRemaining = Math.max(weeklyTarget - weeklyHours, 0);

  const weeklyGoalPercentage = Math.min(
    Math.round((weeklyHours / weeklyTarget) * 100),
    100,
  );

  return {
    dayStreak,
    longestStreak,

    attendancePercentage,

    weeklyHours,
    monthlyHours,

    productivity,

    punctuality,
    breakScore,
    weeklyGoalScore,

    weeklyTarget,
    weeklyHoursRemaining,
    weeklyGoalPercentage,

    averageCheckIn,
    averageBreakDuration,
  };
};

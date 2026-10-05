import { userModel } from "../../models/User.model.js";
import { attendanceModel } from "./../../models/Attendance.model.js";

const INDIA_TIME_ZONE = "Asia/Kolkata";

const getIndiaDateParts = (date = new Date()) => {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: INDIA_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "long",
  });

  const parts = formatter.formatToParts(new Date(date));

  const getPart = (type) => parts.find((part) => part.type === type)?.value;

  return {
    year: Number(getPart("year")),
    month: Number(getPart("month")),
    day: Number(getPart("day")),
    weekday: getPart("weekday"),
  };
};

const getIndiaMidnight = (date = new Date()) => {
  const { year, month, day } = getIndiaDateParts(date);

  return new Date(Date.UTC(year, month - 1, day, -5, -30, 0, 0));
};

const addDays = (date, amount) => {
  const result = new Date(date);
  result.setUTCDate(result.getUTCDate() + amount);
  return result;
};

const startOfDay = (date) => getIndiaMidnight(date);

const endOfDay = (date) => {
  const result = new Date(startOfDay(date));

  result.setUTCDate(result.getUTCDate() + 1);
  result.setUTCMilliseconds(result.getUTCMilliseconds() - 1);

  return result;
};

const getWeekday = (date) => {
  const { weekday } = getIndiaDateParts(date);

  const weekdayMap = {
    Sunday: 0,
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
  };

  return weekdayMap[weekday];
};

// =====================================================
// WEEKLY ATTENDANCE
// =====================================================

export const getAdminWeeklyAttendance = async () => {
  const now = new Date();

  const indiaToday = getIndiaMidnight(now);
  const todayWeekday = getWeekday(now);

  const daysSinceMonday = todayWeekday === 0 ? 6 : todayWeekday - 1;

  const weekStart = addDays(indiaToday, -daysSinceMonday);
  const weekEnd = endOfDay(addDays(weekStart, 6));

  const totalEmployees = await userModel.countDocuments();

  const attendanceRecords = await attendanceModel.find({
    date: {
      $gte: weekStart,
      $lte: weekEnd,
    },
  });

  const weeklyAttendance = [];

  for (let i = 0; i < 7; i++) {
    const date = addDays(weekStart, i);

    const dayStart = startOfDay(date);
    const dayEnd = endOfDay(date);

    const dayRecords = attendanceRecords.filter(
      (record) =>
        new Date(record.date) >= dayStart && new Date(record.date) <= dayEnd,
    );

    const present = dayRecords.filter((record) =>
      ["Present", "Late", "Half Day"].includes(record.status),
    ).length;

    const late = dayRecords.filter((record) => record.status === "Late").length;

    const absent = Math.max(totalEmployees - present, 0);

    weeklyAttendance.push({
      day: new Intl.DateTimeFormat("en-US", {
        timeZone: INDIA_TIME_ZONE,
        weekday: "short",
      }).format(date),

      present,
      absent,
      late,
    });
  }

  return {
    totalEmployees,
    weeklyAttendance,
  };
};

// =====================================================
// DEPARTMENT HEADCOUNT
// =====================================================

export const getAdminDepartmentHeadcount = async () => {
  const departmentData = await userModel.aggregate([
    {
      $group: {
        _id: {
          $cond: [
            {
              $eq: [
                {
                  $trim: {
                    input: { $ifNull: ["$department", ""] },
                  },
                },
                "",
              ],
            },
            "Unassigned",
            {
              $trim: {
                input: "$department",
              },
            },
          ],
        },

        count: {
          $sum: 1,
        },
      },
    },

    {
      $sort: {
        count: -1,
      },
    },
  ]);

  const totalEmployees = departmentData.reduce(
    (total, department) => total + department.count,
    0,
  );

  const departments = departmentData.map((department) => {
    const exactPercentage =
      totalEmployees > 0 ? (department.count / totalEmployees) * 100 : 0;

    return {
      department: department._id,
      count: department.count,
      percentage: Math.floor(exactPercentage),
      decimalPart: exactPercentage - Math.floor(exactPercentage),
    };
  });

  // =====================================================
  // MAKE TOTAL PERCENTAGE EXACTLY 100%
  // =====================================================

  const roundedTotal = departments.reduce(
    (total, department) => total + department.percentage,
    0,
  );

  let remainingPercentage = 100 - roundedTotal;

  // Give remaining percentage points to departments
  // with the largest decimal part
  departments.sort((a, b) => b.decimalPart - a.decimalPart);

  for (let i = 0; i < remainingPercentage; i++) {
    departments[i % departments.length].percentage += 1;
  }

  // Remove temporary calculation field
  departments.forEach((department) => {
    delete department.decimalPart;
  });

  return {
    totalEmployees,
    departments,
  };
};

// =====================================================
// 8 WEEK ATTENDANCE TREND
// =====================================================

export const getAdminAttendanceTrend = async () => {
  const now = new Date();

  const indiaToday = getIndiaMidnight(now);
  const todayWeekday = getWeekday(now);

  const daysSinceMonday = todayWeekday === 0 ? 6 : todayWeekday - 1;

  const currentWeekStart = addDays(indiaToday, -daysSinceMonday);

  const eightWeeksAgo = addDays(currentWeekStart, -49);

  const attendanceRecords = await attendanceModel.find({
    date: {
      $gte: eightWeeksAgo,
      $lte: endOfDay(addDays(currentWeekStart, 6)),
    },
  });

  const totalEmployees = await userModel.countDocuments();

  const weeks = [];

  for (let i = 7; i >= 0; i--) {
    const weekStart = addDays(currentWeekStart, -(i * 7));
    const weekEnd = endOfDay(addDays(weekStart, 6));

    const weekRecords = attendanceRecords.filter(
      (record) =>
        new Date(record.date) >= weekStart && new Date(record.date) <= weekEnd,
    );

    const attendedRecords = weekRecords.filter((record) =>
      ["Present", "Late", "Half Day"].includes(record.status),
    );

    const attendanceRate =
      totalEmployees > 0
        ? Math.min(
            Math.round((attendedRecords.length / (totalEmployees * 7)) * 100),
            100,
          )
        : 0;

    weeks.push({
      week: `W${8 - i}`,
      attendanceRate,
    });
  }

  return {
    weeks,
  };
};

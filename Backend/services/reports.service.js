import { attendanceConfig } from "../config/attendanceConfig.js";
import { attendanceModel } from "../models/Attendance.model.js";
import { holidayModel } from "../models/Holidays.model.js";
import { leaveBalanceModel } from "../models/LeaveBalance.model.js";
import { leaveModel } from "../models/Leave.model.js";

const TIME_ZONE = "Asia/Kolkata";
const DAY_MS = 24 * 60 * 60 * 1000;
const DAILY_TARGET_SECONDS = attendanceConfig.requiredDailyHours * 3600;
const roundHours = (value) =>
  Math.sign(value) * (Math.round((Math.abs(value) + Number.EPSILON) * 100) / 100);

const getDateParts = (date = new Date()) => {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  return Object.fromEntries(parts.map(({ type, value }) => [type, value]));
};

const dateKey = (date) => {
  const parts = getDateParts(date);
  return `${parts.year}-${parts.month}-${parts.day}`;
};

const parseDateKey = (key) => {
  const [year, month, day] = key.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
};

const addDays = (key, amount) => {
  const date = parseDateKey(key);
  date.setUTCDate(date.getUTCDate() + amount);
  return date.toISOString().slice(0, 10);
};

const indiaMidnight = (key) => {
  const [year, month, day] = key.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day, -5, -30));
};

const nextDayBoundary = (key) => indiaMidnight(addDays(key, 1));

const isValidDateKey = (value) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value || "")) return false;
  return parseDateKey(value).toISOString().slice(0, 10) === value;
};

const getRange = ({ range = "month", from, to }, now = new Date()) => {
  const today = dateKey(now);
  let start;
  let end = today;

  switch (range) {
    case "week": {
      const weekday = parseDateKey(today).getUTCDay();
      start = addDays(today, weekday === 0 ? -6 : 1 - weekday);
      break;
    }
    case "lastmonth": {
      const [year, month] = today.split("-").map(Number);
      const previousMonth = new Date(Date.UTC(year, month - 2, 1));
      start = previousMonth.toISOString().slice(0, 10);
      end = new Date(Date.UTC(year, month - 1, 0)).toISOString().slice(0, 10);
      break;
    }
    case "year":
      start = `${today.slice(0, 4)}-01-01`;
      break;
    case "custom":
      if (!isValidDateKey(from) || !isValidDateKey(to) || from > to) {
        throw new Error("Choose a valid start and end date for the report.");
      }
      if ((parseDateKey(to) - parseDateKey(from)) / DAY_MS > 365) {
        throw new Error("Custom report ranges can be up to one year.");
      }
      start = from;
      end = to;
      break;
    case "month":
      start = `${today.slice(0, 7)}-01`;
      break;
    default:
      throw new Error("Unsupported report date range.");
  }

  return {
    range,
    start,
    end,
    startAt: indiaMidnight(start),
    endAt: nextDayBoundary(end),
    today,
  };
};

const isWorkingDay = (key, holidayKeys) => {
  const weekday = parseDateKey(key).getUTCDay();
  return attendanceConfig.workingDays.includes(weekday) && !holidayKeys.has(key);
};

const effectiveSeconds = (record, now, today) => {
  if (!record?.checkInTime) return 0;
  if (record.checkOutTime || dateKey(record.date) !== today) {
    return Math.max(record.totalWorkingSeconds || 0, 0);
  }

  const lastBreak = record.breaks?.[record.breaks.length - 1];
  const activeBreak = lastBreak?.breakStart && !lastBreak.breakEnd
    ? Math.floor((now - new Date(lastBreak.breakStart)) / 1000)
    : 0;

  return Math.max(
    Math.floor((now - new Date(record.checkInTime)) / 1000) -
      (record.totalBreakSeconds || 0) -
      activeBreak,
    0,
  );
};

const formatCheckIn = (minutes) => {
  if (!minutes.length) return "--:--";
  const average = Math.round(minutes.reduce((sum, value) => sum + value, 0) / minutes.length);
  return `${String(Math.floor(average / 60)).padStart(2, "0")}:${String(average % 60).padStart(2, "0")}`;
};

const calculateStreaks = (records, holidayKeys, today) => {
  const attended = new Set(
    records
      .filter((record) => ["Present", "Late", "Half Day"].includes(record.status))
      .map((record) => dateKey(record.date)),
  );
  const allWorkingDates = [...attended].sort();
  let longestStreak = 0;
  let run = 0;
  let previous = null;

  for (const key of allWorkingDates) {
    if (!previous) run = 1;
    else {
      let expected = addDays(previous, 1);
      while (!isWorkingDay(expected, holidayKeys)) expected = addDays(expected, 1);
      run = expected === key ? run + 1 : 1;
    }
    longestStreak = Math.max(longestStreak, run);
    previous = key;
  }

  let cursor = today;
  while (!isWorkingDay(cursor, holidayKeys)) cursor = addDays(cursor, -1);
  let dayStreak = 0;
  while (attended.has(cursor)) {
    dayStreak += 1;
    cursor = addDays(cursor, -1);
    while (!isWorkingDay(cursor, holidayKeys)) cursor = addDays(cursor, -1);
  }

  return { dayStreak, longestStreak };
};

export const getEmployeeReport = async (userID, query = {}) => {
  const now = new Date();
  const range = getRange(query, now);
  const attendanceProjection = "date checkInTime checkOutTime breaks totalBreakSeconds totalWorkingSeconds status notes";
  const periodFilter = { user: userID, date: { $gte: range.startAt, $lt: range.endAt } };
  const currentWeekStart = (() => {
    const weekday = parseDateKey(range.today).getUTCDay();
    return addDays(range.today, weekday === 0 ? -6 : 1 - weekday);
  })();
  const weekStartAt = indiaMidnight(currentWeekStart);
  const weekEndAt = nextDayBoundary(range.today);
  const holidayEndAt = nextDayBoundary(range.end > range.today ? range.end : range.today);
  const reusePeriodForWeek = range.start <= currentWeekStart && range.end >= range.today;

  const [records, weeklyRecords, streakRecords, holidays, approvedLeaves, balance] = await Promise.all([
    attendanceModel.find(periodFilter).select(attendanceProjection).sort({ date: 1 }).lean(),
    reusePeriodForWeek
      ? Promise.resolve(null)
      : attendanceModel
          .find({ user: userID, date: { $gte: weekStartAt, $lt: weekEndAt } })
          .select("date checkInTime checkOutTime breaks totalBreakSeconds totalWorkingSeconds")
          .lean(),
    attendanceModel.find({ user: userID }).select("date status").sort({ date: 1 }).lean(),
    holidayModel
      .find({ isActive: true, date: { $lt: holidayEndAt } })
      .select("date")
      .lean(),
    leaveModel
      .find({
        user: userID,
        status: "Approved",
        startDate: { $lt: range.endAt },
        endDate: { $gte: range.startAt },
      })
      .select("startDate endDate")
      .lean(),
    leaveBalanceModel.findOne({ user: userID }).select("annual sick casual").lean(),
  ]);

  const holidayKeys = new Set(holidays.map((holiday) => dateKey(holiday.date)));
  const recordByDate = new Map(records.map((record) => [dateKey(record.date), record]));
  const leaveKeys = new Set();
  for (const leave of approvedLeaves) {
    let key = dateKey(leave.startDate);
    const leaveEnd = dateKey(leave.endDate);
    while (key <= leaveEnd) {
      if (key >= range.start && key <= range.end) leaveKeys.add(key);
      key = addDays(key, 1);
    }
  }

  const firstAttendanceDate = streakRecords.length ? dateKey(streakRecords[0].date) : range.end;
  const calendar = [];
  const reportRecords = [];
  let totalWorkingSeconds = 0;
  let totalBreakSeconds = 0;
  let attendanceCredits = 0;
  let punctualityCredits = 0;
  let attendedDays = 0;
  let eligibleWorkingDays = 0;
  const checkInMinutes = [];
  const leaveDays = new Set();

  for (let key = range.start; key <= range.end; key = addDays(key, 1)) {
    const record = recordByDate.get(key);
    let status;

    if (record) status = record.status || "Absent";
    else if (holidayKeys.has(key)) status = "Holiday";
    else if (!attendanceConfig.workingDays.includes(parseDateKey(key).getUTCDay())) status = "Weekend";
    else if (leaveKeys.has(key)) status = "Leave";
    else if (key > range.today || key < firstAttendanceDate) status = "Inactive";
    else status = "Absent";

    const seconds = record ? effectiveSeconds(record, now, range.today) : 0;
    const entry = {
      ...(record || {}),
      date: record?.date || indiaMidnight(key),
      dateKey: key,
      status,
      totalWorkingSeconds: seconds,
      totalBreakSeconds: record?.totalBreakSeconds || 0,
    };

    calendar.push({ day: Number(key.slice(-2)), date: key, status: status.toLowerCase() });

    if (!["Weekend", "Holiday", "Inactive"].includes(status)) {
      reportRecords.push(entry);
    }

    if (isWorkingDay(key, holidayKeys) && key <= range.today && status !== "Leave" && key >= firstAttendanceDate) {
      eligibleWorkingDays += 1;
      if (status === "Present") attendanceCredits += 1;
      else if (status === "Late") attendanceCredits += 0.75;
      else if (status === "Half Day") attendanceCredits += 0.5;
    }

    if (["Present", "Late", "Half Day"].includes(status)) {
      attendedDays += 1;
      totalWorkingSeconds += seconds;
      totalBreakSeconds += entry.totalBreakSeconds;
      if (status === "Present") punctualityCredits += 1;
      else if (status === "Late") punctualityCredits += 0.5;
      if (record?.checkInTime) {
        const parts = new Intl.DateTimeFormat("en-US", {
          timeZone: TIME_ZONE,
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }).formatToParts(new Date(record.checkInTime));
        const hour = Number(parts.find((part) => part.type === "hour")?.value || 0);
        const minute = Number(parts.find((part) => part.type === "minute")?.value || 0);
        checkInMinutes.push(hour * 60 + minute);
      }
    }

    if (status === "Leave") leaveDays.add(key);
  }

  const hours = totalWorkingSeconds / 3600;
  const weeklyHours = (weeklyRecords || records).reduce(
    (sum, record) => sum + effectiveSeconds(record, now, range.today),
    0,
  ) / 3600;
  const overtimeHours = reportRecords.reduce(
    (sum, record) => sum + Math.max(0, record.totalWorkingSeconds - DAILY_TARGET_SECONDS),
    0,
  ) / 3600;
  const averageBreakDuration = attendedDays
    ? Math.round(totalBreakSeconds / attendedDays / 60)
    : 0;
  const punctuality = attendedDays
    ? Math.round((punctualityCredits / attendedDays) * 100)
    : 100;
  const breakScore = averageBreakDuration > attendanceConfig.maxBreakMinutes
    ? Math.max(0, 100 - (averageBreakDuration - attendanceConfig.maxBreakMinutes) * 2)
    : 100;
  const weeklyGoalScore = Math.min((weeklyHours / attendanceConfig.requiredWeeklyHours) * 100, 100);
  const attendancePercentage = eligibleWorkingDays
    ? Math.min(Math.round((attendanceCredits / eligibleWorkingDays) * 100), 100)
    : 0;
  const productivity = attendedDays
    ? Math.round(
        weeklyGoalScore * 0.5 + attendancePercentage * 0.2 + punctuality * 0.2 + breakScore * 0.1,
      )
    : 0;
  const streaks = calculateStreaks(streakRecords, holidayKeys, range.today);
  const leaveRemaining = balance
    ? ["annual", "sick", "casual"].reduce(
        (sum, type) => sum + Math.max(0, (balance[type]?.total || 0) - (balance[type]?.used || 0)),
        0,
      )
    : 39;

  return {
    range: { id: range.range, startDate: range.start, endDate: range.end },
    stats: {
      ...streaks,
      attendancePercentage,
      weeklyHours: roundHours(weeklyHours),
      monthlyHours: roundHours(hours),
      totalWorkingHours: roundHours(hours),
      averageDailyHours: attendedDays ? roundHours(hours / attendedDays) : 0,
      leavesTaken: leaveDays.size,
      leavesRemaining: leaveRemaining,
      overtimeHours: roundHours(overtimeHours),
      productivity,
      punctuality,
      breakScore,
      weeklyGoalScore,
      weeklyTarget: attendanceConfig.requiredWeeklyHours,
      weeklyHoursRemaining: roundHours(Math.max(0, attendanceConfig.requiredWeeklyHours - weeklyHours)),
      weeklyGoalPercentage: Math.min(Math.round((weeklyHours / attendanceConfig.requiredWeeklyHours) * 100), 100),
      averageCheckIn: formatCheckIn(checkInMinutes),
      averageBreakDuration,
    },
    attendance: reportRecords.sort((a, b) => b.dateKey.localeCompare(a.dateKey)),
    calendar,
  };
};

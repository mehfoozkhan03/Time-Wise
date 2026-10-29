import { attendanceModel } from "../../models/Attendance.model.js";
import { AdminAIConversation } from "../../models/AdminAIConversation.model.js";
import { calendarModel } from "../../models/Calendar.model.js";
import { leaveModel } from "../../models/Leave.model.js";
import { holidayModel } from "../../models/Holidays.model.js";
import { userModel } from "../../models/User.model.js";
import { getAttendanceStats } from "../../services/attendanceStats.service.js";
import { getEmployeeReport } from "../../services/reports.service.js";
import { getIndiaDateKey, getTodayRange, getWeekRange } from "../../utils/attendanceHelper.js";
import { attendanceConfig } from "../../config/attendanceConfig.js";
import { ATTENDANCE_BLOCKING_HOLIDAY_TYPES } from "../../config/attendanceRules.js";
import { askTimeWiseAI } from "../../services/ai.services.js";
import { getTimeWiseOverviewReply, isTimeWiseImplementationQuestion, isTimeWiseProductQuestion } from "../../utils/timeWiseOverview.js";
import { formatEmployeeProfileAnswer, isProfileDetailsQuestion } from "../../utils/aiProfile.js";
import { getLeaveBalance } from "../../services/leave.service.js";

const employeeName = (employee) =>
  `${employee?.firstName || ""} ${employee?.lastName || ""}`.trim() ||
  String(employee?.name || "").trim();

const startAndEndOfToday = () => {
  const { startOfDay, endOfDay } = getTodayRange();
  return { start: startOfDay, end: endOfDay };
};

const startAndEndOfNextDays = (days) => {
  const { start } = startAndEndOfToday();
  return {
    start,
    end: new Date(start.getTime() + days * 24 * 60 * 60 * 1000 - 1),
  };
};

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const formatHours = (value) => Number(value || 0).toFixed(2);

const dateKeyFromText = (value) => {
  const text = value.trim();
  const currentYear = Number(getIndiaDateKey().slice(0, 4));
  const monthNumber = (monthText) => {
    const month = monthText.toLowerCase().slice(0, 3);
    return ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"].indexOf(month) + 1;
  };
  let year;
  let month;
  let day;
  let match = text.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);

  if (match) {
    [, year, month, day] = match.map(Number);
  } else if ((match = text.match(/^(\d{1,2})[/-](\d{1,2})(?:[/-](\d{4}))?$/))) {
    day = Number(match[1]);
    month = Number(match[2]);
    year = Number(match[3]) || currentYear;
  } else {
    const dayFirst = text.match(/^(\d{1,2})\s+([a-z]{3,9})(?:\s+(\d{4}))?$/i);
    const monthFirst = text.match(/^([a-z]{3,9})\s+(\d{1,2}),?(?:\s+(\d{4}))?$/i);
    if (dayFirst) {
      day = Number(dayFirst[1]);
      month = monthNumber(dayFirst[2]);
      year = Number(dayFirst[3]) || currentYear;
    } else if (monthFirst) {
      month = monthNumber(monthFirst[1]);
      day = Number(monthFirst[2]);
      year = Number(monthFirst[3]) || currentYear;
    } else {
      return null;
    }
  }

  const date = new Date(Date.UTC(year, month - 1, day));
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) return null;

  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
};

const shiftDateKey = (dateKey, days) => {
  const date = new Date(`${dateKey}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
};

const startOfDateKey = (key) => {
  const [year, month, day] = key.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day, -5, -30));
};

const endOfDateKey = (key) =>
  new Date(startOfDateKey(shiftDateKey(key, 1)).getTime() - 1);

const getPeriodDateKeys = (period) => {
  if (!period || period.range === "all") return null;
  if (period.range === "custom") return { start: period.from, end: period.to };

  const today = getIndiaDateKey();
  if (period.range === "week") {
    const { weekStart, weekEnd } = getWeekRange();
    return { start: getIndiaDateKey(weekStart), end: getIndiaDateKey(weekEnd) };
  }
  if (period.range === "month") return { start: `${today.slice(0, 7)}-01`, end: today };
  if (period.range === "lastmonth") {
    const [year, month] = today.split("-").map(Number);
    const start = new Date(Date.UTC(year, month - 2, 1));
    const end = new Date(Date.UTC(year, month - 1, 0));
    return { start: start.toISOString().slice(0, 10), end: end.toISOString().slice(0, 10) };
  }
  if (period.range === "year") return { start: `${today.slice(0, 4)}-01-01`, end: today };
  return null;
};

const getEmployeeReportQuery = (period) => {
  if (!period || period.range === "all") return null;
  return period;
};

const describePeriod = (period, bounds) => {
  if (!period || period.range === "all") return "overall";
  if (bounds?.start === bounds?.end) return formatDateKey(bounds.start);
  if (bounds?.start && bounds?.end) {
    return `${formatDateKey(bounds.start)} to ${formatDateKey(bounds.end)}`;
  }
  return "the selected period";
};

const resolveAttendancePeriod = (question) => {
  const datePattern = String.raw`(?:\d{4}-\d{1,2}-\d{1,2}|\d{1,2}[/-]\d{1,2}(?:[/-]\d{4})?|\d{1,2}\s+[a-z]{3,9}(?:\s+\d{4})?|[a-z]{3,9}\s+\d{1,2},?(?:\s+\d{4})?)`;
  const rangeMatch = question.match(new RegExp(`(?:\\b(?:from|between)\\s+)?(${datePattern})\\s+(?:to|through|until|and|[-–])\\s+(${datePattern})\\b`, "i"));
  if (rangeMatch) {
    const from = dateKeyFromText(rangeMatch[1]);
    const to = dateKeyFromText(rangeMatch[2]);
    if (from && to && from <= to) return { range: "custom", from, to };
    return { range: "invalid" };
  }

  const dateMatch = question.match(new RegExp(`\\b(?:on|for|dated?)\\s+(${datePattern})\\b`, "i")) ||
    question.match(new RegExp(`(${datePattern})`, "i"));
  if (dateMatch) {
    const date = dateKeyFromText(dateMatch[1]);
    if (date) return { range: "custom", from: date, to: date };
    return { range: "invalid" };
  }

  if (/\b(last|previous)\s+week\b/.test(question)) {
    const { weekStart } = getWeekRange();
    const currentStart = getIndiaDateKey(weekStart);
    const from = shiftDateKey(currentStart, -7);
    return { range: "custom", from, to: shiftDateKey(currentStart, -1) };
  }
  if (/\bnext\s+week\b/.test(question)) {
    const { weekStart } = getWeekRange();
    const from = shiftDateKey(getIndiaDateKey(weekStart), 7);
    return { range: "custom", from, to: shiftDateKey(from, 6) };
  }
  if (/\b(last|previous)\s+month\b/.test(question)) return { range: "lastmonth" };
  if (/\b(last|previous)\s+year\b/.test(question)) {
    const year = Number(getIndiaDateKey().slice(0, 4)) - 1;
    return { range: "custom", from: `${year}-01-01`, to: `${year}-12-31` };
  }
  if (/\b(this|current)\s+year\b/.test(question)) return { range: "year" };
  if (/\b(this|current)\s+week\b/.test(question)) return { range: "week" };
  if (/\b(this|current)\s+month\b/.test(question)) return { range: "month" };
  if (/\b(last|past)\s+7\s+days\b/.test(question)) {
    const to = getIndiaDateKey();
    return { range: "custom", from: shiftDateKey(to, -6), to };
  }
  if (/\b(last|past)\s+30\s+days\b/.test(question)) {
    const to = getIndiaDateKey();
    return { range: "custom", from: shiftDateKey(to, -29), to };
  }
  if (/\byesterday\b/.test(question)) {
    const date = shiftDateKey(getIndiaDateKey(), -1);
    return { range: "custom", from: date, to: date };
  }
  if (/\btoday\b/.test(question)) {
    const date = getIndiaDateKey();
    return { range: "custom", from: date, to: date };
  }
  if (/\b(tomorrow|next day)\b/.test(question)) {
    const date = shiftDateKey(getIndiaDateKey(), 1);
    return { range: "custom", from: date, to: date };
  }
  if (/\b(overall|all[ -]?time|entire history|historically|to date|total)\b/.test(question)) {
    return { range: "all" };
  }
  if (/\bthis week\b|\bthis month\b|\bthis year\b/.test(question)) {
    return { range: question.includes("week") ? "week" : question.includes("month") ? "month" : "year" };
  }
  return null;
};

const formatDateKey = (dateKey) => new Date(`${dateKey}T12:00:00Z`).toLocaleDateString("en-IN", {
  timeZone: "Asia/Kolkata",
  day: "numeric",
  month: "long",
  year: "numeric",
});

const getOrganizationAttendanceSummary = async (employees, period) => {
  const employeeIds = employees.map((employee) => employee._id);
  const emptySummary = {
    startKey: getIndiaDateKey(),
    endKey: getIndiaDateKey(),
    eligibleWorkingDays: 0,
    attendanceRate: 0,
    presentEmployeeIds: new Set(),
    lateEmployeeIds: new Set(),
    absentEmployeeIds: new Set(),
    validRecords: [],
    records: [],
    missingToday: employees.length,
  };
  if (!employeeIds.length) return emptySummary;

  const firstAttendanceRows = await attendanceModel.aggregate([
    { $match: { user: { $in: employeeIds } } },
    { $group: { _id: "$user", firstDate: { $min: "$date" } } },
  ]);
  const firstDateByEmployee = new Map(
    firstAttendanceRows.map((item) => [String(item._id), getIndiaDateKey(item.firstDate)]),
  );
  for (const employee of employees) {
    if (!firstDateByEmployee.has(String(employee._id)) && employee.createdAt) {
      firstDateByEmployee.set(String(employee._id), getIndiaDateKey(employee.createdAt));
    }
  }
  const requestedBounds = getPeriodDateKeys(period);
  const todayKey = getIndiaDateKey();
  const allTime = period?.range === "all";
  const firstDates = [...firstDateByEmployee.values()].sort();
  const requestedStart = requestedBounds?.start || firstDates[0] || todayKey;
  const requestedEnd = requestedBounds?.end || todayKey;
  const endKey = requestedEnd > todayKey ? todayKey : requestedEnd;

  if (requestedStart > todayKey) {
    return { ...emptySummary, startKey: requestedStart, endKey: requestedEnd, future: true };
  }
  if (!allTime && (Date.parse(`${endKey}T00:00:00Z`) - Date.parse(`${requestedStart}T00:00:00Z`)) / 86400000 > 365) {
    return { ...emptySummary, invalidRange: true };
  }

  const startAt = startOfDateKey(requestedStart);
  const endAt = endOfDateKey(endKey);
  const [records, holidays, approvedLeaves] = await Promise.all([
    attendanceModel
      .find({ user: { $in: employeeIds }, date: { $gte: startAt, $lte: endAt } })
      .select("user date status checkInTime")
      .populate("user", "firstName lastName email")
      .sort({ date: 1 })
      .lean(),
    holidayModel
      .find({
        isActive: true,
        type: { $in: ATTENDANCE_BLOCKING_HOLIDAY_TYPES },
        date: { $gte: startAt, $lte: endAt },
      })
      .select("date")
      .lean(),
    leaveModel
      .find({
        user: { $in: employeeIds },
        status: "Approved",
        startDate: { $lte: endAt },
        endDate: { $gte: startAt },
      })
      .select("user startDate endDate")
      .lean(),
  ]);

  const holidayKeys = new Set(holidays.map((holiday) => getIndiaDateKey(holiday.date)));
  const leaveDaysByEmployee = new Map();
  for (const leave of approvedLeaves) {
    const employeeKey = String(leave.user);
    const days = leaveDaysByEmployee.get(employeeKey) || new Set();
    let key = getIndiaDateKey(leave.startDate);
    const leaveEnd = getIndiaDateKey(leave.endDate);
    if (key < requestedStart) key = requestedStart;
    const lastDay = leaveEnd > endKey ? endKey : leaveEnd;
    while (key <= lastDay) {
      days.add(key);
      key = shiftDateKey(key, 1);
    }
    leaveDaysByEmployee.set(employeeKey, days);
  }

  const recordByEmployeeDay = new Map();
  const todayRecordIds = new Set();
  for (const record of records) {
    const employeeKey = String(record.user?._id || record.user);
    const key = getIndiaDateKey(record.date);
    recordByEmployeeDay.set(`${employeeKey}:${key}`, record);
    if (key === todayKey) todayRecordIds.add(employeeKey);
  }

  const validRecords = [];
  const presentEmployeeIds = new Set();
  const lateEmployeeIds = new Set();
  const absentEmployeeIds = new Set();
  let eligibleWorkingDays = 0;
  let attendanceCredits = 0;

  for (const employee of employees) {
    const employeeKey = String(employee._id);
    const firstDate = firstDateByEmployee.get(employeeKey);
    if (!firstDate) continue;

    let key = requestedStart < firstDate ? firstDate : requestedStart;
    const leaveDays = leaveDaysByEmployee.get(employeeKey) || new Set();
    while (key <= endKey) {
      const weekday = new Date(`${key}T00:00:00Z`).getUTCDay();
      if (!attendanceConfig.workingDays.includes(weekday) || holidayKeys.has(key) || leaveDays.has(key)) {
        key = shiftDateKey(key, 1);
        continue;
      }

      const record = recordByEmployeeDay.get(`${employeeKey}:${key}`);
      if (record?.status === "Leave") {
        key = shiftDateKey(key, 1);
        continue;
      }

      eligibleWorkingDays += 1;
      if (record) {
        validRecords.push(record);
        if (["Present", "Late", "Half Day"].includes(record.status) && (key !== todayKey || record.checkInTime)) {
          if (record.status === "Present") attendanceCredits += 1;
          else if (record.status === "Late") attendanceCredits += 0.75;
          else attendanceCredits += 0.5;
          presentEmployeeIds.add(employeeKey);
        }
        if (record.status === "Late" && (key !== todayKey || record.checkInTime)) lateEmployeeIds.add(employeeKey);
        if (record.status === "Absent") absentEmployeeIds.add(employeeKey);
      }
      key = shiftDateKey(key, 1);
    }
  }

  return {
    startKey: requestedStart,
    endKey,
    eligibleWorkingDays,
    attendanceRate: eligibleWorkingDays
      ? Math.min(Math.round((attendanceCredits / eligibleWorkingDays) * 100), 100)
      : 0,
    presentEmployeeIds,
    lateEmployeeIds,
    absentEmployeeIds,
    validRecords,
    records,
    missingToday: Math.max(employees.length - todayRecordIds.size, 0),
    allTime,
  };
};

const formatEmployeeNames = (employeeIds, employees, records = []) => {
  const employeeById = new Map(employees.map((employee) => [String(employee._id), employee]));
  const statusById = new Map();
  for (const record of records) {
    const key = String(record.user?._id || record.user);
    if (!statusById.has(key) || record.status === "Late" || record.status === "Half Day") {
      statusById.set(key, record.status);
    }
  }

  const names = [...employeeIds].map((key) => {
    const employee = employeeById.get(key);
    const name = employeeName(employee) || employee?.email || "Unknown employee";
    const status = statusById.get(key);
    return status && status !== "Present" ? `${name} (${status})` : name;
  });
  const shownNames = names.slice(0, 50);
  const remainder = names.length - shownNames.length;
  return `${shownNames.join(", ")}${remainder > 0 ? `, and ${remainder} more` : ""}`;
};

const replyWithSavedConversation = async (req, res, question, answer) => {
  await AdminAIConversation.findOneAndUpdate(
    { adminID: req.admin.adminID },
    {
      $push: {
        messages: {
          $each: [
            { role: "user", content: question },
            { role: "assistant", content: answer },
          ],
          $slice: -100,
        },
      },
    },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );

  return res.status(200).json({ success: true, answer });
};

export const getAdminAIConversation = async (req, res) => {
  try {
    const conversation = await AdminAIConversation.findOne({
      adminID: req.admin.adminID,
    })
      .select("messages")
      .lean();

    return res.status(200).json({
      success: true,
      conversation: conversation?.messages || [],
    });
  } catch (error) {
    console.error("Get Admin WiseBot conversation error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to load the Admin WiseBot conversation.",
    });
  }
};

export const clearAdminAIConversation = async (req, res) => {
  try {
    await AdminAIConversation.deleteOne({ adminID: req.admin.adminID });
    return res.status(200).json({
      success: true,
      message: "Admin WiseBot conversation cleared.",
    });
  } catch (error) {
    console.error("Clear Admin WiseBot conversation error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to clear the Admin WiseBot conversation.",
    });
  }
};

const resolveEmployee = (employees, question) => {
  const lowerQuestion = question.toLowerCase();
  const emailMatches = employees.filter((employee) => {
    const email = String(employee.email || "").toLowerCase();
    return email && lowerQuestion.includes(email);
  });
  if (emailMatches.length === 1) return emailMatches[0];
  if (emailMatches.length > 1) return null;

  const fullNameMatches = employees.filter((employee) => {
    const fullName = employeeName(employee).toLowerCase();
    const nameParts = fullName.split(/[^a-z0-9]+/).filter(Boolean);
    const questionParts = new Set(lowerQuestion.split(/[^a-z0-9]+/).filter(Boolean));
    const allNamePartsPresent = nameParts.length >= 2 && nameParts.every((part) => questionParts.has(part));
    return fullName && (lowerQuestion.includes(fullName) || allNamePartsPresent);
  });
  if (fullNameMatches.length === 1) return fullNameMatches[0];
  if (fullNameMatches.length > 1) return null;

  const firstNameMatches = employees.filter((employee) =>
    employee.firstName &&
    lowerQuestion.split(/[^a-z0-9]+/).includes(employee.firstName.toLowerCase()),
  );
  return firstNameMatches.length === 1 ? firstNameMatches[0] : null;
};

const hasWordWithCommonTypos = (text, word) => {
  const normalizedWord = word.toLowerCase();
  return text
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(Boolean)
    .some((token) => {
      if (token === normalizedWord) return true;

      let previous = Array.from({ length: normalizedWord.length + 1 }, (_, index) => index);
      for (let row = 1; row <= token.length; row += 1) {
        const current = [row];
        for (let column = 1; column <= normalizedWord.length; column += 1) {
          current[column] = Math.min(
            current[column - 1] + 1,
            previous[column] + 1,
            previous[column - 1] + (token[row - 1] === normalizedWord[column - 1] ? 0 : 1),
          );
        }
        previous = current;
      }
      return previous[normalizedWord.length] <= 1;
    });
};

export const askAdminAI = async (req, res) => {
  try {
    const question = String(req.body?.message || "").trim();
    if (!question) return res.status(400).json({ success: false, message: "Please enter a question." });

    const lowerQuestion = question.toLowerCase();
    if (/(stock|share price|market price|share market)/.test(lowerQuestion)) {
      return replyWithSavedConversation(req, res, question, "I can't provide stock prices. I can help with employees, attendance, working hours, overtime, productivity, leave requests, calendar events, and upcoming holidays.");
    }

    if (/\b(password|passcode|authentication token|access token|secret|credential)\b/i.test(question)) {
      return replyWithSavedConversation(req, res, question, "For security, WiseBot can't reveal passwords or authentication secrets. An employee can reset a password from Settings > Security.");
    }

    if (isTimeWiseImplementationQuestion(question)) {
      return replyWithSavedConversation(req, res, question, "I can explain TimeWise pages and user-facing features, but I can't provide source code or internal technical details. What would you like to know about using TimeWise?");
    }

    const asksForEmployeeCount =
      (lowerQuestion.includes("how many") || lowerQuestion.includes("count") || lowerQuestion.includes("number of")) &&
      (lowerQuestion.includes("employee") || lowerQuestion.includes("staff"));
    const asksAboutEmployeeRecords =
      /(attendance|\bpresent(?:ed)?\b|\babsent\b|\blate\b|check.?in|\bleaves?\b)/.test(lowerQuestion);

    if (asksForEmployeeCount && !asksAboutEmployeeRecords) {
      const employeeCount = await userModel.countDocuments({ adminID: req.admin.adminID });
      return replyWithSavedConversation(req, res, question, `There are ${employeeCount} employees in your organisation.`);
    }

    const employees = await userModel
      .find({ adminID: req.admin.adminID })
      .select("firstName lastName name email department designation createdAt")
      .lean();
    const employeeIds = employees.map((employee) => employee._id);
    const employee = resolveEmployee(employees, question);

    const asksForLeaveBalance = /\b(leave|annual|sick|casual)\b/i.test(question) &&
      /\b(balance|remaining|left|available)\b/i.test(question) &&
      !/\b(how does|how do|how can|how to|explain|describe|feature|policy work)\b/i.test(question);
    if (asksForLeaveBalance) {
      if (!employee) {
        return replyWithSavedConversation(req, res, question, "Please include the employee's full name or registered email so I can check their leave balance in your organisation.");
      }
      const balance = await getLeaveBalance(employee._id);
      const types = ["annual", "sick", "casual"].filter((type) =>
        new RegExp(`\\b${type}\\b`, "i").test(question),
      );
      const selectedTypes = types.length ? types : ["annual", "sick", "casual"];
      const answer = selectedTypes.map((type) => {
        const item = balance?.[type] || { total: 0, used: 0 };
        const available = Number(item.total || 0) - Number(item.used || 0);
        return `${employeeName(employee)} — ${type} leave: ${available} day${available === 1 ? "" : "s"} available (${item.used || 0} used of ${item.total || 0}).`;
      }).join(" ");
      return replyWithSavedConversation(req, res, question, answer);
    }

    const asksAboutOneEmployee = Boolean(employee) &&
      /\b(who is|tell me about|details of|details for|profile of|information about|information on)\b/i.test(question) &&
      !/\b(attendance|present|absent|late|working hours?|overtime|productivity)\b/i.test(question);
    const asksForEmployeeProfile = isProfileDetailsQuestion(question) || asksAboutOneEmployee;
    if (asksForEmployeeProfile) {
      if (!employee) {
        return replyWithSavedConversation(req, res, question, "Please include the employee's full name or registered email so I can find the profile in your organisation.");
      }
      const profile = await userModel.findOne({ _id: employee._id, adminID: req.admin.adminID })
        .select("firstName lastName name email role department designation dob gender phone address bio socialLinks emergencyContact createdAt")
        .lean();
      const fullProfile = /\b(profile|personal details|personal information|employee details|employee information|employee profile|contact information|contact details|details of|details for|information about|information on|all (?:my |employee )?details|full details|complete details|tell me about|who is)\b/i.test(question);
      const answer = profile
        ? formatEmployeeProfileAnswer(profile, question, { full: fullProfile })
        : "I couldn't find that employee in your organisation.";
      return replyWithSavedConversation(req, res, question, answer);
    }

    if (isTimeWiseProductQuestion(question)) {
      const priorConversation = await AdminAIConversation.findOne({ adminID: req.admin.adminID })
        .select("messages")
        .lean();
      let answer;
      try {
        answer = await askTimeWiseAI(question, {
          isProductQuestion: true,
          productRole: "admin",
        }, priorConversation?.messages || []);
      } catch (error) {
        console.error("Admin WiseBot product question failed:", error.message);
        answer = getTimeWiseOverviewReply(question, "admin") ||
          "I can explain TimeWise features, but I don't have enough product information to answer that specific detail. Please check the relevant page or ask your system administrator.";
      }
      return replyWithSavedConversation(req, res, question, answer);
    }

    const asksAboutLateEmployees = hasWordWithCommonTypos(lowerQuestion, "late");
    const asksOrganizationAttendance = !employee &&
      /\b(attendance|present(?:ed)?|absent|absence|late|check.?in|check.?out|punctuality)\b/.test(lowerQuestion);
    if (asksOrganizationAttendance) {
      const period = resolveAttendancePeriod(lowerQuestion);
      if (period?.range === "invalid") {
        return replyWithSavedConversation(req, res, question, "I couldn't read that date range. Please use a date like 2026-10-14 or 14/10/2026, or write ‘from 2026-10-01 to 2026-10-14’.");
      }
      const effectivePeriod = period || { range: "custom", from: getIndiaDateKey(), to: getIndiaDateKey() };
      if (effectivePeriod.range === "custom" && effectivePeriod.to > getIndiaDateKey()) {
        if (effectivePeriod.from > getIndiaDateKey()) {
          return replyWithSavedConversation(req, res, question, "Attendance data isn't available for future dates.");
        }
        effectivePeriod.to = getIndiaDateKey();
      }
      const summary = await getOrganizationAttendanceSummary(employees, effectivePeriod);
      if (summary.future) return replyWithSavedConversation(req, res, question, "Attendance data isn't available for future dates.");
      if (summary.invalidRange) return replyWithSavedConversation(req, res, question, "Please request a date range of one year or less.");

      const periodLabel = describePeriod(effectivePeriod, { start: summary.startKey, end: summary.endKey });
      const asksForNames = /\b(who|names?|list|which)\b/.test(lowerQuestion);
      const asksForAbsentees = /\b(absent|absence)\b/.test(lowerQuestion);
      const asksForLate = asksAboutLateEmployees || /\blate\b/.test(lowerQuestion);
      const asksForRate = /\b(rate|percentage|percent|overall attendance)\b/.test(lowerQuestion);
      const selectedDate = summary.startKey === summary.endKey;
      const selectedDateKey = summary.endKey;
      const selectedDayRecords = summary.records.filter((record) => getIndiaDateKey(record.date) === selectedDateKey);
      const presentRecords = selectedDate
        ? selectedDayRecords.filter((record) => record.checkInTime && ["Present", "Late", "Half Day"].includes(record.status))
        : summary.validRecords.filter((record) => ["Present", "Late", "Half Day"].includes(record.status));
      const lateRecords = selectedDate
        ? selectedDayRecords.filter((record) => record.status === "Late" && (selectedDateKey !== getIndiaDateKey() || record.checkInTime))
        : summary.validRecords.filter((record) => record.status === "Late");
      const absentRecords = selectedDate
        ? selectedDayRecords.filter((record) => record.status === "Absent")
        : summary.validRecords.filter((record) => record.status === "Absent");
      const presentIds = selectedDate ? new Set(presentRecords.map((record) => String(record.user?._id || record.user))) : summary.presentEmployeeIds;
      const lateIds = selectedDate ? new Set(lateRecords.map((record) => String(record.user?._id || record.user))) : summary.lateEmployeeIds;
      const absentIds = new Set(absentRecords.map((record) => String(record.user?._id || record.user)));
      if (asksForNames) {
        const ids = asksForAbsentees ? absentIds : asksForLate ? lateIds : presentIds;
        const label = asksForAbsentees ? "marked absent" : asksForLate ? "marked late" : "present";
        const names = formatEmployeeNames(ids, employees, selectedDate ? selectedDayRecords : summary.validRecords);
        const answer = ids.size
          ? `Employees ${label} ${selectedDate ? periodLabel : `during ${periodLabel}`} (${ids.size}): ${names}.`
          : `No employees were ${label} ${selectedDate ? periodLabel : `during ${periodLabel}`}.`;
        return replyWithSavedConversation(req, res, question, answer);
      }
      if (asksForRate) {
        return replyWithSavedConversation(req, res, question, `Organisation attendance for ${periodLabel} was ${summary.attendanceRate}% across ${summary.eligibleWorkingDays} eligible employee workdays.`);
      }
      if (asksForAbsentees) {
        const missing = selectedDate ? Math.max(employees.length - new Set(selectedDayRecords.map((record) => String(record.user?._id || record.user))).size, 0) : 0;
        const suffix = missing ? ` ${missing} employees have no attendance record for that date.` : "";
        return replyWithSavedConversation(req, res, question, `${absentIds.size} employees were marked absent ${periodLabel}.${suffix}`);
      }
      if (asksForLate) {
        return replyWithSavedConversation(req, res, question, `${lateIds.size} employees were marked late ${periodLabel}${lateIds.size ? `: ${formatEmployeeNames(lateIds, employees, selectedDate ? selectedDayRecords : summary.validRecords)}` : ""}.`);
      }
      if (selectedDate) {
        const recordIds = new Set(selectedDayRecords.map((record) => String(record.user?._id || record.user)));
        const absentCount = absentIds.size;
        const missing = Math.max(employees.length - recordIds.size, 0);
        return replyWithSavedConversation(req, res, question, `${presentIds.size} of ${employees.length} employees were present ${periodLabel}; ${absentCount} were marked absent and ${missing} have no attendance record.`);
      }
      const presentEmployeeDays = presentRecords.length;
      return replyWithSavedConversation(req, res, question, `During ${periodLabel}, ${presentIds.size} employees attended at least once across ${presentEmployeeDays} employee-days. Attendance was ${summary.attendanceRate}% across ${summary.eligibleWorkingDays} eligible employee workdays.`);
    }

    if (lowerQuestion.includes("holiday") || lowerQuestion.includes("holidays") || lowerQuestion.includes("festival")) {
      const requestedName = lowerQuestion
        .replace(/\b(when|is|are|the|next|upcoming|nearby|what|which|date|of|for|holiday|holidays|festival|festivals|all|list|every|this|year|in|our|company)\b/g, " ")
        .replace(/[^a-z0-9\s]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
      const today = startAndEndOfToday().start;
      const holidayQuery = {
        createdBy: req.admin.adminID,
        isActive: true,
        date: { $gte: today },
      };
      if (requestedName) {
        holidayQuery.title = { $regex: escapeRegex(requestedName), $options: "i" };
      }
      const holidays = await holidayModel
        .find(holidayQuery)
        .select("title date")
        .sort({ date: 1 })
        .limit(requestedName ? 1 : 2)
        .lean();
      const answer = holidays.length
        ? holidays.map((holiday) => `${holiday.title} — ${new Date(holiday.date).toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata", weekday: "long", day: "numeric", month: "long", year: "numeric" })}`).join("; ")
        : requestedName
          ? `No upcoming holiday matching \"${requestedName}\" was found.`
          : "No upcoming holidays were found.";
      return replyWithSavedConversation(req, res, question, answer);
    }

    if (/\bleaves?\b/.test(lowerQuestion)) {
      const period = resolveAttendancePeriod(lowerQuestion);
      if (period?.range === "invalid") {
        return replyWithSavedConversation(req, res, question, "I couldn't read that date range. Please use a date like 2026-10-14, or write ‘from 2026-10-01 to 2026-10-14’.");
      }
      const bounds = getPeriodDateKeys(period);
      const today = startAndEndOfToday();
      const leaveQuery = {
        user: { $in: employee ? [employee._id] : employeeIds },
      };
      if (bounds) {
        const start = startOfDateKey(bounds.start);
        const end = endOfDateKey(bounds.end);
        leaveQuery.startDate = { $lte: end };
        leaveQuery.endDate = { $gte: start };
      } else if (period?.range !== "all") {
        leaveQuery.endDate = { $gte: today.start };
      }
      if (lowerQuestion.includes("pending")) leaveQuery.status = "Pending";
      else if (lowerQuestion.includes("approved")) leaveQuery.status = "Approved";
      else if (lowerQuestion.includes("rejected")) leaveQuery.status = "Rejected";
      else if (lowerQuestion.includes("cancelled") || lowerQuestion.includes("canceled")) leaveQuery.status = "Cancelled";
      const leaves = await leaveModel
        .find(leaveQuery)
        .populate("user", "firstName lastName email")
        .sort({ startDate: 1 })
        .lean();
      const statusLabel = leaveQuery.status ? ` ${leaveQuery.status.toLowerCase()}` : "";
      const periodLabel = bounds ? ` for ${describePeriod(period, bounds)}` : period?.range === "all" ? " overall" : " upcoming";
      const asksForCount = /\b(how many|count|number of)\b/.test(lowerQuestion);
      const asksForList = /\b(list|show|who|which|details|requests)\b/.test(lowerQuestion) && !asksForCount;
      const subject = employee ? `${employeeName(employee)}'s` : "Organisation";
      const answer = asksForCount
        ? `${subject} ${statusLabel.trim() ? `${statusLabel.trim()} ` : ""}leave request count${periodLabel}: ${leaves.length}.`
        : leaves.length
          ? `${subject} leave requests${periodLabel} (${leaves.length}): ${leaves.slice(0, 30).map((leave) => `${employeeName(leave.user) || leave.user?.email || "Employee"} — ${leave.leaveType} (${leave.status}, ${formatDateKey(getIndiaDateKey(leave.startDate))} to ${formatDateKey(getIndiaDateKey(leave.endDate))})`).join("; ")}${leaves.length > 30 ? `; and ${leaves.length - 30} more` : ""}.`
          : asksForList
            ? "No matching leave requests were found."
            : `${subject} has no matching${statusLabel} leave requests${periodLabel}.`;
      return replyWithSavedConversation(req, res, question, answer);
    }

    if (lowerQuestion.includes("meeting") || lowerQuestion.includes("calendar") || lowerQuestion.includes("event") || lowerQuestion.includes("schedule")) {
      const period = resolveAttendancePeriod(lowerQuestion);
      if (period?.range === "invalid") {
        return replyWithSavedConversation(req, res, question, "I couldn't read that date range. Please specify a date like 2026-10-14 or a range such as ‘from 2026-10-01 to 2026-10-14’.");
      }
      const bounds = getPeriodDateKeys(period);
      const range = bounds
        ? { start: startOfDateKey(bounds.start), end: endOfDateKey(bounds.end) }
        : period?.range === "all"
          ? null
          : /\b(upcoming|next)\b/.test(lowerQuestion)
            ? startAndEndOfNextDays(30)
            : startAndEndOfToday();
      const eventQuery = { isActive: true, createdBy: req.admin.adminID, createdByModel: "Admin" };
      if (range) eventQuery.date = { $gte: range.start, $lte: range.end };
      const events = await calendarModel
        .find(eventQuery)
        .sort({ date: 1, startTime: 1 })
        .lean();
      const asksForCount = /\b(how many|count|number of)\b/.test(lowerQuestion);
      const eventPeriod = range ? (bounds ? describePeriod(period, bounds) : "the next 30 days") : "overall";
      const answer = asksForCount
        ? `There ${events.length === 1 ? "is" : "are"} ${events.length} calendar event${events.length === 1 ? "" : "s"} for ${eventPeriod}.`
        : events.length
          ? `Calendar events for ${eventPeriod} (${events.length}): ${events.slice(0, 30).map((event) => `${event.title} on ${new Date(event.date).toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata" })}${event.startTime ? ` at ${event.startTime}` : ""}`).join("; ")}${events.length > 30 ? `; and ${events.length - 30} more` : ""}.`
          : `No calendar events were found for ${eventPeriod}.`;
      return replyWithSavedConversation(req, res, question, answer);
    }

    if (employee) {
      const name = employeeName(employee) || employee.email;
      const asksAttendance = /\b(attendance|present(?:ed)?|absent|absence|late|check.?in|check.?out)\b/.test(lowerQuestion);
      const asksHours = /\bworking hours?\b/.test(lowerQuestion);
      const asksOvertime = /\bovertime\b/.test(lowerQuestion);
      const asksProductivity = /\bproductivity\b/.test(lowerQuestion);
      if (asksAttendance || asksHours || asksOvertime || asksProductivity) {
        const period = resolveAttendancePeriod(lowerQuestion);
        if (period?.range === "invalid") {
          return replyWithSavedConversation(req, res, question, "I couldn't read that date. Please use a date like 2026-10-14 or a range such as ‘from 2026-10-01 to 2026-10-14’.");
        }
        const bounds = getPeriodDateKeys(period);
        if (bounds && (Date.parse(`${bounds.end}T00:00:00Z`) - Date.parse(`${bounds.start}T00:00:00Z`)) / 86400000 > 365) {
          return replyWithSavedConversation(req, res, question, "Please request a date range of one year or less.");
        }
        if (bounds && bounds.start > getIndiaDateKey()) {
          return replyWithSavedConversation(req, res, question, "I can't provide attendance or work statistics for a future date.");
        }
        const stats = await getAttendanceStats(employee._id);
        const report = bounds ? await getEmployeeReport(employee._id, getEmployeeReportQuery(period)) : null;
        const periodLabel = bounds ? describePeriod(period, bounds) : "overall";
        if (asksAttendance) {
          const percentage = report?.stats?.attendancePercentage ?? stats.overallAttendancePercentage;
          return replyWithSavedConversation(req, res, question, `${name}'s attendance for ${periodLabel} was ${percentage}%.`);
        }
        if (asksHours) {
          const hours = report?.stats?.totalWorkingHours ?? stats.totalWorkingHours;
          return replyWithSavedConversation(req, res, question, `${name} worked ${formatHours(hours)} hours ${periodLabel === "overall" ? "overall" : `during ${periodLabel}`}.`);
        }
        if (asksOvertime) {
          const hours = report?.stats?.overtimeHours ?? stats.totalOvertimeHours;
          return replyWithSavedConversation(req, res, question, `${name}'s overtime was ${formatHours(hours)} hours ${periodLabel === "overall" ? "overall" : `during ${periodLabel}`}.`);
        }
        const productivity = report?.stats?.productivity ?? stats.overallProductivity;
        return replyWithSavedConversation(req, res, question, `${name}'s productivity score for ${periodLabel} was ${productivity}%.`);
      }
    }

    if (/(overtime|attendance|working hours?|productivity)/.test(lowerQuestion)) {
      return replyWithSavedConversation(req, res, question, "I couldn't identify that employee. Please use their full name or registered email address.");
    }

    return replyWithSavedConversation(req, res, question, "I can answer employee counts; attendance by date, range, or overall; late and absent employee lists; an employee's working hours, overtime, attendance, or productivity; leave request counts and details; calendar events; and the next one or two holidays. Use an employee's registered email or name for individual stats, and include a date or range when you want a specific period.");
  } catch (error) {
    console.error("Admin WiseBot error:", error);
    return res.status(500).json({ success: false, message: "Unable to process the Admin WiseBot request." });
  }
};

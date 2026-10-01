import { attendanceModel } from "../../models/Attendance.model.js";
import { AdminAIConversation } from "../../models/AdminAIConversation.model.js";
import { calendarModel } from "../../models/Calendar.model.js";
import { leaveModel } from "../../models/Leave.model.js";
import { holidayModel } from "../../models/Holidays.model.js";
import { userModel } from "../../models/User.model.js";
import { getAttendanceStats } from "../../services/attendanceStats.service.js";
import { getEmployeeReport } from "../../services/reports.service.js";
import { getIndiaDateKey, getTodayRange, getWeekRange } from "../../utils/attendanceHelper.js";

const employeeName = (employee) =>
  `${employee?.firstName || ""} ${employee?.lastName || ""}`.trim() ||
  String(employee?.name || "").trim();

const startAndEndOfToday = () => {
  const { startOfDay, endOfDay } = getTodayRange();
  return { start: startOfDay, end: endOfDay };
};

const startAndEndOfWeek = () => {
  const { weekStart, weekEnd } = getWeekRange();
  return { start: weekStart, end: weekEnd };
};

const shiftRange = (range, days) => ({
  start: new Date(range.start.getTime() + days * 24 * 60 * 60 * 1000),
  end: new Date(range.end.getTime() + days * 24 * 60 * 60 * 1000),
});

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

const resolveAttendancePeriod = (question) => {
  const datePattern = String.raw`(?:\d{4}-\d{1,2}-\d{1,2}|\d{1,2}[/-]\d{1,2}(?:[/-]\d{4})?|\d{1,2}\s+[a-z]{3,9}(?:\s+\d{4})?|[a-z]{3,9}\s+\d{1,2},?(?:\s+\d{4})?)`;
  const rangeMatch = question.match(new RegExp(`(?:\\b(?:from|between)\\s+)?(${datePattern})\\s+(?:to|through|until|and|[-–])\\s+(${datePattern})\\b`, "i"));
  if (rangeMatch) {
    const from = dateKeyFromText(rangeMatch[1]);
    const to = dateKeyFromText(rangeMatch[2]);
    if (from && to && from <= to) return { range: "custom", from, to };
    return null;
  }

  const dateMatch = question.match(new RegExp(`\\b(?:on|for|dated?)\\s+(${datePattern})\\b`, "i")) ||
    question.match(new RegExp(`(${datePattern})`, "i"));
  if (dateMatch) {
    const date = dateKeyFromText(dateMatch[1]);
    if (date) return { range: "custom", from: date, to: date };
  }

  if (/\blast\s+month\b/.test(question)) return { range: "lastmonth" };
  if (/\b(this|current)\s+year\b/.test(question)) return { range: "year" };
  if (/\b(this|current)\s+week\b/.test(question)) return { range: "week" };
  if (/\b(this|current)\s+month\b/.test(question)) return { range: "month" };
  if (/\b(last|past)\s+7\s+days\b/.test(question)) {
    const to = getIndiaDateKey();
    return { range: "custom", from: shiftDateKey(to, -6), to };
  }
  if (/\byesterday\b/.test(question)) {
    const date = shiftDateKey(getIndiaDateKey(), -1);
    return { range: "custom", from: date, to: date };
  }
  if (/\btoday\b/.test(question)) {
    const date = getIndiaDateKey();
    return { range: "custom", from: date, to: date };
  }
  return null;
};

const formatDateKey = (dateKey) => new Date(`${dateKey}T12:00:00Z`).toLocaleDateString("en-IN", {
  timeZone: "Asia/Kolkata",
  day: "numeric",
  month: "long",
  year: "numeric",
});

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
      .select("firstName lastName name email department designation")
      .lean();
    const employeeIds = employees.map((employee) => employee._id);
    const employee = resolveEmployee(employees, question);

    const asksAboutLateEmployees = hasWordWithCommonTypos(lowerQuestion, "late");
    const asksAboutToday = hasWordWithCommonTypos(lowerQuestion, "today");
    const asksAboutTomorrow = /\btom+or+ow\b/.test(lowerQuestion);

    if (asksAboutLateEmployees && asksAboutTomorrow) {
      return replyWithSavedConversation(req, res, question, "Late-attendance data for tomorrow is not available yet. Please ask for today or for a completed attendance date.");
    }

    if (asksAboutLateEmployees && asksAboutToday) {
      const { start, end } = startAndEndOfToday();
      const lateRecords = await attendanceModel
        .find({ user: { $in: employeeIds }, date: { $gte: start, $lte: end }, status: "Late" })
        .populate("user", "firstName lastName")
        .lean();
      const names = lateRecords.map((record) => employeeName(record.user)).filter(Boolean);
      const answer = names.length ? `Late today: ${names.join(", ")}.` : "Good news — everyone was on time today. No employees were marked late.";
      return replyWithSavedConversation(req, res, question, answer);
    }

    if (!employee && asksAboutToday && /(attendance|\bpresent(?:ed)?\b|\babsent\b|check.?in)/.test(lowerQuestion)) {
      const { start, end } = startAndEndOfToday();
      const records = await attendanceModel
        .find({ user: { $in: employeeIds }, date: { $gte: start, $lte: end } })
        .select("status checkInTime user")
        .populate("user", "firstName lastName")
        .lean();
      const presentRecords = records.filter((record) =>
        record.checkInTime && ["Present", "Late", "Half Day"].includes(record.status),
      );
      const absentRecords = records.filter((record) => record.status === "Absent");
      const asksForNames = /\b(who|names?|list|which)\b/.test(lowerQuestion);
      const asksForAbsentees = /\b(absent|absence)\b/.test(lowerQuestion);
      if (asksForNames) {
        const matchingRecords = asksForAbsentees ? absentRecords : presentRecords;
        const names = matchingRecords
          .map((record) => {
            const name = employeeName(record.user);
            return name && record.status !== "Present" ? `${name} (${record.status})` : name;
          })
          .filter(Boolean);
        const groupName = asksForAbsentees ? "absent" : "present";
        const answer = names.length
          ? `Employees ${groupName} today: ${names.join(", ")}.`
          : `No employees are marked ${groupName} today.`;
        return replyWithSavedConversation(req, res, question, answer);
      }
      const present = presentRecords.length;
      const absent = absentRecords.length;
      const notRecorded = Math.max(employees.length - records.length, 0);
      const answer = /\bhow many\b/.test(lowerQuestion) && asksForAbsentees
        ? `${absent} employees are marked absent today.`
        : /\bhow many\b/.test(lowerQuestion) && /\bpresent(?:ed)?\b/.test(lowerQuestion)
          ? `${present} employees are present today.`
          : `Today's attendance: ${present} of ${employees.length} employees have checked in, ${absent} are marked absent, and ${notRecorded} have no attendance record yet.`;
      return replyWithSavedConversation(req, res, question, answer);
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
      const today = startAndEndOfToday();
      const range = lowerQuestion.includes("week")
        ? startAndEndOfWeek()
        : lowerQuestion.includes("today")
          ? today
          : null;
      const leaveQuery = {
        user: { $in: employeeIds },
        endDate: { $gte: range?.start || today.start },
      };
      if (range) {
        leaveQuery.startDate = { $lte: range.end };
        leaveQuery.endDate = { $gte: range.start };
      }
      if (lowerQuestion.includes("pending")) leaveQuery.status = "Pending";
      else if (lowerQuestion.includes("approved")) leaveQuery.status = "Approved";
      else if (lowerQuestion.includes("rejected")) leaveQuery.status = "Rejected";
      else if (lowerQuestion.includes("cancelled") || lowerQuestion.includes("canceled")) leaveQuery.status = "Cancelled";
      const leaves = await leaveModel
        .find(leaveQuery)
        .populate("user", "firstName lastName")
        .sort({ startDate: 1 })
        .limit(20)
        .lean();
      const answer = leaves.length
        ? leaves.map((leave) => `${employeeName(leave.user)} — ${leave.leaveType} leave (${leave.status})`).join("; ")
        : "No matching leave requests were found.";
      return replyWithSavedConversation(req, res, question, answer);
    }

    if (lowerQuestion.includes("meeting") || lowerQuestion.includes("calendar") || lowerQuestion.includes("event") || lowerQuestion.includes("schedule")) {
      let range = startAndEndOfToday();
      if (lowerQuestion.includes("next week")) {
        range = shiftRange(startAndEndOfWeek(), 7);
      } else if (lowerQuestion.includes("week")) {
        range = startAndEndOfWeek();
      } else if (lowerQuestion.includes("tomorrow")) {
        range = shiftRange(range, 1);
      } else if (lowerQuestion.includes("upcoming") || lowerQuestion.includes("next")) {
        range = startAndEndOfNextDays(30);
      }
      const events = await calendarModel
        .find({ isActive: true, createdBy: req.admin.adminID, createdByModel: "Admin", date: { $gte: range.start, $lte: range.end } })
        .sort({ date: 1, startTime: 1 })
        .limit(20)
        .lean();
      const answer = events.length
        ? events.map((event) => `${event.title} on ${new Date(event.date).toLocaleDateString("en-IN")}${event.startTime ? ` at ${event.startTime}` : ""}`).join("; ")
        : "No calendar events were found for that period.";
      return replyWithSavedConversation(req, res, question, answer);
    }

    if (employee) {
      const name = employeeName(employee);
      if (lowerQuestion.includes("attendance")) {
        const period = resolveAttendancePeriod(lowerQuestion);
        if (period) {
          const report = await getEmployeeReport(employee._id, period);
          const { startDate, endDate } = report.range;
          const periodLabel = startDate === endDate
            ? `on ${formatDateKey(startDate)}`
            : `from ${formatDateKey(startDate)} to ${formatDateKey(endDate)}`;
          return replyWithSavedConversation(
            req,
            res,
            question,
            `${name}'s attendance ${periodLabel} was ${report.stats.attendancePercentage}%.`,
          );
        }

        const stats = await getAttendanceStats(employee._id);
        return replyWithSavedConversation(
          req,
          res,
          question,
          `${name}'s overall attendance is ${stats.overallAttendancePercentage}%.`,
        );
      }

      const stats = await getAttendanceStats(employee._id);
      if (lowerQuestion.includes("working hour")) {
        return replyWithSavedConversation(req, res, question, `${name}'s working hours are ${formatHours(stats.weeklyHours)} this week and ${formatHours(stats.monthlyHours)} this month.`);
      }
      if (lowerQuestion.includes("overtime")) {
        return replyWithSavedConversation(req, res, question, `${name}'s overtime is ${formatHours(stats.overtimeHours)} hours this month and ${formatHours(stats.totalOvertimeHours)} hours in total.`);
      }
      if (lowerQuestion.includes("productivity")) {
        return replyWithSavedConversation(req, res, question, `${name}'s productivity score is ${stats.productivity}%.`);
      }
    }

    if (/(overtime|attendance|working hours?|productivity)/.test(lowerQuestion)) {
      return replyWithSavedConversation(req, res, question, "I couldn't identify that employee. Please use their full name or registered email address.");
    }

    return replyWithSavedConversation(req, res, question, "I can help with employee counts, today's attendance and late check-ins, an employee's working hours, overtime or productivity, leave requests, calendar events, and the next one or two holidays. Include an employee's name or email for individual stats.");
  } catch (error) {
    console.error("Admin WiseBot error:", error);
    return res.status(500).json({ success: false, message: "Unable to process the Admin WiseBot request." });
  }
};

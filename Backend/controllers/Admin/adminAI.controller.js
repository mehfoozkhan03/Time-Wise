import { attendanceModel } from "../../models/Attendance.model.js";
import { calendarModel } from "../../models/Calendar.model.js";
import { leaveModel } from "../../models/Leave.model.js";
import { userModel } from "../../models/User.model.js";
import { getAttendanceStats } from "../../services/attendanceStats.service.js";

const employeeName = (employee) =>
  `${employee?.firstName || ""} ${employee?.lastName || ""}`.trim();

const startAndEndOfToday = () => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date();
  end.setHours(23, 59, 59, 999);
  return { start, end };
};

const startAndEndOfWeek = () => {
  const start = new Date();
  start.setDate(start.getDate() - ((start.getDay() + 6) % 7));
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  end.setHours(23, 59, 59, 999);
  return { start, end };
};

const resolveEmployee = (employees, question) => {
  const lowerQuestion = question.toLowerCase();
  const matches = employees.filter((employee) => {
    const fullName = employeeName(employee).toLowerCase();
    const email = String(employee.email || "").toLowerCase();
    return (fullName && lowerQuestion.includes(fullName)) ||
      (email && lowerQuestion.includes(email)) ||
      (employee.firstName && lowerQuestion.split(/[^a-z0-9]+/).includes(employee.firstName.toLowerCase()));
  });

  return matches.length === 1 ? matches[0] : null;
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
    let employees = await userModel
      .find({ adminID: req.admin.adminID })
      .select("firstName lastName email department designation")
      .lean();

    // Older employee records may predate the adminID relation. Use them as a
    // fallback so an admin can still query the data already in the system.
    if (!employees.length) {
      employees = await userModel
        .find({})
        .select("firstName lastName email department designation")
        .lean();
    }
    const employeeIds = employees.map((employee) => employee._id);
    const employee = resolveEmployee(employees, question);

    if (/(stock|share price|market price|share market)/.test(lowerQuestion)) {
      return res.status(200).json({
        success: true,
        answer: "I can't provide stock prices. I can help with employees, attendance, working hours, overtime, productivity, leave requests, and calendar events.",
      });
    }

    if (lowerQuestion.includes("how many") && (lowerQuestion.includes("employee") || lowerQuestion.includes("staff"))) {
      return res.status(200).json({ success: true, answer: `There are ${employees.length} employees in your organisation.` });
    }

    const asksAboutLateEmployees = hasWordWithCommonTypos(lowerQuestion, "late");
    const asksAboutToday = hasWordWithCommonTypos(lowerQuestion, "today");
    const asksAboutTomorrow = /\btom+or+ow\b/.test(lowerQuestion);

    if (asksAboutLateEmployees && asksAboutTomorrow) {
      return res.status(200).json({
        success: true,
        answer: "Late-attendance data for tomorrow is not available yet. Please ask for today or for a completed attendance date.",
      });
    }

    if (asksAboutLateEmployees && asksAboutToday) {
      const { start, end } = startAndEndOfToday();
      const lateRecords = await attendanceModel
        .find({ user: { $in: employeeIds }, date: { $gte: start, $lte: end }, status: "Late" })
        .populate("user", "firstName lastName")
        .lean();
      const names = lateRecords.map((record) => employeeName(record.user)).filter(Boolean);
      return res.status(200).json({ success: true, answer: names.length ? `Late today: ${names.join(", ")}.` : "Good news — everyone was on time today. No employees were marked late." });
    }

    if (lowerQuestion.includes("leave")) {
      const range = lowerQuestion.includes("week") ? startAndEndOfWeek() : startAndEndOfToday();
      const leaves = await leaveModel
        .find({ user: { $in: employeeIds }, startDate: { $lte: range.end }, endDate: { $gte: range.start } })
        .populate("user", "firstName lastName")
        .sort({ startDate: 1 })
        .limit(20)
        .lean();
      const filteredLeaves = lowerQuestion.includes("pending") ? leaves.filter((leave) => leave.status === "Pending") : leaves;
      const answer = filteredLeaves.length
        ? filteredLeaves.map((leave) => `${employeeName(leave.user)} — ${leave.leaveType} leave (${leave.status})`).join("; ")
        : "No matching leave requests were found.";
      return res.status(200).json({ success: true, answer });
    }

    if (lowerQuestion.includes("meeting") || lowerQuestion.includes("calendar") || lowerQuestion.includes("event")) {
      const range = lowerQuestion.includes("week") ? startAndEndOfWeek() : startAndEndOfToday();
      const events = await calendarModel
        .find({ isActive: true, createdBy: req.admin.adminID, createdByModel: "Admin", date: { $gte: range.start, $lte: range.end } })
        .sort({ date: 1, startTime: 1 })
        .limit(20)
        .lean();
      const answer = events.length
        ? events.map((event) => `${event.title} on ${new Date(event.date).toLocaleDateString("en-IN")}${event.startTime ? ` at ${event.startTime}` : ""}`).join("; ")
        : "No calendar events were found for that period.";
      return res.status(200).json({ success: true, answer });
    }

    if (employee) {
      const stats = await getAttendanceStats(employee._id);
      const name = employeeName(employee);
      if (lowerQuestion.includes("working hour")) {
        return res.status(200).json({ success: true, answer: `${name}'s working hours are ${stats.weeklyHours} this week and ${stats.monthlyHours} this month.` });
      }
      if (lowerQuestion.includes("overtime")) {
        return res.status(200).json({ success: true, answer: `${name}'s overtime is ${stats.overtimeHours} hours this month and ${stats.totalOvertimeHours} hours in total.` });
      }
      if (lowerQuestion.includes("attendance")) {
        return res.status(200).json({ success: true, answer: `${name}'s attendance is ${stats.attendancePercentage}% this month.` });
      }
      if (lowerQuestion.includes("productivity")) {
        return res.status(200).json({ success: true, answer: `${name}'s productivity score is ${stats.productivity}%.` });
      }
    }

    if (/(overtime|attendance|working hours?|productivity)/.test(lowerQuestion)) {
      return res.status(200).json({
        success: true,
        answer: "I couldn't identify that employee. Please use their full name or registered email address.",
      });
    }

    return res.status(200).json({
      success: true,
      answer: "I can help with employee attendance, working hours, overtime, productivity, late employees today, leave requests, calendar events, and the total employee count. Include an employee's name or email for an individual question.",
    });
  } catch (error) {
    console.error("Admin WiseBot error:", error);
    return res.status(500).json({ success: false, message: "Unable to process the Admin WiseBot request." });
  }
};

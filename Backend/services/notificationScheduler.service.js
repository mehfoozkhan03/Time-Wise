import { userModel } from "../models/User.model.js";
import { attendanceModel } from "../models/Attendance.model.js";
import { holidayModel } from "../models/Holidays.model.js";
import { leaveModel } from "../models/Leave.model.js";
import { leaveBalanceModel } from "../models/LeaveBalance.model.js";
import { notificationModel } from "../models/Notification.model.js";
import { attendanceConfig } from "../config/attendanceConfig.js";
import {
  mergeNotificationPreferences,
  isWithinQuietHours,
  isMutedForWeekend,
} from "../config/notificationPreferences.js";
import { createNotification } from "./notification.service.js";
import {
  hasNotificationEmailConfiguration,
  sendNotificationEmail,
} from "./notificationEmail.service.js";
import { getIndiaDateKey, getIndiaWeekday, getTodayRange, timeStringToMinutes } from "../utils/attendanceHelper.js";

const minuteOfDay = (date) => {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit", hourCycle: "h23",
  }).formatToParts(date);
  return Number(parts.find((part) => part.type === "hour")?.value) * 60
    + Number(parts.find((part) => part.type === "minute")?.value);
};

const startOfIndiaDay = (date) => {
  const [year, month, day] = getIndiaDateKey(date).split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day, -5, -30));
};

const addDays = (date, days) => {
  const result = startOfIndiaDay(date);
  result.setUTCDate(result.getUTCDate() + days);
  return result;
};

const displayDate = (date) => new Intl.DateTimeFormat("en-IN", {
  timeZone: "Asia/Kolkata", day: "numeric", month: "long", year: "numeric",
}).format(date);

const indiaMonthDay = (date) => {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata", month: "2-digit", day: "2-digit",
  }).formatToParts(date);
  return `${parts.find((item) => item.type === "month")?.value}-${parts.find((item) => item.type === "day")?.value}`;
};

const getBirthdayMonthDay = (dob) => {
  const value = String(dob || "");
  const iso = value.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})$/);
  if (iso) return `${iso[2].padStart(2, "0")}-${iso[3].padStart(2, "0")}`;
  const local = value.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/);
  return local ? `${local[2].padStart(2, "0")}-${local[1].padStart(2, "0")}` : null;
};

const workSecondsSoFar = (attendance, now) => {
  if (!attendance?.checkInTime) return 0;
  const elapsed = Math.max(0, (now - new Date(attendance.checkInTime)) / 1000);
  const breaks = (attendance.breaks || []).reduce((sum, item) => {
    if (!item.breakStart) return sum;
    const duration = item.breakEnd
      ? (new Date(item.breakEnd) - new Date(item.breakStart)) / 1000
      : (now - new Date(item.breakStart)) / 1000;
    return sum + Math.max(0, duration);
  }, 0);
  return Math.max(0, elapsed - breaks);
};

const createEmployeeNotice = (employee, input) => createNotification({
  sender: employee.adminID || employee._id,
  senderModel: employee.adminID ? "Admin" : "User",
  audienceType: "specific",
  targetUsers: [employee._id],
  allowSelf: true,
  ...input,
});

const runAttendanceReminders = async (employees, now, todayStart, todayEnd, todayKey) => {
  const weekday = getIndiaWeekday(now);
  if (!attendanceConfig.workingDays.includes(weekday)) return;
  const [attendanceRecords, holidays, approvedLeaves] = await Promise.all([
    attendanceModel.find({ date: { $gte: todayStart, $lte: todayEnd } }).select("user checkInTime checkOutTime breaks").lean(),
    holidayModel.find({ date: { $gte: todayStart, $lte: todayEnd }, isActive: true }).select("createdBy type").lean(),
    leaveModel.find({ status: "Approved", startDate: { $lte: todayEnd }, endDate: { $gte: todayStart } }).select("user").lean(),
  ]);
  const attendanceByUser = new Map(attendanceRecords.map((record) => [record.user.toString(), record]));
  const leaveUsers = new Set(approvedLeaves.map((leave) => leave.user.toString()));
  const blockingHolidayAdmins = new Set(holidays
    .filter((holiday) => ["HOLIDAY", "GOVERNMENT_HOLIDAY", "COMPANY_HOLIDAY", "FESTIVAL"].includes(holiday.type))
    .map((holiday) => holiday.createdBy.toString()));
  const currentMinute = minuteOfDay(now);
  const checkInMinute = timeStringToMinutes(attendanceConfig.officeStart);
  const officeEndMinute = timeStringToMinutes(attendanceConfig.officeEnd);

  for (const employee of employees) {
    const id = employee._id.toString();
    const preferences = mergeNotificationPreferences(employee.notificationPreferences);
    if (leaveUsers.has(id) || (employee.adminID && blockingHolidayAdmins.has(employee.adminID.toString()))) continue;
    const attendance = attendanceByUser.get(id);
    const dayKey = `${todayKey}:${id}`;

    const leadMinutes = Number.parseInt(preferences.checkInLeadTime, 10) || 10;
    if (preferences.checkInReminder && !attendance?.checkInTime && currentMinute === checkInMinute - leadMinutes) {
      await createEmployeeNotice(employee, {
        title: "Upcoming shift reminder",
        message: `Your workday starts at ${attendanceConfig.officeStart}. This is your ${leadMinutes}-minute reminder to check in.`,
        type: "attendance",
        preferenceKey: "checkInReminder",
        deduplicationKey: `check-in:${dayKey}`,
        critical: false,
      });
    }

    if (!attendance?.checkInTime || attendance.checkOutTime) continue;
    const workSeconds = workSecondsSoFar(attendance, now);
    const currentBreak = [...(attendance.breaks || [])].reverse().find((item) => item.breakStart && !item.breakEnd);
    if (preferences.breakTimeAlerts && currentBreak) {
      const breakMinutes = (now - new Date(currentBreak.breakStart)) / 60000;
      if (breakMinutes >= attendanceConfig.maxBreakMinutes) {
        await createEmployeeNotice(employee, {
          title: "Break time limit reached",
          message: `Your current break has reached ${attendanceConfig.maxBreakMinutes} minutes. Please return to work or update your attendance if needed.`,
          type: "attendance",
          preferenceKey: "breakTimeAlerts",
          deduplicationKey: `break-limit:${dayKey}`,
        });
      }
    }
    if (preferences.overtimeAlerts && workSeconds >= attendanceConfig.requiredDailyHours * 3600) {
      await createEmployeeNotice(employee, {
        title: "Daily work-hour target reached",
        message: `You have reached ${attendanceConfig.requiredDailyHours} working hours today. Additional time may count as overtime under your company policy.`,
        type: "attendance",
        preferenceKey: "overtimeAlerts",
        deduplicationKey: `overtime-target:${dayKey}`,
      });
    }
    if (preferences.checkOutReminder && (workSeconds >= attendanceConfig.requiredDailyHours * 3600 || currentMinute >= officeEndMinute)) {
      await createEmployeeNotice(employee, {
        title: "Check-out reminder",
        message: workSeconds >= attendanceConfig.requiredDailyHours * 3600
          ? "Your daily working-hours target has been reached. Please check out when you finish."
          : `Your scheduled workday ends at ${attendanceConfig.officeEnd}. Please check out when you finish.`,
        type: "attendance",
        preferenceKey: "checkOutReminder",
        deduplicationKey: `check-out-reminder:${dayKey}`,
      });
    }
  }
};

const runHolidayReminders = async (now, employees) => {
  const reminderDate = addDays(now, 2);
  const start = reminderDate;
  const end = new Date(start.getTime() + 24 * 60 * 60 * 1000 - 1);
  const holidays = await holidayModel.find({ date: { $gte: start, $lte: end }, isActive: true }).lean();
  for (const holiday of holidays) {
    const companyEmployees = employees.filter((employee) =>
      !holiday.createdBy || employee.adminID?.toString() === holiday.createdBy.toString(),
    );
    for (const employee of companyEmployees) {
      await createEmployeeNotice(employee, {
        title: `Upcoming holiday: ${holiday.title}`,
        message: `${holiday.title} is coming up on ${displayDate(holiday.date)}.`,
        type: "system",
        preferenceKey: "holidayReminders",
        deduplicationKey: `holiday:${holiday._id}:${employee._id}`,
      });
    }
  }
};

const runBirthdayAndMonthlyNotices = async (employees, now) => {
  const currentMinute = minuteOfDay(now);
  if (currentMinute !== 9 * 60) return;
  const [year, month, day] = getIndiaDateKey(now).split("-").map(Number);
  const todayMonthDay = indiaMonthDay(now);
  const birthdayEmployees = employees.filter((employee) => getBirthdayMonthDay(employee.dob) === todayMonthDay);

  for (const birthdayEmployee of birthdayEmployees) {
    const birthdayName = `${birthdayEmployee.firstName} ${birthdayEmployee.lastName}`.trim();
    const teammates = employees.filter((employee) =>
      employee._id.toString() !== birthdayEmployee._id.toString()
      && employee.adminID?.toString() === birthdayEmployee.adminID?.toString(),
    );
    for (const teammate of teammates) {
      if (!mergeNotificationPreferences(teammate.notificationPreferences).birthdayCelebrations) continue;
      await createEmployeeNotice(teammate, {
        title: "Team birthday today",
        message: `Today is ${birthdayName}'s birthday. Send them your best wishes!`,
        type: "system",
        preferenceKey: "birthdayCelebrations",
        deduplicationKey: `birthday:${year}:${birthdayEmployee._id}:${teammate._id}`,
      });
    }
  }

  const workAnniversaryEmployees = employees.filter((employee) => {
    if (!employee.createdAt || indiaMonthDay(employee.createdAt) !== todayMonthDay) return false;
    const joinedYear = Number(new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Kolkata", year: "numeric",
    }).format(employee.createdAt));
    return year - joinedYear >= 1;
  });
  for (const anniversaryEmployee of workAnniversaryEmployees) {
    const years = year - Number(new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Kolkata", year: "numeric",
    }).format(anniversaryEmployee.createdAt));
    const employeeName = `${anniversaryEmployee.firstName} ${anniversaryEmployee.lastName}`.trim();
    const teammates = employees.filter((employee) =>
      employee._id.toString() !== anniversaryEmployee._id.toString()
      && employee.adminID?.toString() === anniversaryEmployee.adminID?.toString(),
    );
    for (const teammate of teammates) {
      if (!mergeNotificationPreferences(teammate.notificationPreferences).birthdayCelebrations) continue;
      await createEmployeeNotice(teammate, {
        title: "Work anniversary today",
        message: `Today marks ${years} year${years === 1 ? "" : "s"} since ${employeeName} joined TimeWise. Congratulate them!`,
        type: "system",
        preferenceKey: "birthdayCelebrations",
        deduplicationKey: `anniversary:${year}:${anniversaryEmployee._id}:${teammate._id}`,
      });
    }
  }

  for (const employee of employees) {
    const preferences = mergeNotificationPreferences(employee.notificationPreferences);
    if (day === 1 && preferences.quotaUpdates) {
      const balance = await leaveBalanceModel.findOne({ user: employee._id }).lean();
      if (balance) {
        const detail = ["annual", "sick", "casual"].map((key) => {
          const category = balance[key] || { total: 0, used: 0 };
          return `${key}: ${Math.max(0, category.total - category.used)} day(s)`;
        }).join(", ");
        await createEmployeeNotice(employee, {
          title: "Monthly leave balance",
          message: `Your available leave balance is ${detail}.`,
          type: "leave",
          preferenceKey: "quotaUpdates",
          deduplicationKey: `leave-quota:${year}-${month}:${employee._id}`,
        });
      }
    }

    if (day === 1 && preferences.monthlyTimesheet) {
      const previousMonthStart = new Date(Date.UTC(year, month - 2, 1, -5, -30));
      const currentMonthStart = new Date(Date.UTC(year, month - 1, 1, -5, -30));
      const previousMonthEnd = new Date(currentMonthStart.getTime() - 1);
      const periodKey = getIndiaDateKey(previousMonthStart).slice(0, 7);
      const records = await attendanceModel.find({ user: employee._id, date: { $gte: previousMonthStart, $lte: previousMonthEnd } })
        .select("status totalWorkingSeconds").lean();
      const hours = records.reduce((sum, record) => sum + (Number(record.totalWorkingSeconds) || 0), 0) / 3600;
      const attended = records.filter((record) => ["Present", "Late", "Half Day"].includes(record.status)).length;
      const periodName = new Intl.DateTimeFormat("en-IN", {
        timeZone: "Asia/Kolkata", month: "long", year: "numeric",
      }).format(previousMonthStart);
      await createEmployeeNotice(employee, {
        title: "Monthly timesheet is ready",
        message: `Your ${periodName} summary: ${attended} attendance days and ${hours.toFixed(2)} working hours. Open Reports for the full breakdown.`,
        type: "attendance",
        preferenceKey: "monthlyTimesheet",
        deduplicationKey: `monthly-timesheet:${periodKey}:${employee._id}`,
      });
    }
  }
};

const sendEmailDigests = async (employees, now) => {
  if (!hasNotificationEmailConfiguration()) return;
  const minute = minuteOfDay(now);
  if (minute < 9 * 60) return;
  const weekday = getIndiaWeekday(now);
  const todayKey = getIndiaDateKey(now);
  for (const employee of employees) {
    const preferences = mergeNotificationPreferences(employee.notificationPreferences);
    if (!preferences.emailNotifications || preferences.emailFrequency === "instant") continue;
    if (preferences.emailFrequency === "weekly" && weekday !== 1) continue;
    if (employee.notificationDigestLastSentAt && getIndiaDateKey(employee.notificationDigestLastSentAt) === todayKey) continue;
    if (preferences.quietMode || isWithinQuietHours(preferences, now) || isMutedForWeekend(preferences, now)) continue;
    const lastSent = employee.notificationDigestLastSentAt
      || new Date(now.getTime() - (preferences.emailFrequency === "weekly" ? 7 : 1) * 24 * 60 * 60 * 1000);
    const notifications = await notificationModel.find({
      targetUsers: employee._id,
      isArchived: false,
      $or: [
        { createdAt: { $gt: lastSent, $lte: now } },
        { _id: { $in: employee.pendingNotificationEmails || [] } },
      ],
    }).sort({ createdAt: -1 }).select("title message createdAt preferenceKey").lean();
    const allowedNotifications = notifications.filter((item) =>
      !item.preferenceKey || preferences[item.preferenceKey] !== false,
    );
    if (allowedNotifications.length === 0) {
      employee.notificationDigestLastSentAt = now;
      employee.pendingNotificationEmails = [];
      await employee.save();
      continue;
    }
    const message = allowedNotifications.map((item) => `• ${item.title}: ${item.message}`).join("\n\n");
    try {
      const delivered = await sendNotificationEmail({
        recipient: employee,
        title: preferences.emailFrequency === "weekly" ? "Your TimeWise weekly summary" : "Your TimeWise daily digest",
        message,
        appUrl: process.env.FRONTEND_URL || "http://localhost:5173",
      });
      if (delivered) {
        employee.notificationDigestLastSentAt = now;
        employee.pendingNotificationEmails = [];
        await employee.save();
      }
    } catch (error) {
      console.error(`Notification digest failed for ${employee.email}:`, error.message);
    }
  }
};

const flushPendingInstantEmails = async (now) => {
  if (!hasNotificationEmailConfiguration()) return;
  const users = await userModel.find({ pendingNotificationEmails: { $exists: true, $ne: [] } })
    .select("_id email firstName lastName notificationPreferences pendingNotificationEmails");
  for (const employee of users) {
    const preferences = mergeNotificationPreferences(employee.notificationPreferences);
    const quiet = preferences.quietMode || isWithinQuietHours(preferences, now) || isMutedForWeekend(preferences, now);
    if (quiet) continue;
    for (const notificationId of employee.pendingNotificationEmails) {
      const notification = await notificationModel.findById(notificationId).select("title message preferenceKey critical").lean();
      if (!notification || !preferences.emailNotifications || preferences.emailFrequency !== "instant" ||
        (notification.preferenceKey && preferences[notification.preferenceKey] === false)) {
        await userModel.updateOne({ _id: employee._id }, { $pull: { pendingNotificationEmails: notificationId } });
        continue;
      }
      try {
        const delivered = await sendNotificationEmail({
          recipient: employee,
          title: notification.title,
          message: notification.message,
          appUrl: process.env.FRONTEND_URL || "http://localhost:5173",
        });
        if (delivered) {
          await userModel.updateOne({ _id: employee._id }, { $pull: { pendingNotificationEmails: notificationId } });
        }
      } catch (error) {
        console.error(`Pending notification email failed for ${employee.email}:`, error.message);
      }
    }
  }
};

let schedulerTimer;
let isRunning = false;
let lastDailyScheduleDate = "";

export const runNotificationScheduler = async (now = new Date()) => {
  if (isRunning) return;
  isRunning = true;
  try {
    const { startOfDay, endOfDay } = getTodayRange(now);
    const employees = await userModel.find({ role: { $ne: "Admin" } })
      .select("_id adminID firstName lastName email dob createdAt notificationPreferences notificationDigestLastSentAt")
      .lean();
    await runAttendanceReminders(employees, now, startOfDay, endOfDay, getIndiaDateKey(now));
    const todayKey = getIndiaDateKey(now);
    if (minuteOfDay(now) >= 9 * 60 && lastDailyScheduleDate !== todayKey) {
      await runHolidayReminders(now, employees);
      await runBirthdayAndMonthlyNotices(employees, now);
      lastDailyScheduleDate = todayKey;
    }
    await flushPendingInstantEmails(now);
    if (minuteOfDay(now) >= 9 * 60 && hasNotificationEmailConfiguration()) {
      const digestPreferenceQuery = [
        { "notificationPreferences.emailFrequency": "daily" },
        ...(getIndiaWeekday(now) === 1 ? [{ "notificationPreferences.emailFrequency": "weekly" }] : []),
      ];
      const digestUsers = await userModel.find({
        role: { $ne: "Admin" },
        "notificationPreferences.emailNotifications": { $ne: false },
        $and: [
          { $or: digestPreferenceQuery },
          {
            $or: [
              { notificationDigestLastSentAt: null },
              { notificationDigestLastSentAt: { $lt: startOfIndiaDay(now) } },
            ],
          },
        ],
      }).select("_id adminID firstName lastName email notificationPreferences notificationDigestLastSentAt pendingNotificationEmails");
      await sendEmailDigests(digestUsers, now);
    }
  } catch (error) {
    console.error("Notification scheduler failed:", error);
  } finally {
    isRunning = false;
  }
};

export const startNotificationScheduler = () => {
  if (schedulerTimer) return;
  schedulerTimer = setInterval(() => runNotificationScheduler(), 60_000);
  runNotificationScheduler();
};

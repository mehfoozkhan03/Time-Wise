export const DEFAULT_NOTIFICATION_PREFERENCES = Object.freeze({
  quietMode: false,
  emailNotifications: true,
  emailFrequency: "instant",
  pushNotifications: true,
  soundAlerts: true,
  inAppAlerts: true,
  inAppBadge: true,
  checkInReminder: true,
  checkInLeadTime: "10m",
  checkOutReminder: true,
  breakTimeAlerts: true,
  overtimeAlerts: true,
  leaveStatusUpdates: true,
  holidayReminders: true,
  quotaUpdates: false,
  companyAnnouncements: true,
  dailyThoughts: true,
  birthdayCelebrations: true,
  securityLogins: true,
  profileChanges: true,
  monthlyTimesheet: true,
  quietHoursEnabled: true,
  quietHoursStart: "22:00",
  quietHoursEnd: "08:00",
  muteWeekends: true,
});

const booleanPreferenceKeys = Object.keys(DEFAULT_NOTIFICATION_PREFERENCES).filter(
  (key) => typeof DEFAULT_NOTIFICATION_PREFERENCES[key] === "boolean",
);

const enumPreferences = {
  emailFrequency: ["instant", "daily", "weekly"],
  checkInLeadTime: ["5m", "10m", "15m"],
  quietHoursStart: ["20:00", "21:00", "22:00", "23:00", "00:00"],
  quietHoursEnd: ["06:00", "07:00", "08:00", "09:00", "10:00"],
};

export const mergeNotificationPreferences = (value = {}) => ({
  ...DEFAULT_NOTIFICATION_PREFERENCES,
  ...(value && typeof value === "object" ? value : {}),
});

export const sanitizeNotificationPreferences = (value = {}) => {
  const sanitized = {};
  for (const key of booleanPreferenceKeys) {
    if (typeof value[key] === "boolean") sanitized[key] = value[key];
  }
  for (const [key, values] of Object.entries(enumPreferences)) {
    if (values.includes(value[key])) sanitized[key] = value[key];
  }
  return sanitized;
};

export const isWithinQuietHours = (preferences, date = new Date()) => {
  if (!preferences.quietHoursEnabled) return false;
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const now = Number(parts.find((part) => part.type === "hour")?.value) * 60
    + Number(parts.find((part) => part.type === "minute")?.value);
  const [startHour, startMinute] = preferences.quietHoursStart.split(":").map(Number);
  const [endHour, endMinute] = preferences.quietHoursEnd.split(":").map(Number);
  const start = startHour * 60 + startMinute;
  const end = endHour * 60 + endMinute;
  return start === end || (start < end ? now >= start && now < end : now >= start || now < end);
};

export const isMutedForWeekend = (preferences, date = new Date()) => {
  if (!preferences.muteWeekends) return false;
  const weekday = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Kolkata",
    weekday: "short",
  }).format(date);
  return weekday === "Sat" || weekday === "Sun";
};


const STORAGE_KEY = "timewise_notification_preferences";

export const DEFAULT_NOTIFICATION_PREFERENCES = {
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
};

export const getCachedNotificationPreferences = (userId) => {
  try {
    const key = userId ? `${STORAGE_KEY}_${userId}` : null;
    const raw = key && localStorage.getItem(key);
    return {
      ...DEFAULT_NOTIFICATION_PREFERENCES,
      ...(raw ? JSON.parse(raw) : {}),
    };
  } catch {
    return DEFAULT_NOTIFICATION_PREFERENCES;
  }
};

export const cacheNotificationPreferences = (userId, preferences) => {
  if (!userId) return;
  try {
    localStorage.setItem(`${STORAGE_KEY}_${userId}`, JSON.stringify(preferences));
  } catch (error) {
    console.warn("Could not cache notification preferences in this browser:", error);
  }
  window.dispatchEvent(new CustomEvent("notification-preferences-updated", {
    detail: { userId, preferences },
  }));
};

export const isNotificationQuietNow = (preferences, now = new Date()) => {
  const weekday = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Kolkata",
    weekday: "short",
  }).format(now);
  if (preferences.muteWeekends && ["Sat", "Sun"].includes(weekday)) return true;

  if (!preferences.quietHoursEnabled) return false;
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);
  const current = Number(parts.find((part) => part.type === "hour")?.value) * 60
    + Number(parts.find((part) => part.type === "minute")?.value);
  const [startHour, startMinute] = preferences.quietHoursStart.split(":").map(Number);
  const [endHour, endMinute] = preferences.quietHoursEnd.split(":").map(Number);
  const start = startHour * 60 + startMinute;
  const end = endHour * 60 + endMinute;
  return start === end || (start < end ? current >= start && current < end : current >= start || current < end);
};

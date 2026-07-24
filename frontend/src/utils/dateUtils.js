/* =========================================
   Format: 24 Jul 2026
========================================= */

export const formatDate = (date) => {
  if (!date) return "--";

  const parsedDate = new Date(date);

  if (isNaN(parsedDate)) return "--";

  return parsedDate.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

/* =========================================
   Format: Friday, 24 July 2026
========================================= */

export const formatFullDate = (date) => {
  if (!date) return "--";

  const parsedDate = new Date(date);

  if (isNaN(parsedDate)) return "--";

  return parsedDate.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

/* =========================================
   Format: 9:00 AM
========================================= */

export const formatTime = (time) => {
  if (!time) return "--";

  const [hour = 0, minute = 0] = time.split(":");

  return new Date(0, 0, 0, Number(hour), Number(minute)).toLocaleTimeString(
    "en-IN",
    {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    },
  );
};

/* =========================================
   Check Today
========================================= */

export const isToday = (date) => {
  if (!date) return false;

  const today = getToday();

  const current = new Date(date);

  if (isNaN(current)) return false;

  return (
    today.getFullYear() === current.getFullYear() &&
    today.getMonth() === current.getMonth() &&
    today.getDate() === current.getDate()
  );
};

/* =========================================
   Check Weekend
========================================= */

export const isWeekend = (date) => {
  if (!date) return false;

  const parsedDate = new Date(date);

  if (isNaN(parsedDate)) return false;

  const day = parsedDate.getDay();

  return day === 0 || day === 6;
};

/* =========================================
   Today's Date
========================================= */

export const getToday = () => {
  const today = new Date();

  return new Date(today.getFullYear(), today.getMonth(), today.getDate());
};

/* =========================================
   Today / Tomorrow / Date
========================================= */

export const getRelativeDateLabel = (date) => {
  if (!date) return "--";

  const today = getToday();

  const eventDate = new Date(date);

  if (isNaN(eventDate)) return "--";

  eventDate.setHours(0, 0, 0, 0);

  const diff = Math.round((eventDate - today) / (1000 * 60 * 60 * 24));

  if (diff === 0) return "Today";

  if (diff === 1) return "Tomorrow";

  return formatFullDate(date);
};

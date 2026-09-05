// ============================================================
// DETERMINISTIC RESPONSE GENERATOR (NO AI NEEDED)
// ============================================================

// ============================================================
// DATE HELPERS
// ============================================================

const DAY_LABELS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const longDate = (value) => {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const shortDate = (value) => {
  if (!value) {
    return "Unknown";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Unknown";
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

// Date without the weekday, for sentences that already
// name the day ("October 4, 2026 is a Sunday").
const plainDate = (value) => {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// ============================================================
// ONE DATE PER HOLIDAY
// ============================================================
// The holidays collection stores the same festival for many
// years. "When is Gandhi Jayanti?" must return a single date,
// not 2026 through 2035. For each repeated title keep the
// nearest upcoming occurrence, or the most recent past one if
// every occurrence has already happened.
// ============================================================

const keepOneDatePerHoliday = (data) => {
  if (!Array.isArray(data) || data.length <= 1) {
    return Array.isArray(data) ? data : [];
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const groups = new Map();

  for (const item of data) {
    const key = String(item?.title || "")
      .toLowerCase()
      .trim();

    if (!groups.has(key)) {
      groups.set(key, []);
    }

    groups.get(key).push(item);
  }

  const picked = [];

  for (const group of groups.values()) {
    if (group.length === 1) {
      picked.push(group[0]);
      continue;
    }

    const dated = group
      .map((item) => ({
        item,
        date: new Date(item?.date),
      }))
      .filter((entry) => !Number.isNaN(entry.date.getTime()));

    if (dated.length === 0) {
      picked.push(group[0]);
      continue;
    }

    const upcoming = dated
      .filter((entry) => entry.date >= today)
      .sort((a, b) => a.date - b.date);

    if (upcoming.length > 0) {
      picked.push(upcoming[0].item);
      continue;
    }

    const past = dated.sort((a, b) => b.date - a.date);

    picked.push(past[0].item);
  }

  return picked.sort((a, b) => new Date(a?.date) - new Date(b?.date));
};

// ============================================================
// DETERMINISTIC CALENDAR FORMATTING
// ============================================================

const formatCalendarAnswer = (data, entity, dateReference) => {
  if (!Array.isArray(data) || data.length === 0) {
    return "No matching information was found.";
  }

  const isHoliday = entity === "holiday" || entity === "festival";

  const filteredData = isHoliday ? keepOneDatePerHoliday(data) : data;

  if (filteredData.length === 0) {
    return "No matching information was found.";
  }

  // Single event/holiday
  if (filteredData.length === 1) {
    const item = filteredData[0];
    const title = item.title || "Unnamed event";
    const date = longDate(item.date) || "an unknown date";
    const time = item.startTime ? ` at ${item.startTime}` : "";
    const description = item.description ? ` - ${item.description}` : "";

    return `${title} is on ${date}${time}${description}.`;
  }

  // Multiple events/holidays
  const items = filteredData.map((item) => {
    const title = item.title || "Unnamed event";
    const date = shortDate(item.date);
    const time = item.startTime ? ` at ${item.startTime}` : "";
    return `${title} (${date}${time})`;
  });

  const label = isHoliday ? "holidays" : "events";

  return `You have ${filteredData.length} ${label}: ${items.join(", ")}.`;
};

// ============================================================
// WHOLE-DAY SUMMARY
// ============================================================
// "What's on 2nd October?" -> the festival on that date.
// Nothing scheduled on a Saturday/Sunday -> report the day.
// ============================================================

const formatDaySummaryAnswer = (phase4) => {
  const dayInfo = phase4?.dayInfo || null;

  const holidays = Array.isArray(phase4?.holidays) ? phase4.holidays : [];

  const events = Array.isArray(phase4?.events) ? phase4.events : [];

  const dateLabel = dayInfo?.resolvedDate
    ? longDate(dayInfo.resolvedDate)
    : null;

  const parts = [];

  if (holidays.length > 0) {
    const names = holidays.map((item) => item.title || "Unnamed holiday");

    parts.push(
      names.length === 1
        ? `${names[0]} falls on that day`
        : `these holidays fall on that day: ${names.join(", ")}`,
    );
  }

  if (events.length > 0) {
    const names = events.map((item) => {
      const title = item.title || "Unnamed event";
      const time = item.startTime ? ` at ${item.startTime}` : "";
      return `${title}${time}`;
    });

    parts.push(
      names.length === 1
        ? `you have ${names[0]}`
        : `you have ${names.length} events: ${names.join(", ")}`,
    );
  }

  // ----------------------------------------------------------
  // Nothing on that date
  // ----------------------------------------------------------

  if (parts.length === 0) {
    if (!dateLabel) {
      return "No matching information was found.";
    }

    const bareDate = plainDate(dayInfo.resolvedDate) || dateLabel;

    if (dayInfo?.isWeekend) {
      return `${bareDate} is a ${dayInfo.dayName}, so it is a weekend. There are no holidays or events scheduled.`;
    }

    return `${bareDate} is a ${dayInfo?.dayName || "working day"}. There are no holidays or events scheduled.`;
  }

  // ----------------------------------------------------------
  // Something on that date
  // ----------------------------------------------------------

  const sentence = parts.join(", and ");

  if (!dateLabel) {
    return `${sentence.charAt(0).toUpperCase()}${sentence.slice(1)}.`;
  }

  const weekendNote = dayInfo?.isWeekend
    ? " It is also a weekend."
    : "";

  return `${dateLabel} - ${sentence}.${weekendNote}`;
};

// ============================================================
// DETERMINISTIC HOURS FORMATTING
// ============================================================

const formatHoursAnswer = (value, entity, period) => {
  if (value === null || value === undefined) {
    return "No matching information was found.";
  }

  const hours = typeof value === "number" ? value : parseFloat(value);

  if (Number.isNaN(hours)) {
    return "No matching information was found.";
  }

  const formatted = hours % 1 === 0 ? hours : hours.toFixed(1);

  if (entity === "weekly_working_hours") {
    return `You have worked ${formatted} hours this week.`;
  }
  if (entity === "monthly_working_hours") {
    return `You have worked ${formatted} hours this month.`;
  }
  if (entity === "total_working_hours") {
    return `Your total working hours are ${formatted} hours.`;
  }
  if (entity === "today_working_hours") {
    return `You have worked ${formatted} hours today.`;
  }
  if (
    entity === "overtime_hours" ||
    entity === "monthly_overtime" ||
    entity === "total_overtime"
  ) {
    return `Your overtime hours are ${formatted} hours.`;
  }

  return `You have worked ${formatted} hours.`;
};

// ============================================================
// DETERMINISTIC NUMBER/PERCENTAGE FORMATTING
// ============================================================

const formatMetricAnswer = (value, entity, dataType) => {
  if (value === null || value === undefined) {
    return "No matching information was found.";
  }

  if (dataType === "percentage") {
    const formatted =
      typeof value === "number" ? value.toFixed(1) : String(value);

    if (entity === "attendance_percentage") {
      return `Your attendance is ${formatted}%.`;
    }
    if (entity === "productivity_score") {
      return `Your productivity score is ${formatted}%.`;
    }
    return `Your ${entity.replace(/_/g, " ")} is ${formatted}%.`;
  }

  if (dataType === "number") {
    if (entity === "current_streak") {
      return `Your current streak is ${value} days.`;
    }
    if (entity === "longest_streak") {
      return `Your longest streak is ${value} days.`;
    }
    if (entity === "leaves_taken") {
      return `You have taken ${value} leave${value === 1 ? "" : "s"}.`;
    }
    return `Your ${entity.replace(/_/g, " ")} is ${value}.`;
  }

  return `Your ${entity.replace(/_/g, " ")} is ${value}.`;
};

// ============================================================
// GENERATE TIMEWISE RESPONSE (NO AI - FULLY DETERMINISTIC)
// ============================================================

export const generateTimeWiseResponse = async ({
  question,
  phase2,
  phase3,
  phase4,
  phase5_5,
}) => {
  try {
    if (!phase4) {
      return {
        success: false,
        answer: "Unable to process your request.",
      };
    }

    // ========================================================
    // WHOLE-DAY LOOKUP HANDLER
    // ========================================================

    if (
      phase4?.dataType === "day_summary" ||
      phase4?.entity === "day_summary"
    ) {
      return {
        success: true,
        answer: formatDaySummaryAnswer(phase4),
      };
    }

    // ========================================================
    // CALENDAR DATA HANDLER
    // ========================================================

    if (phase4?.dataType === "event" || phase4?.dataType === "holiday") {
      const safeData = Array.isArray(phase4?.data) ? phase4.data : [];

      const answer = formatCalendarAnswer(
        safeData,
        phase4?.entity,
        phase4?.dateReference,
      );

      return {
        success: true,
        answer,
      };
    }

    // ========================================================
    // HOURS DATA HANDLER
    // ========================================================

    if (phase4?.dataType === "hours") {
      return {
        success: true,
        answer: formatHoursAnswer(phase4?.value, phase4?.entity, phase4?.period),
      };
    }

    // ========================================================
    // PERCENTAGE/NUMBER METRIC HANDLER
    // ========================================================

    if (phase4?.dataType === "percentage" || phase4?.dataType === "number") {
      return {
        success: true,
        answer: formatMetricAnswer(
          phase4?.value,
          phase4?.entity,
          phase4?.dataType,
        ),
      };
    }

    // ========================================================
    // TIME DATA HANDLER
    // ========================================================

    if (phase4?.dataType === "time") {
      const value = phase4?.value;

      if (value === null || value === undefined) {
        return {
          success: true,
          answer: "No matching information was found.",
        };
      }

      if (phase4?.entity === "average_checkin_time") {
        return {
          success: true,
          answer: `Your average check-in time is ${value}.`,
        };
      }

      return {
        success: true,
        answer: `Your ${phase4?.entity?.replace(/_/g, " ")} is ${value}.`,
      };
    }

    // ========================================================
    // FALLBACK - GENERIC RESPONSE
    // ========================================================

    return {
      success: true,
      answer: "No matching information was found.",
    };
  } catch (error) {
    console.error("Phase 5 Error:", error);

    return {
      success: false,
      answer:
        "Sorry, I encountered an error processing your request. Please try again.",
    };
  }
};

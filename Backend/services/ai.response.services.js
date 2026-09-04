// ============================================================
// DETERMINISTIC RESPONSE GENERATOR (NO AI NEEDED)
// ============================================================

// ============================================================
// FILTER HOLIDAYS TO CURRENT + NEXT YEAR ONLY
// ============================================================

const filterHolidaysByYear = (data) => {
  if (!Array.isArray(data)) {
    return data;
  }

  const now = new Date();
  const currentYear = now.getFullYear();
  const nextYear = currentYear + 1;

  return data.filter((item) => {
    if (!item?.date) {
      return false;
    }

    const itemDate = new Date(item.date);
    const itemYear = itemDate.getFullYear();

    return itemYear === currentYear || itemYear === nextYear;
  });
};

// ============================================================
// DETERMINISTIC CALENDAR FORMATTING
// ============================================================

const formatCalendarAnswer = (data, entity, dateReference) => {
  if (!Array.isArray(data) || data.length === 0) {
    return "No matching information was found.";
  }

  // Filter holidays to current + next year only
  let filteredData = data;
  if (entity === "holiday" || entity === "festival") {
    filteredData = filterHolidaysByYear(data);
  }

  if (filteredData.length === 0) {
    return "No matching information was found.";
  }

  // Single event/holiday
  if (filteredData.length === 1) {
    const item = filteredData[0];
    const title = item.title || "Unnamed event";
    const date = item.date
      ? new Date(item.date).toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "Unknown date";
    const time = item.time ? ` at ${item.time}` : "";
    const description = item.description ? ` - ${item.description}` : "";

    return `${title} is on ${date}${time}${description}.`;
  }

  // Multiple events/holidays
  const items = filteredData.map((item) => {
    const title = item.title || "Unnamed event";
    const date = item.date
      ? new Date(item.date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "Unknown";
    const time = item.time ? ` at ${item.time}` : "";
    return `${title} (${date}${time})`;
  });

  return `You have ${filteredData.length} events: ${items.join(", ")}.`;
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
      const value = phase4?.value;

      const answer = formatHoursAnswer(value, phase4?.entity, phase4?.period);

      return {
        success: true,
        answer,
      };
    }

    // ========================================================
    // PERCENTAGE/NUMBER METRIC HANDLER
    // ========================================================

    if (phase4?.dataType === "percentage" || phase4?.dataType === "number") {
      const value = phase4?.value;

      const answer = formatMetricAnswer(
        value,
        phase4?.entity,
        phase4?.dataType,
      );

      return {
        success: true,
        answer,
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

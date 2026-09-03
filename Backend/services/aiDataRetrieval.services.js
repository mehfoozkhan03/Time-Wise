// ============================================================
// SAFE VALUE CHECK
// ============================================================

const hasValue = (value) => {
  return value !== undefined && value !== null;
};

// ============================================================
// NESTED VALUE GETTER
// ============================================================

const getNestedValue = (object, path) => {
  if (!object || !path) {
    return undefined;
  }

  return path.split(".").reduce((current, key) => current?.[key], object);
};

// ============================================================
// PERIOD FIELD MAP
// ============================================================
//
// Some TimeWise contexts may store values under different
// structures. We keep this small and deterministic.
// ============================================================

const getWorkingHoursValue = (userContext, entity, period) => {
  const attendance = userContext?.attendance || {};

  // ----------------------------------------------------------
  // OVERTIME entities must read the OVERTIME fields, not the
  // working-hours fields. "total" → all-time overtime;
  // anything else (month / none) → this month's overtime.
  // ----------------------------------------------------------
  const overtimeEntities = new Set([
    "overtime_hours",
    "monthly_overtime",
    "total_overtime",
  ]);

  if (overtimeEntities.has(entity)) {
    const useTotal = entity === "total_overtime" || period === "total";

    const overtimeValue = useTotal
      ? attendance.totalOvertimeHours
      : attendance.overtimeHours;

    console.log("DEBUG overtime:", {
      entity,
      period,
      overtimeValue,
      totalOvertimeHours: attendance.totalOvertimeHours,
      overtimeHours: attendance.overtimeHours,
    });

    return {
      entity,
      period,
      value: hasValue(overtimeValue) ? overtimeValue : null,
    };
  }

  const candidates = {
    today: [
      attendance.todayHours,
      attendance.todayWorkingHours,
      userContext.todayHours,
      userContext.todayWorkingHours,
    ],

    week: [
      attendance.weeklyHours,
      attendance.weekHours,
      userContext.weeklyHours,
      userContext.weekHours,
    ],

    month: [
      attendance.monthlyHours,
      attendance.monthHours,
      userContext.monthlyHours,
      userContext.monthHours,
    ],

    total: [
      attendance.totalHours,
      attendance.totalWorkingHours,
      userContext.totalHours,
      userContext.totalWorkingHours,
    ],
  };

  const values = candidates[period] || [];

  const value = values.find(hasValue);

  return {
    entity,
    period,
    value: hasValue(value) ? value : null,
  };
};

// ============================================================
// CALENDAR DATE NORMALIZATION
// ============================================================

const normalizeDate = (value) => {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date;
};

// ============================================================
// SAME DATE
// ============================================================

const isSameDate = (first, second) => {
  const a = normalizeDate(first);

  const b = normalizeDate(second);

  if (!a || !b) {
    return false;
  }

  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
};

// ============================================================
// NATURAL DATE PARSER
// ============================================================
// Parse natural language dates like "2nd October", "Friday", "next week"
// Returns a Date object or null if parsing fails
// ============================================================

const parseNaturalDate = (dateStr) => {
  if (!dateStr || typeof dateStr !== "string") {
    return null;
  }

  const str = dateStr.toLowerCase().trim();
  const now = new Date();

  // ========================================================
  // Day of week (Friday, Saturday, etc.)
  // ========================================================

  const daysOfWeek = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];
  const dayIndex = daysOfWeek.findIndex((day) => str.includes(day));

  if (dayIndex !== -1) {
    const today = now.getDay();
    let daysToAdd = dayIndex - today;

    if (daysToAdd <= 0) {
      daysToAdd += 7;
    }

    const date = new Date(now);
    date.setDate(date.getDate() + daysToAdd);
    date.setHours(0, 0, 0, 0);
    return date;
  }

  // ========================================================
  // Specific dates: "2nd October", "October 2", "2 October", etc.
  // ========================================================

  const months = [
    "january",
    "february",
    "march",
    "april",
    "may",
    "june",
    "july",
    "august",
    "september",
    "october",
    "november",
    "december",
  ];

  for (let i = 0; i < months.length; i++) {
    if (str.includes(months[i])) {
      // Extract day number (1st, 2nd, 3rd, 4th, etc.)
      const dayMatch = str.match(/(\d{1,2})(?:st|nd|rd|th)?/);
      if (dayMatch) {
        const day = parseInt(dayMatch[1], 10);
        if (day >= 1 && day <= 31) {
          const date = new Date(now.getFullYear(), i, day);
          // If this date is in the past, use next year
          if (date < now) {
            date.setFullYear(date.getFullYear() + 1);
          }
          date.setHours(0, 0, 0, 0);
          return date;
        }
      }
    }
  }

  return null;
};

// ============================================================
// DATE RANGE
// ============================================================
// Extended to handle all dateReference values including:
// - today, tomorrow, yesterday
// - this_week, last_week, next_week
// - this_month, last_month, next_month
// - this_year, last_year, next_year
// - specific_date (natural date parsing from search field)
// ============================================================

const getDateRange = (dateReference, searchText = null) => {
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const start = new Date(now);
  const end = new Date(now);

  // ========================================================
  // TODAY
  // ========================================================

  if (dateReference === "today") {
    end.setHours(23, 59, 59, 999);
    return { start, end };
  }

  // ========================================================
  // TOMORROW
  // ========================================================

  if (dateReference === "tomorrow") {
    start.setDate(start.getDate() + 1);
    end.setTime(start.getTime());
    end.setHours(23, 59, 59, 999);
    return { start, end };
  }

  // ========================================================
  // YESTERDAY
  // ========================================================

  if (dateReference === "yesterday") {
    start.setDate(start.getDate() - 1);
    end.setTime(start.getTime());
    end.setHours(23, 59, 59, 999);
    return { start, end };
  }

  // ========================================================
  // THIS WEEK (Monday to Sunday)
  // ========================================================

  if (dateReference === "this_week") {
    const dayOfWeek = now.getDay();
    const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    start.setDate(diff);
    start.setHours(0, 0, 0, 0);

    end.setDate(start.getDate() + 6);
    end.setHours(23, 59, 59, 999);
    return { start, end };
  }

  // ========================================================
  // LAST WEEK
  // ========================================================

  if (dateReference === "last_week") {
    const dayOfWeek = now.getDay();
    const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    start.setDate(diff - 7);
    start.setHours(0, 0, 0, 0);

    end.setDate(start.getDate() + 6);
    end.setHours(23, 59, 59, 999);
    return { start, end };
  }

  // ========================================================
  // NEXT WEEK
  // ========================================================

  if (dateReference === "next_week") {
    const dayOfWeek = now.getDay();
    const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    start.setDate(diff + 7);
    start.setHours(0, 0, 0, 0);

    end.setDate(start.getDate() + 6);
    end.setHours(23, 59, 59, 999);
    return { start, end };
  }

  // ========================================================
  // THIS MONTH
  // ========================================================

  if (dateReference === "this_month") {
    start.setDate(1);
    start.setHours(0, 0, 0, 0);

    end.setMonth(end.getMonth() + 1);
    end.setDate(0);
    end.setHours(23, 59, 59, 999);
    return { start, end };
  }

  // ========================================================
  // LAST MONTH
  // ========================================================

  if (dateReference === "last_month") {
    start.setMonth(start.getMonth() - 1);
    start.setDate(1);
    start.setHours(0, 0, 0, 0);

    end.setDate(0);
    end.setHours(23, 59, 59, 999);
    return { start, end };
  }

  // ========================================================
  // NEXT MONTH
  // ========================================================

  if (dateReference === "next_month") {
    start.setMonth(start.getMonth() + 1);
    start.setDate(1);
    start.setHours(0, 0, 0, 0);

    end.setMonth(end.getMonth() + 2);
    end.setDate(0);
    end.setHours(23, 59, 59, 999);
    return { start, end };
  }

  // ========================================================
  // THIS YEAR
  // ========================================================

  if (dateReference === "this_year") {
    start.setMonth(0);
    start.setDate(1);
    start.setHours(0, 0, 0, 0);

    end.setMonth(11);
    end.setDate(31);
    end.setHours(23, 59, 59, 999);
    return { start, end };
  }

  // ========================================================
  // LAST YEAR
  // ========================================================

  if (dateReference === "last_year") {
    start.setFullYear(start.getFullYear() - 1);
    start.setMonth(0);
    start.setDate(1);
    start.setHours(0, 0, 0, 0);

    end.setFullYear(end.getFullYear() - 1);
    end.setMonth(11);
    end.setDate(31);
    end.setHours(23, 59, 59, 999);
    return { start, end };
  }

  // ========================================================
  // NEXT YEAR
  // ========================================================

  if (dateReference === "next_year") {
    start.setFullYear(start.getFullYear() + 1);
    start.setMonth(0);
    start.setDate(1);
    start.setHours(0, 0, 0, 0);

    end.setFullYear(end.getFullYear() + 1);
    end.setMonth(11);
    end.setDate(31);
    end.setHours(23, 59, 59, 999);
    return { start, end };
  }

  // ========================================================
  // SPECIFIC DATE (natural date parsing from searchText)
  // ========================================================

  if (dateReference === "specific_date") {
    // Use searchText if provided (Phase 2 stores "2nd October" in search field)
    const dateStr = searchText || dateReference;

    // Try parsing as natural date first
    let parsedDate = parseNaturalDate(dateStr);

    // If that fails, try ISO/standard date parsing
    if (!parsedDate) {
      parsedDate = normalizeDate(dateStr);
    }

    if (parsedDate) {
      parsedDate.setHours(0, 0, 0, 0);
      const endDate = new Date(parsedDate);
      endDate.setHours(23, 59, 59, 999);
      return { start: parsedDate, end: endDate };
    }
  }

  // ========================================================
  // FALLBACK: If dateReference itself looks like a date
  // ========================================================

  if (typeof dateReference === "string" && /\d/.test(dateReference)) {
    const parsed = parseNaturalDate(dateReference);
    if (parsed) {
      parsed.setHours(0, 0, 0, 0);
      const endDate = new Date(parsed);
      endDate.setHours(23, 59, 59, 999);
      return { start: parsed, end: endDate };
    }
  }

  return null;
};

// ============================================================
// FILTER CALENDAR EVENTS
// ============================================================

const filterCalendarEvents = (events, route) => {
  if (!Array.isArray(events)) {
    return [];
  }

  let result = [...events];

  // ----------------------------------------------------------
  // Event type
  // ----------------------------------------------------------

  if (route.eventType) {
    result = result.filter(
      (event) =>
        String(event?.type || "").toUpperCase() ===
        String(route.eventType).toUpperCase(),
    );
  }

  // ----------------------------------------------------------
  // Search type
  // ----------------------------------------------------------

  if (route.searchType) {
    const search = String(route.searchType).toLowerCase();

    result = result.filter(
      (event) =>
        String(event?.title || "")
          .toLowerCase()
          .includes(search) ||
        String(event?.description || "")
          .toLowerCase()
          .includes(search),
    );
  }

  // ----------------------------------------------------------
  // Search text
  // ----------------------------------------------------------

  if (route.search && route.search !== "none") {
    const search = String(route.search).toLowerCase();

    result = result.filter(
      (event) =>
        String(event?.title || "")
          .toLowerCase()
          .includes(search) ||
        String(event?.description || "")
          .toLowerCase()
          .includes(search) ||
        String(event?.location || "")
          .toLowerCase()
          .includes(search),
    );
  }

  // ----------------------------------------------------------
  // Date reference
  // ----------------------------------------------------------

  const range = getDateRange(route.dateReference, route.search);

  if (range) {
    result = result.filter((event) => {
      const date = normalizeDate(event?.date);

      if (!date) {
        return false;
      }

      return date >= range.start && date <= range.end;
    });
  }

  return result;
};

// ============================================================
// FILTER HOLIDAYS
// ============================================================

const filterHolidays = (holidays, route) => {
  if (!Array.isArray(holidays)) {
    return [];
  }

  let result = [...holidays];

  if (route.search && route.search !== "none") {
    const search = String(route.search).toLowerCase();

    result = result.filter(
      (holiday) =>
        String(holiday?.title || "")
          .toLowerCase()
          .includes(search) ||
        String(holiday?.description || "")
          .toLowerCase()
          .includes(search),
    );
  }

  const range = getDateRange(route.dateReference, route.search);

  if (range) {
    result = result.filter((holiday) => {
      const date = normalizeDate(holiday?.date);

      if (!date) {
        return false;
      }

      return date >= range.start && date <= range.end;
    });
  }

  return result;
};

// ============================================================
// CALENDAR RETRIEVAL
// ============================================================
// FIXED: For specific_date queries, return BOTH events AND holidays
// ============================================================

const retrieveCalendarData = (userContext, route) => {
  const calendar = userContext?.calendar || {};

  const events = Array.isArray(calendar.events) ? calendar.events : [];

  const holidays = Array.isArray(calendar.holidays) ? calendar.holidays : [];

  // ----------------------------------------------------------
  // Holiday only
  // ----------------------------------------------------------

  if (route.dataType === "holiday") {
    const matchedHolidays = filterHolidays(holidays, route);

    return {
      success: true,

      source: "calendar",

      entity: route.entity,

      operation: route.operation,

      period: route.period,

      dateReference: route.dateReference,

      count: matchedHolidays.length,

      data: matchedHolidays,
    };
  }

  // ----------------------------------------------------------
  // Event only (default)
  // ----------------------------------------------------------

  const matchedEvents = filterCalendarEvents(events, route);

  return {
    success: true,

    source: "calendar",

    entity: route.entity,

    operation: route.operation,

    period: route.period,

    dateReference: route.dateReference,

    count: matchedEvents.length,

    data: matchedEvents,
  };
};

// ============================================================
// USER CONTEXT RETRIEVAL
// ============================================================

const retrieveUserContextData = (userContext, route) => {
  // ----------------------------------------------------------
  // Working hours
  // ----------------------------------------------------------

  if (route.dataType === "hours") {
    return {
      success: true,

      source: "userContext",

      entity: route.entity,

      operation: route.operation,

      period: route.period,

      value: getWorkingHoursValue(userContext, route.entity, route.period)
        .value,
    };
  }

  // ----------------------------------------------------------
  // Direct field
  // ----------------------------------------------------------

  const value = getNestedValue(userContext, route.field);

  return {
    success: true,

    source: "userContext",

    entity: route.entity,

    operation: route.operation,

    period: route.period,

    value: hasValue(value) ? value : null,
  };
};

// ============================================================
// MAIN PHASE 4 FUNCTION
// ============================================================

export const retrieveTimeWiseData = ({ userContext, dataRoute }) => {
  if (!dataRoute?.routable) {
    return {
      success: false,

      source: "none",

      entity: dataRoute?.entity || "none",

      value: null,

      reason: "INVALID_DATA_ROUTE",
    };
  }

  let result;

  // ----------------------------------------------------------
  // Calendar
  // ----------------------------------------------------------

  if (dataRoute.source === "calendar") {
    result = retrieveCalendarData(userContext, dataRoute);
  }

  // ----------------------------------------------------------
  // User Context
  // ----------------------------------------------------------
  else if (dataRoute.source === "userContext") {
    result = retrieveUserContextData(userContext, dataRoute);
  }

  // ----------------------------------------------------------
  // Unsupported source
  // ----------------------------------------------------------
  else {
    result = {
      success: false,

      source: dataRoute.source,

      entity: dataRoute.entity,

      value: null,

      reason: "UNSUPPORTED_SOURCE",
    };
  }

  return result;
};

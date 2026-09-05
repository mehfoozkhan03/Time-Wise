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

const getWorkingHoursValue = (userContext, entity, period) => {
  const attendance = userContext?.attendance || {};

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
// NATURAL DATE PARSING
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
// DATE RANGE
// ============================================================
// FIXED: Properly handles all dateReference values
// ============================================================

const getDateRange = (dateReference, searchText = null) => {
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const start = new Date(now);
  const end = new Date(now);

  if (dateReference === "today") {
    end.setHours(23, 59, 59, 999);
    return { start, end };
  }

  if (dateReference === "tomorrow") {
    start.setDate(start.getDate() + 1);
    end.setTime(start.getTime());
    end.setHours(23, 59, 59, 999);
    return { start, end };
  }

  if (dateReference === "yesterday") {
    start.setDate(start.getDate() - 1);
    end.setTime(start.getTime());
    end.setHours(23, 59, 59, 999);
    return { start, end };
  }

  // ----------------------------------------------------------
  // Week ranges (Monday - Sunday)
  // ----------------------------------------------------------
  // Built from explicit year/month/day so a week that crosses
  // a month boundary cannot overflow. The old version did
  // end.setDate(start.getDate() + 6) which, for Sat 5 Sep 2026,
  // produced 31 Aug -> 7 Oct instead of 31 Aug -> 6 Sep.
  // ----------------------------------------------------------

  const weekRange = (weekOffset) => {
    const dayOfWeek = now.getDay();

    const daysSinceMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

    const weekStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - daysSinceMonday + weekOffset * 7,
      0,
      0,
      0,
      0,
    );

    const weekEnd = new Date(
      weekStart.getFullYear(),
      weekStart.getMonth(),
      weekStart.getDate() + 6,
      23,
      59,
      59,
      999,
    );

    return { start: weekStart, end: weekEnd };
  };

  if (dateReference === "this_week") {
    return weekRange(0);
  }

  if (dateReference === "last_week") {
    return weekRange(-1);
  }

  if (dateReference === "next_week") {
    return weekRange(1);
  }

  // ----------------------------------------------------------
  // Month ranges
  // ----------------------------------------------------------
  // Day 1 of the target month to day 0 of the following month,
  // so month lengths and leap years take care of themselves.
  // ----------------------------------------------------------

  const monthRange = (monthOffset) => {
    const monthStart = new Date(
      now.getFullYear(),
      now.getMonth() + monthOffset,
      1,
      0,
      0,
      0,
      0,
    );

    const monthEnd = new Date(
      now.getFullYear(),
      now.getMonth() + monthOffset + 1,
      0,
      23,
      59,
      59,
      999,
    );

    return { start: monthStart, end: monthEnd };
  };

  if (dateReference === "this_month") {
    return monthRange(0);
  }

  if (dateReference === "last_month") {
    return monthRange(-1);
  }

  if (dateReference === "next_month") {
    return monthRange(1);
  }

  if (dateReference === "this_year") {
    start.setMonth(0);
    start.setDate(1);
    start.setHours(0, 0, 0, 0);

    end.setMonth(11);
    end.setDate(31);
    end.setHours(23, 59, 59, 999);
    return { start, end };
  }

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

  if (dateReference === "specific_date") {
    // FIXED: Try searchText first (e.g., "2nd October", "Friday")
    const dateStr = searchText || dateReference;

    let parsedDate = parseNaturalDate(dateStr);

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
// FIXED: Apply date range FIRST, then text search
// This prevents filtering out date results by text
// ============================================================

const filterCalendarEvents = (events, route) => {
  if (!Array.isArray(events)) {
    return [];
  }

  let result = [...events];

  // ----------------------------------------------------------
  // Date reference FIRST (critical!)
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
  // Search text (only if NOT a date search)
  // ----------------------------------------------------------

  if (
    route.search &&
    route.search !== "none" &&
    route.dateReference !== "specific_date"
  ) {
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

  return result;
};

// ============================================================
// FILTER HOLIDAYS
// ============================================================
// FIXED: Apply date range FIRST, then text search
// ============================================================

const filterHolidays = (holidays, route) => {
  if (!Array.isArray(holidays)) {
    return [];
  }

  let result = [...holidays];

  // ----------------------------------------------------------
  // Date reference FIRST (critical!)
  // ----------------------------------------------------------

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

  // ----------------------------------------------------------
  // Search text (only if NOT a date search)
  // ----------------------------------------------------------

  if (
    route.search &&
    route.search !== "none" &&
    route.dateReference !== "specific_date"
  ) {
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

  return result;
};

// ============================================================
// MATCH HOLIDAY BY NAME (any year)
// ============================================================
// Safety net for "When is Janmashtami?" when the current
// year has no entry. Returns the single nearest upcoming
// match only - never the whole 2026-2035 list.
// ============================================================

const findNearestHolidayByName = (holidays, searchText) => {
  if (!Array.isArray(holidays) || !searchText || searchText === "none") {
    return [];
  }

  const search = String(searchText).toLowerCase();

  const matches = holidays
    .filter(
      (holiday) =>
        String(holiday?.title || "")
          .toLowerCase()
          .includes(search) ||
        String(holiday?.description || "")
          .toLowerCase()
          .includes(search),
    )
    .map((holiday) => ({
      holiday,
      date: normalizeDate(holiday?.date),
    }))
    .filter((item) => item.date);

  if (matches.length === 0) {
    return [];
  }

  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const upcoming = matches
    .filter((item) => item.date >= now)
    .sort((a, b) => a.date - b.date);

  if (upcoming.length > 0) {
    return [upcoming[0].holiday];
  }

  // Everything is in the past - return the most recent one
  const past = matches.sort((a, b) => b.date - a.date);

  return [past[0].holiday];
};

// ============================================================
// WEEKDAY / WEEKEND INFO
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

const buildDayInfo = (range) => {
  if (!range?.start) {
    return null;
  }

  const date = new Date(range.start);

  const dayIndex = date.getDay();

  return {
    resolvedDate: date.toISOString(),
    dayName: DAY_LABELS[dayIndex],
    isWeekend: dayIndex === 0 || dayIndex === 6,
  };
};

// ============================================================
// IS THIS RANGE A SINGLE DAY?
// ============================================================

const isSingleDayRange = (range) => {
  if (!range?.start || !range?.end) {
    return false;
  }

  return isSameDate(range.start, range.end);
};

// ============================================================
// CALENDAR RETRIEVAL
// ============================================================

const retrieveCalendarData = (userContext, route) => {
  const calendar = userContext?.calendar || {};

  const events = Array.isArray(calendar.events) ? calendar.events : [];

  const holidays = Array.isArray(calendar.holidays) ? calendar.holidays : [];

  const range = getDateRange(route.dateReference, route.search);

  const dayInfo = isSingleDayRange(range) ? buildDayInfo(range) : null;

  // ----------------------------------------------------------
  // Whole-day lookup: holidays + events for one date
  // ----------------------------------------------------------

  if (route.dataType === "day_summary") {
    const matchedHolidays = filterHolidays(holidays, route);

    const matchedEvents = filterCalendarEvents(events, route);

    return {
      success: true,

      source: "calendar",

      entity: route.entity,

      operation: route.operation,

      period: route.period,

      dateReference: route.dateReference,

      dayInfo,

      holidays: matchedHolidays,

      events: matchedEvents,

      count: matchedHolidays.length + matchedEvents.length,

      data: [...matchedHolidays, ...matchedEvents],
    };
  }

  // ----------------------------------------------------------
  // Holiday only
  // ----------------------------------------------------------

  if (route.dataType === "holiday") {
    let matchedHolidays = filterHolidays(holidays, route);

    // Named holiday with no entry in the requested year:
    // fall back to the nearest single occurrence.
    if (
      matchedHolidays.length === 0 &&
      route.search &&
      route.search !== "none" &&
      route.dateReference !== "specific_date"
    ) {
      matchedHolidays = findNearestHolidayByName(holidays, route.search);
    }

    return {
      success: true,

      source: "calendar",

      entity: route.entity,

      operation: route.operation,

      period: route.period,

      dateReference: route.dateReference,

      dayInfo,

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

    dayInfo,

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

  // ----------------------------------------------------------
  // ROOT CAUSE FIX
  // ----------------------------------------------------------
  // Phase 5 branches on `dataType`, but none of the retrieval
  // helpers used to return it. That made every calendar and
  // holiday answer fall through to the generic
  // "No matching information was found." reply even when
  // matching rows had been found. Always carry the route's
  // dataType (and search text) forward.
  // ----------------------------------------------------------

  return {
    ...result,

    dataType: result?.dataType || dataRoute.dataType || "none",

    search: dataRoute.search,
  };
};

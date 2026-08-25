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
// DATE RANGE
// ============================================================

const getDateRange = (dateReference) => {
  const now = new Date();

  const start = new Date(now);

  const end = new Date(now);

  if (dateReference === "today") {
    start.setHours(0, 0, 0, 0);

    end.setHours(23, 59, 59, 999);

    return {
      start,
      end,
    };
  }

  if (dateReference === "tomorrow") {
    start.setDate(start.getDate() + 1);

    start.setHours(0, 0, 0, 0);

    end.setTime(start.getTime());

    end.setHours(23, 59, 59, 999);

    return {
      start,
      end,
    };
  }

  if (dateReference === "yesterday") {
    start.setDate(start.getDate() - 1);

    start.setHours(0, 0, 0, 0);

    end.setTime(start.getTime());

    end.setHours(23, 59, 59, 999);

    return {
      start,
      end,
    };
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

  const range = getDateRange(route.dateReference);

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

  const range = getDateRange(route.dateReference);

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

const retrieveCalendarData = (userContext, route) => {
  const calendar = userContext?.calendar || {};

  const events = Array.isArray(calendar.events) ? calendar.events : [];

  const holidays = Array.isArray(calendar.holidays) ? calendar.holidays : [];

  // ----------------------------------------------------------
  // Holiday
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
  // Event
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

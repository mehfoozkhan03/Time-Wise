// ============================================================
// VALID VALUES
// ============================================================

const VALID_OPERATIONS = new Set([
  "get",
  "find",
  "list",
  "count",
  "show",
  "compare",
  "explain",
  "evaluate",
  "improve",
  "create",
  "update",
  "delete",
]);

// ============================================================
// SAFE STRING
// ============================================================

const safeString = (value, fallback = "none") => {
  if (typeof value !== "string") {
    return fallback;
  }

  const cleaned = value.trim();

  return cleaned || fallback;
};

// ============================================================
// SAFE NUMBER
// ============================================================

const safeConfidence = (value) => {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return 0;
  }

  return Math.max(0, Math.min(1, number));
};

// ============================================================
// PHASE 3 ENTITY MAP
// ============================================================
//
// Every supported entity is mapped to:
//
// source
// field
// operation
// dataType
//
// This is intentionally deterministic.
// We do NOT ask Groq which database field to use.
// ============================================================

const ENTITY_MAP = {
  // ----------------------------------------------------------
  // ATTENDANCE
  // ----------------------------------------------------------

  attendance_percentage: {
    source: "userContext",
    field: "attendancePercentage",
    operation: "get",
    dataType: "percentage",
  },

  present_days: {
    source: "attendance",
    field: "presentDays",
    operation: "count",
    dataType: "number",
  },

  absent_days: {
    source: "attendance",
    field: "absentDays",
    operation: "count",
    dataType: "number",
  },

  // ----------------------------------------------------------
  // WORKING HOURS
  // ----------------------------------------------------------

  working_hours: {
    source: "userContext",
    field: "workingHours",
    operation: "get",
    dataType: "hours",
  },

  today_working_hours: {
    source: "userContext",
    field: "todayHours",
    operation: "get",
    dataType: "hours",
    period: "today",
  },

  weekly_working_hours: {
    source: "userContext",
    field: "weeklyHours",
    operation: "get",
    dataType: "hours",
    period: "week",
  },

  monthly_working_hours: {
    source: "userContext",
    field: "monthlyHours",
    operation: "get",
    dataType: "hours",
    period: "month",
  },

  total_working_hours: {
    source: "userContext",
    field: "totalHours",
    operation: "get",
    dataType: "hours",
    period: "total",
  },

  // ----------------------------------------------------------
  // OVERTIME
  // ----------------------------------------------------------

  overtime_hours: {
    source: "userContext",
    field: "overtimeHours",
    operation: "get",
    dataType: "hours",
  },

  monthly_overtime: {
    source: "userContext",
    field: "monthlyOvertime",
    operation: "get",
    dataType: "hours",
    period: "month",
  },

  total_overtime: {
    source: "userContext",
    field: "totalOvertime",
    operation: "get",
    dataType: "hours",
    period: "total",
  },

  // ----------------------------------------------------------
  // PRODUCTIVITY
  // ----------------------------------------------------------

  productivity_score: {
    source: "userContext",
    field: "productivity",
    operation: "get",
    dataType: "percentage",
  },

  // ----------------------------------------------------------
  // STREAK
  // ----------------------------------------------------------

  current_streak: {
    source: "userContext",
    field: "dayStreak",
    operation: "get",
    dataType: "number",
  },

  longest_streak: {
    source: "userContext",
    field: "longestStreak",
    operation: "get",
    dataType: "number",
  },

  // ----------------------------------------------------------
  // LEAVES
  // ----------------------------------------------------------

  leaves_taken: {
    source: "userContext",
    field: "leavesTaken",
    operation: "count",
    dataType: "number",
  },

  // ----------------------------------------------------------
  // PUNCTUALITY
  // ----------------------------------------------------------

  punctuality_score: {
    source: "userContext",
    field: "punctuality",
    operation: "get",
    dataType: "percentage",
  },

  // ----------------------------------------------------------
  // AVERAGE DAILY HOURS
  // ----------------------------------------------------------

  average_daily_hours: {
    source: "userContext",
    field: "averageDailyHours",
    operation: "get",
    dataType: "hours",
  },

  // ----------------------------------------------------------
  // AVERAGE CHECK-IN
  // ----------------------------------------------------------

  average_checkin_time: {
    source: "userContext",
    field: "averageCheckinTime",
    operation: "get",
    dataType: "time",
  },

  // ----------------------------------------------------------
  // CALENDAR
  // ----------------------------------------------------------

  calendar_event: {
    source: "calendar",
    field: "events",
    operation: "find",
    dataType: "event",
  },

  meeting: {
    source: "calendar",
    field: "events",
    operation: "find",
    dataType: "event",
    eventType: "MEETING",
  },

  presentation: {
    source: "calendar",
    field: "events",
    operation: "find",
    dataType: "event",
    eventType: "MEETING",
    searchType: "presentation",
  },

  appointment: {
    source: "calendar",
    field: "events",
    operation: "find",
    dataType: "event",
  },

  task: {
    source: "calendar",
    field: "events",
    operation: "find",
    dataType: "event",
  },

  // ----------------------------------------------------------
  // HOLIDAYS
  // ----------------------------------------------------------

  holiday: {
    source: "calendar",
    field: "holidays",
    operation: "find",
    dataType: "holiday",
  },

  festival: {
    source: "calendar",
    field: "holidays",
    operation: "find",
    dataType: "holiday",
  },

  // ----------------------------------------------------------
  // NOTIFICATIONS
  // ----------------------------------------------------------

  notification: {
    source: "notifications",
    field: "notifications",
    operation: "list",
    dataType: "notification",
  },

  unread_notifications: {
    source: "notifications",
    field: "unreadNotifications",
    operation: "count",
    dataType: "number",
  },

  // ----------------------------------------------------------
  // GOALS
  // ----------------------------------------------------------

  weekly_goal: {
    source: "userContext",
    field: "weeklyGoal",
    operation: "get",
    dataType: "goal",
    period: "week",
  },

  goal_progress: {
    source: "userContext",
    field: "weeklyGoalPercentage",
    operation: "get",
    dataType: "percentage",
    period: "week",
  },

  // ----------------------------------------------------------
  // REPORT
  // ----------------------------------------------------------

  report: {
    source: "reports",
    field: "report",
    operation: "get",
    dataType: "report",
  },

  // ----------------------------------------------------------
  // PROFILE
  // ----------------------------------------------------------

  profile: {
    source: "userContext",
    field: "profile",
    operation: "get",
    dataType: "profile",
  },

  department: {
    source: "userContext",
    field: "department",
    operation: "get",
    dataType: "text",
  },

  designation: {
    source: "userContext",
    field: "designation",
    operation: "get",
    dataType: "text",
  },

  name: {
    source: "userContext",
    field: "name",
    operation: "get",
    dataType: "text",
  },
};

// ============================================================
// PERIOD NORMALIZATION
// ============================================================

const normalizePeriod = (period, dateReference) => {
  if (period === "today" || dateReference === "today") {
    return "today";
  }

  if (period === "week" || dateReference === "this_week") {
    return "week";
  }

  if (period === "month" || dateReference === "this_month") {
    return "month";
  }

  if (period === "total") {
    return "total";
  }

  return "none";
};

// ============================================================
// BUILD ROUTE
// ============================================================

const buildRoute = ({ intentEntity }) => {
  const intent = safeString(intentEntity?.intent, "unknown");

  const action = safeString(intentEntity?.action, "unknown");

  const entity = safeString(intentEntity?.entity, "none");

  const search = safeString(intentEntity?.search, "none");

  const dateReference = safeString(intentEntity?.dateReference, "none");

  const phase2Period = safeString(intentEntity?.period, "none");

  const confidence = safeConfidence(intentEntity?.confidence);

  const entityConfig = ENTITY_MAP[entity] || null;

  // ----------------------------------------------------------
  // Unknown entity
  // ----------------------------------------------------------

  if (!entityConfig) {
    return {
      routable: false,

      intent,
      action,
      entity,

      source: "none",
      field: "none",
      operation: "unknown",

      dataType: "none",

      period: normalizePeriod(phase2Period, dateReference),

      dateReference,
      search,

      confidence,

      reason: "ENTITY_NOT_MAPPED",
    };
  }

  // ----------------------------------------------------------
  // Determine operation
  // ----------------------------------------------------------

  let operation = VALID_OPERATIONS.has(action)
    ? action
    : entityConfig.operation;

  // ----------------------------------------------------------
  // Some entities have a fixed operation.
  // Don't allow an accidental AI action to break routing.
  // ----------------------------------------------------------

  if (
    entity === "weekly_working_hours" ||
    entity === "monthly_working_hours" ||
    entity === "total_working_hours" ||
    entity === "today_working_hours"
  ) {
    operation = "get";
  }

  if (entity === "leaves_taken") {
    operation = "count";
  }

  if (
    entity === "calendar_event" ||
    entity === "meeting" ||
    entity === "presentation" ||
    entity === "appointment" ||
    entity === "task"
  ) {
    operation = "find";
  }

  if (entity === "holiday" || entity === "festival") {
    operation = "find";
  }

  const period =
    entityConfig.period || normalizePeriod(phase2Period, dateReference);

  return {
    routable: true,

    intent,
    action: operation,
    entity,

    source: entityConfig.source,
    field: entityConfig.field,
    operation,

    dataType: entityConfig.dataType,

    period,

    dateReference,

    search,

    confidence,

    ...(entityConfig.eventType
      ? {
          eventType: entityConfig.eventType,
        }
      : {}),

    ...(entityConfig.searchType
      ? {
          searchType: entityConfig.searchType,
        }
      : {}),

    reason: "ENTITY_MAPPED",
  };
};

// ============================================================
// MAIN PHASE 3 FUNCTION
// ============================================================

export const routeTimeWiseData = ({ intentEntity }) => {
  const route = buildRoute({
    intentEntity,
  });

  console.log("========== PHASE 3 DATA ROUTING ==========");

  console.log(JSON.stringify(route, null, 2));

  console.log("===========================================");

  return route;
};

// ============================================================
// EXPORT ENTITY MAP
// ============================================================
//
// Useful later for testing/admin/debugging.
// ============================================================

export const getPhase3EntityMap = () => {
  return ENTITY_MAP;
};

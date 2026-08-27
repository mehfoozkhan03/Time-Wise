export const getRequestedContext = (
  message,
  userContext,
  conversation = [],
  queryUnderstanding = null,
  intentEntity = null,
  dataRoute = null,
) => {
  const question = message.toLowerCase().trim();
  const lower = message.toLowerCase().trim();

  const normalizedFollowUp = lower
    .replace(/\s+/g, " ")
    .replace(/\bwek\b/g, "week")
    .replace(/\bwk\b/g, "week")
    .replace(/\bmon\b/g, "month")
    .replace(/\bmont\b/g, "month")
    .replace(/\bmo\b/g, "month");

  const context = {};

  // ==================================================
  // PHASE 3: DATA ROUTE
  // ==================================================

  const phase3Route = dataRoute?.routable ? dataRoute : null;

  const intentToContext = {
    attendance: "attendance",
    working_hours: "workingHours",
    overtime: "overtime",
    productivity: "productivity",
    streak: "streak",
    leaves: "leaves",
    punctuality: "punctuality",
    average_daily_hours: "averageDailyHours",
    average_checkin: "averageCheckin",
    calendar_event: "calendar",
    holiday: "holidays",
    notification: "notifications",
    goal: "goals",
    report: "reports",
    profile: "profile",
  };

  // ==================================================
  // Helper: Check whether a value actually exists
  // ==================================================

  const getValidPeriod = (period) => {
    const validPeriods = ["today", "week", "month", "total"];

    return validPeriods.includes(period) ? period : null;
  };

  const aiIntent = queryUnderstanding?.intent || null;

  const aiPeriod = getValidPeriod(queryUnderstanding?.period);

  const phase2Intent = intentEntity?.intent || null;

  const phase2Action = intentEntity?.action || null;

  const phase2Entity = intentEntity?.entity || null;

  const phase2Period = getValidPeriod(intentEntity?.period);

  const phase2DateReference = intentEntity?.dateReference || "none";

  const phase2Search = intentEntity?.search || "none";

  const phase2Confident = Number(intentEntity?.confidence || 0) >= 0.75;

  const effectiveIntent =
    phase2Confident && phase2Intent ? phase2Intent : aiIntent;

  const effectivePeriod =
    phase2Confident && phase2Period ? phase2Period : aiPeriod;

  const aiConfidence = Number(queryUnderstanding?.confidence ?? 0);

  // Only trust Phase 1 when it returned a valid, confident intent.
  // If Phase 1 fails, the existing keyword/follow-up logic below remains
  // available as a safe fallback.
  const useAIIntent =
    Boolean(aiIntent) && aiIntent !== "unknown" && aiConfidence >= 0.7;

  const hasValue = (value) => typeof value === "number" && value > 0;

  // ==================================================
  // PHASE 1 AI ROUTING HELPERS
  // ==================================================

  const buildWorkingHoursContext = (period) => {
    switch (period) {
      case "today":
        return {
          attendance: {
            workingHoursPeriod: "today",
            workingHours: todayHours,
          },
        };

      case "week":
        return {
          attendance: {
            workingHoursPeriod: "week",
            workingHours: weeklyHours,
          },
        };

      case "month":
        return {
          attendance: {
            workingHoursPeriod: "month",
            workingHours: monthlyHours,
          },
        };

      case "total":
        return {
          attendance: {
            workingHoursPeriod: "total",
            workingHours: totalWorkingHours,
          },
        };

      default:
        return null;
    }
  };

  // ==================================================
  // PHASE 3 WORKING HOURS ROUTING
  // ==================================================

  const getPhase3WorkingHoursContext = (route) => {
    if (!route) {
      return null;
    }

    if (route.source !== "userContext" || route.dataType !== "hours") {
      return null;
    }

    if (route.entity === "today_working_hours" || route.period === "today") {
      return buildWorkingHoursContext("today");
    }

    if (route.entity === "weekly_working_hours" || route.period === "week") {
      return buildWorkingHoursContext("week");
    }

    if (route.entity === "monthly_working_hours" || route.period === "month") {
      return buildWorkingHoursContext("month");
    }

    if (route.entity === "total_working_hours" || route.period === "total") {
      return buildWorkingHoursContext("total");
    }

    return null;
  };

  const buildOvertimeContext = (period) => {
    const monthlyOvertime = Number(userContext.attendance?.overtimeHours ?? 0);

    const totalOvertime = Number(
      userContext.attendance?.totalOvertimeHours ?? 0,
    );

    if (period === "month") {
      return {
        attendance: {
          overtimePeriod: "month",
          overtimeHours: monthlyOvertime,
        },
      };
    }

    if (period === "total") {
      return {
        attendance: {
          overtimePeriod: "total",
          overtimeHours: totalOvertime,
        },
      };
    }

    return null;
  };

  // ==================================================
  // WORKING HOURS / OVERTIME CLARIFICATION FOLLOW-UP
  // ==================================================

  const todayHours = Number(userContext.attendance?.todayHours ?? 0);

  const weeklyHours = Number(userContext.attendance?.weeklyHours ?? 0);

  const monthlyHours = Number(userContext.attendance?.monthlyHours ?? 0);

  const totalWorkingHours = Number(
    userContext.attendance?.totalWorkingHours ?? 0,
  );

  // ==================================================
  // PHASE 3 AI DATA ROUTING
  // ==================================================

  if (phase3Route) {
    // ----------------------------------------------
    // Working Hours
    // ----------------------------------------------

    if (phase3Route.intent === "working_hours") {
      const phase3WorkingHoursContext =
        getPhase3WorkingHoursContext(phase3Route);

      if (phase3WorkingHoursContext) {
        return phase3WorkingHoursContext;
      }
    }
  }

  // ==================================================
  // PHASE 1 AI ROUTING
  // ==================================================
  // This is the bridge between the AI query understanding layer and the
  // existing TimeWise context selector. It allows natural typos such as
  // "wrking hou" or "totl workng hors" to reach the same data as a
  // correctly typed query, without maintaining a typo dictionary.

  if (useAIIntent) {
    console.log("========== AI CONTEXT ROUTING ==========");
    console.log("Intent:", aiIntent);
    console.log("Period:", aiPeriod || "none");
    console.log("Confidence:", aiConfidence);
    console.log("=======================================");

    if (aiIntent === "working_hours") {
      if (aiPeriod) {
        const aiWorkingHoursContext = buildWorkingHoursContext(aiPeriod);

        if (aiWorkingHoursContext) {
          return aiWorkingHoursContext;
        }
      }

      // No period was supplied. Preserve the existing clarification behavior.
      const availablePeriods = [];

      if (hasValue(todayHours)) {
        availablePeriods.push({ key: "today", label: "today" });
      }

      if (hasValue(weeklyHours)) {
        availablePeriods.push({ key: "week", label: "this week" });
      }

      if (hasValue(monthlyHours)) {
        availablePeriods.push({ key: "month", label: "this month" });
      }

      if (hasValue(totalWorkingHours)) {
        availablePeriods.push({
          key: "total",
          label: "your total working hours",
        });
      }

      if (availablePeriods.length === 0) {
        return {
          attendance: {
            workingHoursStatus: "none",
            todayHours: 0,
            weeklyHours: 0,
            monthlyHours: 0,
            totalWorkingHours: 0,
          },
        };
      }

      if (availablePeriods.length === 1) {
        return buildWorkingHoursContext(availablePeriods[0].key);
      }

      const labels = availablePeriods.map((item) => item.label);
      let clarificationMessage;

      if (labels.length === 2) {
        clarificationMessage = `Do you want to know your working hours for ${labels[0]} or ${labels[1]}?`;
      } else if (labels.length === 3) {
        clarificationMessage = `Do you want to know your working hours for ${labels[0]}, ${labels[1]}, or ${labels[2]}?`;
      } else {
        clarificationMessage = `Do you want to know your working hours for ${labels[0]}, ${labels[1]}, ${labels[2]}, or ${labels[3]}?`;
      }

      return {
        clarification: {
          type: "workingHoursPeriod",
          message: clarificationMessage,
        },
      };
    }

    if (aiIntent === "overtime") {
      if (aiPeriod === "today" || aiPeriod === "week") {
        // Overtime is currently exposed by TimeWise as month/total.
        // Ignore an unsupported AI period and use the normal fallback below.
      } else if (aiPeriod) {
        const aiOvertimeContext = buildOvertimeContext(aiPeriod);

        if (aiOvertimeContext) {
          return aiOvertimeContext;
        }
      } else {
        const monthlyOvertime = Number(
          userContext.attendance?.overtimeHours ?? 0,
        );
        const totalOvertime = Number(
          userContext.attendance?.totalOvertimeHours ?? 0,
        );

        if (hasValue(monthlyOvertime) && hasValue(totalOvertime)) {
          return {
            clarification: {
              type: "overtimePeriod",
              message:
                "Do you want to know your overtime hours for this month or your total overtime hours?",
            },
          };
        }

        if (hasValue(monthlyOvertime)) {
          return {
            attendance: {
              overtimePeriod: "month",
              overtimeHours: monthlyOvertime,
            },
          };
        }

        if (hasValue(totalOvertime)) {
          return {
            attendance: {
              overtimePeriod: "total",
              overtimeHours: totalOvertime,
            },
          };
        }

        return {
          attendance: {
            overtimeHours: 0,
            totalOvertimeHours: 0,
            overtimeStatus: "none",
          },
        };
      }
    }

    if (aiIntent === "attendance") {
      return {
        attendance: {
          percentage: userContext.attendance?.percentage ?? 0,
        },
      };
    }

    if (aiIntent === "productivity") {
      return {
        productivity: {
          percentage: userContext.productivity?.percentage ?? 0,
        },
      };
    }

    if (aiIntent === "streak") {
      return {
        currentStreak: userContext.streak?.current ?? 0,
        longestStreak: userContext.streak?.longest ?? 0,
      };
    }

    if (aiIntent === "leaves") {
      return {
        attendance: {
          leavesTaken: userContext.attendance?.leavesTaken ?? 0,
        },
      };
    }

    if (aiIntent === "punctuality") {
      return {
        punctuality: userContext.productivity?.punctuality ?? 0,
      };
    }

    if (aiIntent === "average_daily_hours") {
      return {
        attendance: {
          averageDailyHours: userContext.attendance?.averageDailyHours ?? 0,
        },
      };
    }

    if (aiIntent === "average_checkin") {
      return {
        averageCheckIn: userContext.work?.averageCheckIn ?? null,
      };
    }
  }

  // --------------------------------------------------
  // Check what the previous assistant asked
  // --------------------------------------------------

  const lastAssistantMessage = [...conversation]
    .reverse()
    .find((msg) => msg.role === "assistant");

  const lastAssistantContent =
    lastAssistantMessage?.content?.toLowerCase() || "";

  const isWorkingHoursClarification =
    lastAssistantContent.includes("working hours") &&
    lastAssistantContent.includes("week") &&
    lastAssistantContent.includes("month") &&
    lastAssistantContent.includes("total");

  const isOvertimeClarification =
    lastAssistantContent.includes("overtime") &&
    lastAssistantContent.includes("month") &&
    lastAssistantContent.includes("total");

  const isOvertimeFollowUp =
    lastAssistantContent.includes("overtime hours") &&
    (lastAssistantContent.includes("this month") ||
      lastAssistantContent.includes("total"));

  // --------------------------------------------------
  // OVERTIME FOLLOW-UP MUST COME FIRST
  // --------------------------------------------------

  if (isOvertimeClarification || isOvertimeFollowUp) {
    const monthlyOvertime = Number(userContext.attendance?.overtimeHours ?? 0);

    const totalOvertime = Number(
      userContext.attendance?.totalOvertimeHours ?? 0,
    );

    // This month
    if (
      normalizedFollowUp === "month" ||
      normalizedFollowUp === "this month" ||
      normalizedFollowUp === "monthly" ||
      normalizedFollowUp === "this month's"
    ) {
      return {
        attendance: {
          overtimePeriod: "month",
          overtimeHours: monthlyOvertime,
        },
      };
    }

    // Total
    if (
      normalizedFollowUp === "total" ||
      normalizedFollowUp === "total overtime" ||
      normalizedFollowUp === "total overtime hours" ||
      normalizedFollowUp === "all time" ||
      normalizedFollowUp === "overall"
    ) {
      return {
        attendance: {
          overtimePeriod: "total",
          overtimeHours: totalOvertime,
        },
      };
    }
  }

  // ==================================================
  // WORKING HOURS FOLLOW-UP
  // ==================================================

  const isWorkingHoursFollowUp =
    lastAssistantContent.includes("working hours") &&
    (lastAssistantContent.includes("week") ||
      lastAssistantContent.includes("month") ||
      lastAssistantContent.includes("total"));

  if (isWorkingHoursFollowUp) {
    if (
      normalizedFollowUp === "week" ||
      normalizedFollowUp === "this week" ||
      normalizedFollowUp === "weekly"
    ) {
      return {
        attendance: {
          workingHoursPeriod: "week",
          workingHours: userContext.attendance.weeklyHours,
        },
      };
    }

    if (
      normalizedFollowUp === "month" ||
      normalizedFollowUp === "this month" ||
      normalizedFollowUp === "monthly"
    ) {
      return {
        attendance: {
          workingHoursPeriod: "month",
          workingHours: userContext.attendance.monthlyHours,
        },
      };
    }

    if (
      normalizedFollowUp === "total" ||
      normalizedFollowUp === "total hours" ||
      normalizedFollowUp === "total working hours" ||
      normalizedFollowUp === "overall"
    ) {
      return {
        attendance: {
          workingHoursPeriod: "total",
          workingHours: userContext.attendance.totalWorkingHours,
        },
      };
    }
  }

  // ==================================================
  // CALENDAR / EVENTS / FESTIVALS
  // ==================================================

  const calendar = userContext.calendar ?? {};

  const calendarEvents = Array.isArray(calendar.events) ? calendar.events : [];

  const calendarHolidays = Array.isArray(calendar.holidays)
    ? calendar.holidays
    : [];

  const normalizeCalendarText = (value) =>
    String(value ?? "")
      .trim()
      .toLowerCase();

  const getCalendarDateOnly = (value) => {
    if (!value) return null;

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return null;
    }

    return date.toISOString().split("T")[0];
  };

  // --------------------------------------------------
  // Calendar question detection
  // --------------------------------------------------

  const calendarKeywords = [
    "event",
    "events",
    "calendar",
    "festival",
    "festivals",
    "holiday",
    "holidays",
    "meeting",
    "meetings",
    "appointment",
    "appointments",
    "birthday",
  ];

  const hasCalendarKeyword = calendarKeywords.some((keyword) =>
    lower.includes(keyword),
  );

  const hasMatchingEventName = calendarEvents.some((event) => {
    const title = normalizeCalendarText(event.title);

    return title.length > 0 && lower.includes(title);
  });

  const hasMatchingHolidayName = calendarHolidays.some((holiday) => {
    const title = normalizeCalendarText(holiday.title);

    return title.length > 0 && lower.includes(title);
  });

  const isCalendarQuestion =
    hasCalendarKeyword || hasMatchingEventName || hasMatchingHolidayName;

  // --------------------------------------------------
  // Search calendar
  // --------------------------------------------------

  if (isCalendarQuestion) {
    const searchWords = lower
      .replace(/[?!.,]/g, " ")
      .split(/\s+/)
      .filter((word) => word.length > 2)
      .filter(
        (word) =>
          ![
            "when",
            "what",
            "which",
            "where",
            "show",
            "tell",
            "about",
            "date",
            "dates",
            "is",
            "are",
            "my",
          ].includes(word),
      );

    // ------------------------------------------------
    // Personal events
    // ------------------------------------------------

    const matchingEvents = calendarEvents
      .filter((event) => {
        const title = normalizeCalendarText(event.title);
        const description = normalizeCalendarText(event.description);

        return searchWords.some(
          (word) => title.includes(word) || description.includes(word),
        );
      })
      .map((event) => ({
        title: event.title,
        date: getCalendarDateOnly(event.date),
        startTime: event.startTime || "",
        endTime: event.endTime || "",
        location: event.location || "",
      }));

    // ------------------------------------------------
    // Holidays / festivals
    // ------------------------------------------------

    const matchingHolidays = calendarHolidays
      .filter((holiday) => {
        const title = normalizeCalendarText(holiday.title);

        const description = normalizeCalendarText(holiday.description);

        return searchWords.some(
          (word) => title.includes(word) || description.includes(word),
        );
      })
      .map((holiday) => ({
        title: holiday.title,
        date: getCalendarDateOnly(holiday.date),
      }));

    // ------------------------------------------------
    // Only send matching calendar records
    // ------------------------------------------------

    if (matchingEvents.length > 0 || matchingHolidays.length > 0) {
      context.calendar = {
        events: matchingEvents,
        holidays: matchingHolidays,
      };
    }
  }

  // ==================================================
  // ATTENDANCE
  // ==================================================

  if (
    question.includes("attendance") ||
    question.includes("present") ||
    question.includes("absent") ||
    question.includes("attendance rate")
  ) {
    context.attendance = {
      percentage: userContext.attendance.percentage,
    };
  }

  // ==================================================
  // PRODUCTIVITY
  // ==================================================

  if (question.includes("productivity") || question.includes("productive")) {
    context.productivity = {
      percentage: userContext.productivity.percentage,
    };
  }

  // ==================================================
  // SPECIFIC TOTAL WORKING HOURS
  // ==================================================

  if (
    lower.includes("total working hours") ||
    lower.includes("total work hours") ||
    lower.includes("total working time") ||
    lower.includes("total work time") ||
    lower.includes("working hours overall") ||
    lower.includes("overall working hours")
  ) {
    context.attendance = {
      totalWorkingHours: userContext.attendance.totalWorkingHours,
    };
  }

  // ==================================================
  // SPECIFIC AVERAGE DAILY HOURS
  // ==================================================

  if (
    lower.includes("average daily hours") ||
    lower.includes("average daily working hours") ||
    lower.includes("average working hours per day") ||
    lower.includes("average daily working time") ||
    lower.includes("daily average hours")
  ) {
    context.attendance = {
      averageDailyHours: userContext.attendance.averageDailyHours,
    };
  }

  // ==================================================
  // LEAVES
  // ==================================================

  if (
    lower.includes("leave") &&
    (lower.includes("taken") ||
      lower.includes("used") ||
      lower.includes("how many") ||
      lower.includes("number of") ||
      lower.includes("count") ||
      lower.includes("leave") ||
      lower.includes("leaves") ||
      lower.includes("how many leaves") ||
      lower.includes("leaves taken"))
  ) {
    context.attendance = {
      leavesTaken: userContext.attendance.leavesTaken,
    };
  }

  // ==================================================
  // OVERTIME
  // ==================================================

  const isOvertimeQuestion =
    lower.includes("overtime hours") ||
    lower.includes("overtime hour") ||
    lower.includes("overtime") ||
    lower.includes("extra working hours") ||
    lower.includes("extra work hours") ||
    lower.includes("extra hours worked");

  if (isOvertimeQuestion) {
    const monthlyOvertime = userContext.attendance?.overtimeHours ?? 0;

    const totalOvertime = userContext.attendance?.totalOvertimeHours ?? 0;

    const asksThisMonth =
      lower.includes("this month") ||
      lower.includes("this month's") ||
      lower.includes("monthly");

    const asksTotal =
      lower.includes("total") ||
      lower.includes("all time") ||
      lower.includes("overall");

    // ----------------------------------------------
    // Explicitly asking for this month
    // ----------------------------------------------

    if (asksThisMonth) {
      context.attendance = {
        overtimePeriod: "month",
        overtimeHours: monthlyOvertime,
      };
    }

    // ----------------------------------------------
    // Explicitly asking for total
    // ----------------------------------------------
    else if (asksTotal) {
      context.attendance = {
        overtimePeriod: "total",
        overtimeHours: totalOvertime,
      };
    }

    // ----------------------------------------------
    // Both exist
    // ----------------------------------------------
    else if (hasValue(monthlyOvertime) && hasValue(totalOvertime)) {
      context.clarification = {
        type: "overtimePeriod",
        message:
          "Do you want to know your overtime hours for this month or your total overtime hours?",
      };
    }

    // ----------------------------------------------
    // Only monthly exists
    // ----------------------------------------------
    else if (hasValue(monthlyOvertime)) {
      context.attendance = {
        overtimePeriod: "month",
        overtimeHours: monthlyOvertime,
      };
    }

    // ----------------------------------------------
    // Only total exists
    // ----------------------------------------------
    else if (hasValue(totalOvertime)) {
      context.attendance = {
        overtimePeriod: "total",
        overtimeHours: totalOvertime,
      };
    }

    // ----------------------------------------------
    // No overtime
    // ----------------------------------------------
    else {
      context.attendance = {
        overtimeHours: 0,
        totalOvertimeHours: 0,
        overtimeStatus: "none",
      };
    }
  }

  // ==================================================
  // WEEKLY HOURS
  // ==================================================

  // ==================================================
  // WEEKLY HOURS
  // ==================================================

  if (
    question.includes("weekly hours") ||
    question.includes("hours this week") ||
    question.includes("worked this week")
  ) {
    context.attendance = {
      workingHoursPeriod: "week",
      workingHours: userContext.attendance.weeklyHours,
    };
  }

  // ==================================================
  // MONTHLY HOURS
  // ==================================================

  if (
    question.includes("monthly hours") ||
    question.includes("hours this month") ||
    question.includes("worked this month")
  ) {
    context.attendance = {
      workingHoursPeriod: "month",
      workingHours: userContext.attendance.monthlyHours,
    };
  }

  // ==================================================
  // CURRENT STREAK
  // ==================================================

  if (
    question.includes("current streak") ||
    question.includes("my streak") ||
    question.includes("day streak") ||
    lower.includes("streak") ||
    lower.includes("attendance streak")
  ) {
    context.currentStreak = userContext.streak.current;
  }

  // ==================================================
  // LONGEST STREAK
  // ==================================================

  if (question.includes("longest streak") || question.includes("best streak")) {
    context.longestStreak = userContext.streak.longest;
  }

  // ==================================================
  // PUNCTUALITY
  // ==================================================

  if (question.includes("punctuality") || question.includes("punctual")) {
    context.punctuality = userContext.productivity.punctuality;
  }

  // ==================================================
  // BREAK SCORE
  // ==================================================

  if (
    question.includes("break score") ||
    question.includes("break discipline")
  ) {
    context.breakScore = userContext.productivity.breakScore;
  }

  // ==================================================
  // WEEKLY GOAL
  // ==================================================

  if (
    question.includes("weekly goal") ||
    question.includes("goal percentage") ||
    question.includes("weekly target")
  ) {
    context.weeklyGoal = {
      percentage: userContext.goals.weeklyGoalPercentage,

      score: userContext.goals.weeklyGoalScore,

      target: userContext.goals.weeklyTarget,

      remaining: userContext.goals.weeklyHoursRemaining,
    };
  }

  // ==================================================
  // AVERAGE CHECK-IN
  // ==================================================

  if (
    question.includes("average check in") ||
    question.includes("average check-in") ||
    question.includes("average checkin")
  ) {
    context.averageCheckIn = userContext.work.averageCheckIn;
  }

  // ==================================================
  // AVERAGE BREAK
  // ==================================================

  if (
    question.includes("average break") ||
    question.includes("break duration")
  ) {
    context.averageBreakDuration = userContext.work.averageBreakDuration;
  }

  // ==================================================
  // OVERALL PERFORMANCE
  // ==================================================

  const overallPerformanceKeywords = [
    "how am i doing",
    "how am i performing",
    "how is my performance",
    "overall performance",
    "overall stats",
    "overall statistics",
    "overall summary",
    "performance summary",
    "give me a summary",
    "summarize my performance",
    "am i doing well",
    "how am i doing overall",
    "my overall performance",
    "my performance overall",
    "what should i improve",
    "where should i improve",
  ];

  const isOverallPerformanceQuestion = overallPerformanceKeywords.some(
    (keyword) => question.includes(keyword),
  );

  if (isOverallPerformanceQuestion) {
    context.overallPerformance = {
      attendance: userContext.attendance.percentage,

      productivity: userContext.productivity.percentage,

      punctuality: userContext.productivity.punctuality,

      weeklyGoalPercentage: userContext.goals.weeklyGoalPercentage,

      weeklyHours: userContext.attendance.weeklyHours,

      weeklyTarget: userContext.goals.weeklyTarget,

      weeklyHoursRemaining: userContext.goals.weeklyHoursRemaining,

      currentStreak: userContext.streak.current,
    };
  }

  // ==================================================
  // WORKING HOURS
  // ==================================================

  const hasWorkingHoursKeyword =
    lower.includes("working hour") ||
    lower.includes("working hours") ||
    lower.includes("work hour") ||
    lower.includes("work hours");

  const asksToday = lower.includes("today");

  const asksWeek = lower.includes("this week") || lower.includes("weekly");

  const asksMonth = lower.includes("this month") || lower.includes("monthly");

  const asksTotal =
    lower.includes("total") ||
    lower.includes("overall") ||
    lower.includes("all time");

  // --------------------------------------------------
  // Direct Today
  // --------------------------------------------------

  if (hasWorkingHoursKeyword && asksToday) {
    context.attendance = {
      workingHoursPeriod: "today",
      workingHours: userContext.attendance.todayHours ?? 0,
    };
  }

  // --------------------------------------------------
  // Direct Week
  // --------------------------------------------------
  else if (hasWorkingHoursKeyword && asksWeek) {
    context.attendance = {
      workingHoursPeriod: "week",
      workingHours: userContext.attendance.weeklyHours ?? 0,
    };
  }

  // --------------------------------------------------
  // Direct Month
  // --------------------------------------------------
  else if (hasWorkingHoursKeyword && asksMonth) {
    context.attendance = {
      workingHoursPeriod: "month",
      workingHours: userContext.attendance.monthlyHours ?? 0,
    };
  }

  // --------------------------------------------------
  // Direct Total
  // --------------------------------------------------
  else if (hasWorkingHoursKeyword && asksTotal) {
    context.attendance = {
      workingHoursPeriod: "total",
      workingHours: userContext.attendance.totalWorkingHours ?? 0,
    };
  }

  // --------------------------------------------------
  // Ambiguous Working Hours
  // --------------------------------------------------
  else if (hasWorkingHoursKeyword) {
    const todayHours = userContext.attendance?.todayHours ?? 0;

    const weeklyHours = userContext.attendance?.weeklyHours ?? 0;

    const monthlyHours = userContext.attendance?.monthlyHours ?? 0;

    const totalWorkingHours = userContext.attendance?.totalWorkingHours ?? 0;

    const availablePeriods = [];

    if (hasValue(todayHours)) {
      availablePeriods.push({
        key: "today",
        label: "today",
      });
    }

    if (hasValue(weeklyHours)) {
      availablePeriods.push({
        key: "week",
        label: "this week",
      });
    }

    if (hasValue(monthlyHours)) {
      availablePeriods.push({
        key: "month",
        label: "this month",
      });
    }

    if (hasValue(totalWorkingHours)) {
      availablePeriods.push({
        key: "total",
        label: "your total working hours",
      });
    }

    // ----------------------------------------------
    // No working hours
    // ----------------------------------------------

    if (availablePeriods.length === 0) {
      context.attendance = {
        workingHoursStatus: "none",
        todayHours: 0,
        weeklyHours: 0,
        monthlyHours: 0,
        totalWorkingHours: 0,
      };
    }

    // ----------------------------------------------
    // Only one period exists
    // ----------------------------------------------
    else if (availablePeriods.length === 1) {
      const period = availablePeriods[0].key;

      if (period === "today") {
        context.attendance = {
          workingHoursPeriod: "today",
          workingHours: todayHours,
        };
      } else if (period === "week") {
        context.attendance = {
          workingHoursPeriod: "week",
          workingHours: weeklyHours,
        };
      } else if (period === "month") {
        context.attendance = {
          workingHoursPeriod: "month",
          workingHours: monthlyHours,
        };
      } else if (period === "total") {
        context.attendance = {
          workingHoursPeriod: "total",
          workingHours: totalWorkingHours,
        };
      }
    }

    // ----------------------------------------------
    // Multiple periods exist
    // ----------------------------------------------
    else {
      const labels = availablePeriods.map((period) => period.label);

      let message;

      if (labels.length === 2) {
        message = `Do you want to know your working hours for ${labels[0]} or ${labels[1]}?`;
      } else if (labels.length === 3) {
        message = `Do you want to know your working hours for ${labels[0]}, ${labels[1]}, or ${labels[2]}?`;
      } else {
        message = `Do you want to know your working hours for ${labels[0]}, ${labels[1]}, ${labels[2]}, or ${labels[3]}?`;
      }

      context.clarification = {
        type: "workingHoursPeriod",
        message,
      };
    }
  }

  // ==================================================
  // FOLLOW-UP QUESTIONS
  // ==================================================

  const evaluationKeywords = [
    "is that good",
    "is that bad",
    "is this good",
    "is this bad",
  ];

  const improvementKeywords = [
    "how can i improve it",
    "how can i improve that",
    "how do i improve it",
    "how do i improve that",
  ];

  const detailKeywords = ["what about it", "tell me more about it"];

  const isEvaluationFollowUp = evaluationKeywords.some((keyword) =>
    question.includes(keyword),
  );

  const isImprovementFollowUp = improvementKeywords.some((keyword) =>
    question.includes(keyword),
  );

  const isDetailFollowUp = detailKeywords.some((keyword) =>
    question.includes(keyword),
  );

  const isFollowUpQuestion =
    isEvaluationFollowUp || isImprovementFollowUp || isDetailFollowUp;

  if (isFollowUpQuestion && Object.keys(context).length === 0) {
    for (let i = conversation.length - 1; i >= 0; i--) {
      const previousMessage = conversation[i];

      if (previousMessage.role !== "user") {
        continue;
      }

      const previousContext = getRequestedContext(
        previousMessage.content,
        userContext,
        [],
      );

      if (Object.keys(previousContext).length > 0) {
        // ---------- Attendance ----------

        if (previousContext.attendance?.percentage !== undefined) {
          context.followUp = {
            metric: "attendance",
            value: previousContext.attendance.percentage,
          };
        }

        // ---------- Total Working Hours ----------
        else if (previousContext.attendance?.totalWorkingHours !== undefined) {
          context.followUp = {
            metric: "totalWorkingHours",
            value: previousContext.attendance.totalWorkingHours,
          };
        }

        // ---------- Average Daily Hours ----------
        else if (previousContext.attendance?.averageDailyHours !== undefined) {
          context.followUp = {
            metric: "averageDailyHours",
            value: previousContext.attendance.averageDailyHours,
          };
        }

        // ---------- Leaves ----------
        else if (previousContext.attendance?.leavesTaken !== undefined) {
          context.followUp = {
            metric: "leavesTaken",
            value: previousContext.attendance.leavesTaken,
          };
        }

        // ---------- Overtime ----------
        else if (previousContext.attendance?.overtimeHours !== undefined) {
          context.followUp = {
            metric: "overtimeHours",
            value: previousContext.attendance.overtimeHours,
          };
        }

        // ---------- Productivity ----------
        else if (previousContext.productivity?.percentage !== undefined) {
          context.followUp = {
            metric: "productivity",
            value: previousContext.productivity.percentage,
          };
        }

        // ---------- Weekly Hours ----------
        else if (previousContext.weeklyHours !== undefined) {
          context.followUp = {
            metric: "weeklyHours",
            value: previousContext.weeklyHours,
          };
        }

        // ---------- Monthly Hours ----------
        else if (previousContext.monthlyHours !== undefined) {
          context.followUp = {
            metric: "monthlyHours",
            value: previousContext.monthlyHours,
          };
        }

        // ---------- Current Streak ----------
        else if (previousContext.currentStreak !== undefined) {
          context.followUp = {
            metric: "currentStreak",
            value: previousContext.currentStreak,
          };
        }

        // ---------- Longest Streak ----------
        else if (previousContext.longestStreak !== undefined) {
          context.followUp = {
            metric: "longestStreak",
            value: previousContext.longestStreak,
          };
        }

        // ---------- Punctuality ----------
        else if (previousContext.punctuality !== undefined) {
          context.followUp = {
            metric: "punctuality",
            value: previousContext.punctuality,
          };
        }

        // ---------- Break Score ----------
        else if (previousContext.breakScore !== undefined) {
          context.followUp = {
            metric: "breakScore",
            value: previousContext.breakScore,
          };
        }

        // ---------- Weekly Goal ----------
        else if (previousContext.weeklyGoal) {
          context.followUp = {
            metric: "weeklyGoal",
            value: previousContext.weeklyGoal,
          };
        }

        // ---------- Average Check-in ----------
        else if (previousContext.averageCheckIn !== undefined) {
          context.followUp = {
            metric: "averageCheckIn",
            value: previousContext.averageCheckIn,
          };
        }

        // ---------- Average Break ----------
        else if (previousContext.averageBreakDuration !== undefined) {
          context.followUp = {
            metric: "averageBreakDuration",
            value: previousContext.averageBreakDuration,
          };
        }

        if (context.followUp) {
          if (isEvaluationFollowUp) {
            context.followUp.type = "evaluation";
          } else if (isImprovementFollowUp) {
            context.followUp.type = "improvement";
          } else if (isDetailFollowUp) {
            context.followUp.type = "details";
          }

          break;
        }
      }
    }

    // ---------- Unknown Follow-up ----------

    if (!context.followUp) {
      context.followUp = {
        type: "unknown",
        metric: null,
        value: null,
      };
    }
  }

  return context;
};

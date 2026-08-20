export const getRequestedContext = (
  message,
  userContext,
  conversation = [],
) => {
  const question = message.toLowerCase();
  const lower = message.toLowerCase();

  const context = {};

  // ==================================================
  // Helper: Check whether a value actually exists
  // ==================================================

  const hasValue = (value) => typeof value === "number" && value > 0;

  // ==================================================
  // WORKING HOURS CLARIFICATION FOLLOW-UP
  // ==================================================

  const todayHours = Number(userContext.attendance?.todayHours ?? 0);

  const weeklyHours = Number(userContext.attendance?.weeklyHours ?? 0);

  const monthlyHours = Number(userContext.attendance?.monthlyHours ?? 0);

  const totalWorkingHours = Number(
    userContext.attendance?.totalWorkingHours ?? 0,
  );

  // ==================================================
  // Direct Period Selection
  // ==================================================
  //
  // These are the choices WiseBot gives after:
  // "Do you want to know your working hours
  //  for this week, this month, or your total
  //  working hours?"
  //
  // We handle them directly so they don't depend
  // on conversation-history detection.
  // ==================================================

  if (lower === "today" || lower === "for today") {
    return {
      attendance: {
        workingHoursPeriod: "today",
        workingHours: todayHours,
      },
    };
  }

  if (lower === "week" || lower === "this week" || lower === "weekly") {
    return {
      attendance: {
        workingHoursPeriod: "week",
        workingHours: weeklyHours,
      },
    };
  }

  if (
    lower === "month" ||
    lower === "this month" ||
    lower === "monthly" ||
    lower === "this month's"
  ) {
    return {
      attendance: {
        workingHoursPeriod: "month",
        workingHours: monthlyHours,
      },
    };
  }

  if (
    lower === "total" ||
    lower === "total hours" ||
    lower === "total working hours" ||
    lower === "all time" ||
    lower === "overall"
  ) {
    return {
      attendance: {
        workingHoursPeriod: "total",
        workingHours: totalWorkingHours,
      },
    };
  }

  // ==================================================
  // OVERTIME CLARIFICATION FOLLOW-UP
  // ==================================================

  const lastOvertimeClarification = [...conversation]
    .reverse()
    .find((message) => {
      if (message.role !== "assistant") return false;

      const content = message.content?.toLowerCase() || "";

      return (
        content.includes("overtime") &&
        content.includes("this month") &&
        content.includes("total")
      );
    });

  if (lastOvertimeClarification) {
    const monthlyOvertime = userContext.attendance?.overtimeHours ?? 0;

    const totalOvertime = userContext.attendance?.totalOvertimeHours ?? 0;

    // ---------- This Month ----------

    if (
      lower === "this month" ||
      lower === "month" ||
      lower === "monthly" ||
      lower === "this month's"
    ) {
      if (hasValue(monthlyOvertime)) {
        return {
          attendance: {
            overtimePeriod: "month",
            overtimeHours: monthlyOvertime,
          },
        };
      }

      return {
        attendance: {
          overtimePeriod: "month",
          overtimeHours: 0,
          overtimeStatus: "none",
        },
      };
    }

    // ---------- Total ----------

    if (
      lower === "total" ||
      lower === "total overtime" ||
      lower === "total overtime hours" ||
      lower === "all time"
    ) {
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
          overtimePeriod: "total",
          overtimeHours: 0,
          overtimeStatus: "none",
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

  const isCalendarQuestion =
    lower.includes("event") ||
    lower.includes("events") ||
    lower.includes("calendar") ||
    lower.includes("festival") ||
    lower.includes("festivals") ||
    lower.includes("holiday") ||
    lower.includes("holidays") ||
    lower.includes("diwali") ||
    lower.includes("holi") ||
    lower.includes("navratri") ||
    lower.includes("dussehra") ||
    lower.includes("dussera") ||
    lower.includes("janmashtami") ||
    lower.includes("raksha bandhan") ||
    lower.includes("rakhi") ||
    lower.includes("ganesh") ||
    lower.includes("ganesh chaturthi") ||
    lower.includes("christmas") ||
    lower.includes("eid") ||
    lower.includes("independence day") ||
    lower.includes("republic day") ||
    lower.includes("birthday") ||
    lower.includes("meeting") ||
    lower.includes("appointment") ||
    lower.includes("tomorrow") ||
    lower.includes("today");

  if (isCalendarQuestion) {
    const matchingEvents = calendarEvents;
    const matchingHolidays = calendarHolidays;

    context.calendar = {
      events: matchingEvents,
      holidays: matchingHolidays,
    };
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
      lower.includes("count"))
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
    question.includes("day streak")
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

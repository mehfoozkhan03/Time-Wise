export const getRequestedContext = (
  message,
  userContext,
  conversation = [],
) => {
  const question = message.toLowerCase();

  const context = {};

  // ---------- Attendance ----------

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

  // ---------- Productivity ----------

  if (question.includes("productivity") || question.includes("productive")) {
    context.productivity = {
      percentage: userContext.productivity.percentage,
    };
  }

  // ---------- Weekly Hours ----------

  if (
    question.includes("weekly hours") ||
    question.includes("hours this week") ||
    question.includes("worked this week")
  ) {
    context.weeklyHours = userContext.attendance.weeklyHours;
  }

  // ---------- Monthly Hours ----------

  if (
    question.includes("monthly hours") ||
    question.includes("hours this month") ||
    question.includes("worked this month")
  ) {
    context.monthlyHours = userContext.attendance.monthlyHours;
  }

  // ---------- Current Streak ----------

  if (
    question.includes("current streak") ||
    question.includes("my streak") ||
    question.includes("day streak")
  ) {
    context.currentStreak = userContext.streak.current;
  }

  // ---------- Longest Streak ----------

  if (question.includes("longest streak") || question.includes("best streak")) {
    context.longestStreak = userContext.streak.longest;
  }

  // ---------- Punctuality ----------

  if (question.includes("punctuality") || question.includes("punctual")) {
    context.punctuality = userContext.productivity.punctuality;
  }

  // ---------- Break Score ----------

  if (
    question.includes("break score") ||
    question.includes("break discipline")
  ) {
    context.breakScore = userContext.productivity.breakScore;
  }

  // ---------- Weekly Goal ----------

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

  // ---------- Average Check-in ----------

  if (
    question.includes("average check in") ||
    question.includes("average check-in") ||
    question.includes("average checkin")
  ) {
    context.averageCheckIn = userContext.work.averageCheckIn;
  }

  // ---------- Average Break ----------

  if (
    question.includes("average break") ||
    question.includes("break duration")
  ) {
    context.averageBreakDuration = userContext.work.averageBreakDuration;
  }

  // ---------- Overall Performance ----------

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

  // ---------- Follow-up Questions ----------

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
        if (previousContext.attendance) {
          context.followUp = {
            metric: "attendance",
            value: previousContext.attendance.percentage,
          };
        } else if (previousContext.productivity) {
          context.followUp = {
            metric: "productivity",
            value: previousContext.productivity.percentage,
          };
        } else if (previousContext.weeklyHours !== undefined) {
          context.followUp = {
            metric: "weeklyHours",
            value: previousContext.weeklyHours,
          };
        } else if (previousContext.monthlyHours !== undefined) {
          context.followUp = {
            metric: "monthlyHours",
            value: previousContext.monthlyHours,
          };
        } else if (previousContext.currentStreak !== undefined) {
          context.followUp = {
            metric: "currentStreak",
            value: previousContext.currentStreak,
          };
        } else if (previousContext.longestStreak !== undefined) {
          context.followUp = {
            metric: "longestStreak",
            value: previousContext.longestStreak,
          };
        } else if (previousContext.punctuality !== undefined) {
          context.followUp = {
            metric: "punctuality",
            value: previousContext.punctuality,
          };
        } else if (previousContext.breakScore !== undefined) {
          context.followUp = {
            metric: "breakScore",
            value: previousContext.breakScore,
          };
        } else if (previousContext.weeklyGoal) {
          context.followUp = {
            metric: "weeklyGoal",
            value: previousContext.weeklyGoal,
          };
        } else if (previousContext.averageCheckIn !== undefined) {
          context.followUp = {
            metric: "averageCheckIn",
            value: previousContext.averageCheckIn,
          };
        } else if (previousContext.averageBreakDuration !== undefined) {
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

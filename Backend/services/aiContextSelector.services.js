export const getRequestedContext = (message, userContext) => {
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

  return context;
};

import { getAttendanceStats } from "./attendanceStats.service.js";

export const getAIUserContext = async (userID) => {
  const stats = await getAttendanceStats(userID);

  return {
    attendance: {
      percentage: stats.attendancePercentage,
      weeklyHours: stats.weeklyHours,
      monthlyHours: stats.monthlyHours,
    },

    productivity: {
      percentage: stats.productivity,
      punctuality: stats.punctuality,
      breakScore: stats.breakScore,
    },

    streak: {
      current: stats.dayStreak,
      longest: stats.longestStreak,
    },

    goals: {
      weeklyTarget: stats.weeklyTarget,
      weeklyHoursRemaining: stats.weeklyHoursRemaining,
      weeklyGoalPercentage: stats.weeklyGoalPercentage,
      weeklyGoalScore: stats.weeklyGoalScore,
    },

    work: {
      averageCheckIn: stats.averageCheckIn,
      averageBreakDuration: stats.averageBreakDuration,
    },
  };
};

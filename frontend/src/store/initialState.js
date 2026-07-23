const initialState = {
  dateRange: "month",

  searchLog: "",

  statusFilter: "all",

  activeTab: "hours",

  dashboardStats: {
    dayStreak: 0,
    longestStreak: 0,

    attendancePercentage: 0,

    weeklyHours: 0,
    monthlyHours: 0,

    productivity: 0,

    punctuality: 0,
    breakScore: 0,
    weeklyGoalScore: 0,

    weeklyTarget: 0,
    weeklyHoursRemaining: 0,
    weeklyGoalPercentage: 0,

    averageCheckIn: "--:--",
    averageBreakDuration: 0,
  },

  attendanceLog: [],

  dailyHoursData: [],

  weeklyData: [],

  productivityData: [],

  attendanceDistribution: [],

  calendarData: [],

  badges: [],

  goals: [],

  insights: [],
};

export default initialState;

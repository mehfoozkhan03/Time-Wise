import { createSlice } from "@reduxjs/toolkit";

import initialState from "./initialState";

const reportsSlice = createSlice({
  name: "reports",

  initialState,

  reducers: {
    setDateRange(state, action) {
      state.dateRange = action.payload;
    },

    setSearchLog(state, action) {
      state.searchLog = action.payload;
    },

    setStatusFilter(state, action) {
      state.statusFilter = action.payload;
    },

    setActiveTab(state, action) {
      state.activeTab = action.payload;
    },

    setDashboardStats(state, action) {
      state.dashboardStats = action.payload;
    },

    setAttendanceLog(state, action) {
      state.attendanceLog = action.payload;
    },

    setDailyHoursData(state, action) {
      state.dailyHoursData = action.payload;
    },

    setWeeklyData(state, action) {
      state.weeklyData = action.payload;
    },

    setProductivityData(state, action) {
      state.productivityData = action.payload;
    },

    setAttendanceDistribution(state, action) {
      state.attendanceDistribution = action.payload;
    },

    setCalendarData(state, action) {
      state.calendarData = action.payload;
    },

    setBadges(state, action) {
      state.badges = action.payload;
    },

    setGoals(state, action) {
      state.goals = action.payload;
    },

    setInsights(state, action) {
      state.insights = action.payload;
    },
  },
});

export const {
  setDateRange,
  setSearchLog,
  setStatusFilter,
  setActiveTab,
  setDashboardStats,
  setAttendanceLog,
  setDailyHoursData,
  setWeeklyData,
  setProductivityData,
  setAttendanceDistribution,
  setCalendarData,
  setBadges,
  setGoals,
  setInsights,
} = reportsSlice.actions;

export default reportsSlice.reducer;

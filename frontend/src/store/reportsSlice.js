import { createSlice } from "@reduxjs/toolkit";
import initialState from "./initialState";

const reportsSlice = createSlice({
  name: "reports",

  initialState,

  reducers: {
    setDateRange(state, action) {
      state.dateRange = action.payload;
    },

    setCustomDateRange(state, action) {
      state.customStartDate = action.payload.startDate;
      state.customEndDate = action.payload.endDate;
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

  },
});

export const {
  setDateRange,
  setCustomDateRange,
  setSearchLog,
  setStatusFilter,
  setActiveTab,
  setDashboardStats,
  setAttendanceLog,
} = reportsSlice.actions;

export default reportsSlice.reducer;

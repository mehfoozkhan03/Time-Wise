import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import adminReportService from "../services/adminReportService";

// =====================================================
// FETCH WEEKLY ATTENDANCE
// =====================================================

export const fetchAdminWeeklyAttendance = createAsyncThunk(
  "adminReport/fetchWeeklyAttendance",
  async (_, { rejectWithValue }) => {
    try {
      const response = await adminReportService.getWeeklyAttendance();

      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch weekly attendance",
      );
    }
  },
);

// =====================================================
// FETCH DEPARTMENT HEADCOUNT
// =====================================================

export const fetchAdminDepartmentHeadcount = createAsyncThunk(
  "adminReport/fetchDepartmentHeadcount",
  async (_, { rejectWithValue }) => {
    try {
      const response = await adminReportService.getDepartmentHeadcount();

      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch department headcount",
      );
    }
  },
);

// =====================================================
// FETCH ATTENDANCE TREND
// =====================================================

export const fetchAdminAttendanceTrend = createAsyncThunk(
  "adminReport/fetchAttendanceTrend",
  async (_, { rejectWithValue }) => {
    try {
      const response = await adminReportService.getAttendanceTrend();

      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch attendance trend",
      );
    }
  },
);

// =====================================================
// INITIAL STATE
// =====================================================

const initialState = {
  weeklyAttendance: [],
  totalEmployees: 0,

  departments: [],

  attendanceTrend: [],

  loading: false,
  error: null,
};

// =====================================================
// SLICE
// =====================================================

const adminReportSlice = createSlice({
  name: "adminReport",

  initialState,

  reducers: {
    clearAdminReportError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // ==============================================
      // WEEKLY ATTENDANCE
      // ==============================================

      .addCase(fetchAdminWeeklyAttendance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchAdminWeeklyAttendance.fulfilled, (state, action) => {
        state.loading = false;

        state.weeklyAttendance = action.payload?.weeklyAttendance || [];

        state.totalEmployees = action.payload?.totalEmployees || 0;
      })

      .addCase(fetchAdminWeeklyAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ==============================================
      // DEPARTMENT HEADCOUNT
      // ==============================================

      .addCase(fetchAdminDepartmentHeadcount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchAdminDepartmentHeadcount.fulfilled, (state, action) => {
        state.loading = false;

        state.departments = action.payload?.departments || [];

        state.totalEmployees =
          action.payload?.totalEmployees || state.totalEmployees;
      })

      .addCase(fetchAdminDepartmentHeadcount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ==============================================
      // ATTENDANCE TREND
      // ==============================================

      .addCase(fetchAdminAttendanceTrend.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchAdminAttendanceTrend.fulfilled, (state, action) => {
        state.loading = false;

        state.attendanceTrend = action.payload?.weeks || [];
      })

      .addCase(fetchAdminAttendanceTrend.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearAdminReportError } = adminReportSlice.actions;

export default adminReportSlice.reducer;

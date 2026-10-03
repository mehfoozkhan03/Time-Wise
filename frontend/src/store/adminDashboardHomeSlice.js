import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { adminDashboardHomeService } from "../services/adminDashboardHomeService";


//# ==================== FETCH ADMIN DASHBOARD STATS ========================
export const fetchAdminDashboardHomeStats = createAsyncThunk(
  "adminDashboard/fetchStats",
  async (_, { rejectWithValue }) => {
    try {
      const response =
        await adminDashboardHomeService.getDashboardStats();

      return response.data.stats;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch admin dashboard stats"
      );
    }
  }
);


//# ====================== INITIAL STATE ===========================
const initialState = {
  stats: {
    totalEmployees: 0,
    totalPresentToday: 0,
    totalAbsentToday: 0,
    totalLateCheckInsToday: 0,
    totalOnBreakToday: 0,
    weeklyAttendanceChart: [],
  },

  loading: false,
  error: null,
};


//# ========================= SLICE ===============================
const adminDashboardHomeSlice = createSlice({
  name: "adminDashboard",
  initialState,
  reducers: {
    clearAdminDashboardError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      //# ----------------- PENDING ----------------------
      .addCase(fetchAdminDashboardHomeStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })


      //# ----------------------- SUCCESS --------------------------
      .addCase(
        fetchAdminDashboardHomeStats.fulfilled,
        (state, action) => {
          state.loading = false;

          state.stats = {
            ...state.stats,
            ...action.payload,
          };

          state.error = null;
        }
      )


      //# ------------------------ ERROR ---------------------------
      .addCase(
        fetchAdminDashboardHomeStats.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      );
  },
});


export const {
  clearAdminDashboardError,
} = adminDashboardHomeSlice.actions;


export default adminDashboardHomeSlice.reducer;
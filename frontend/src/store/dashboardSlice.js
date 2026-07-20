import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { attendanceService } from '../services/attendanceService'

export const getDashboardStats = createAsyncThunk(
  'dashboard/getDashboardStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await attendanceService.getDashboardStats()

      return response.data.stats
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch dashboard stats',
      )
    }
  },
)

const initialState = {
  stats: {
    dayStreak: 0,
    attendancePercentage: 0,
    weeklyHours: 0,
    productivity: 0,
  },

  loading: false,

  error: null,
}

const dashboardSlice = createSlice({
  name: 'dashboard',

  initialState,

  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(getDashboardStats.pending, (state) => {
        state.loading = true
        state.error = null
      })

      .addCase(getDashboardStats.fulfilled, (state, action) => {
        state.loading = false
        state.stats = action.payload
      })

      .addCase(getDashboardStats.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export default dashboardSlice.reducer

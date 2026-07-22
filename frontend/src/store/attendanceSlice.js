import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { attendanceService } from '../services/attendanceService'

// ======================= THUNKS =======================

export const getTodayAttendance = createAsyncThunk(
  'attendance/getTodayAttendance',
  async (_, { rejectWithValue }) => {
    try {
      const response = await attendanceService.getTodayAttendance()
      return response.data.attendance
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch attendance',
      )
    }
  },
)

export const getAttendanceHistory = createAsyncThunk(
  'attendance/getAttendanceHistory',
  async (_, { rejectWithValue }) => {
    try {
      const response = await attendanceService.getAttendanceHistory()
      return response.data.attendance
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch attendance history',
      )
    }
  },
)

export const checkIn = createAsyncThunk(
  'attendance/checkIn',
  async (_, { rejectWithValue }) => {
    try {
      const response = await attendanceService.checkIn()
      return response.data.attendance
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Check in failed')
    }
  },
)

export const startBreak = createAsyncThunk(
  'attendance/startBreak',
  async (_, { rejectWithValue }) => {
    try {
      const response = await attendanceService.startBreak()
      return response.data.attendance
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to start break',
      )
    }
  },
)

export const endBreak = createAsyncThunk(
  'attendance/endBreak',
  async (_, { rejectWithValue }) => {
    try {
      const response = await attendanceService.endBreak()
      return response.data.attendance
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to end break',
      )
    }
  },
)

export const checkOut = createAsyncThunk(
  'attendance/checkOut',
  async (_, { rejectWithValue }) => {
    try {
      const response = await attendanceService.checkOut()
      return response.data.attendance
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Check out failed',
      )
    }
  },
)

// ======================= INITIAL STATE =======================

const initialState = {
  today: null,

  history: [],

  loading: false,

  error: null,
}

// ======================= SLICE =======================

const attendanceSlice = createSlice({
  name: 'attendance',

  initialState,

  reducers: {
    clearAttendance(state) {
      state.today = null
      state.history = []
      state.loading = false
      state.error = null
    },
  },

  extraReducers: (builder) => {
    builder

      // ================= GET TODAY =================

      .addCase(getTodayAttendance.pending, (state) => {
        state.loading = true
        state.error = null
      })

      .addCase(getTodayAttendance.fulfilled, (state, action) => {
        state.loading = false
        state.today = action.payload
      })

      .addCase(getTodayAttendance.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // ================= HISTORY =================

      .addCase(getAttendanceHistory.pending, (state) => {
        state.loading = true
        state.error = null
      })

      .addCase(getAttendanceHistory.fulfilled, (state, action) => {
        state.loading = false
        state.history = action.payload
      })

      .addCase(getAttendanceHistory.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // ================= CHECK IN =================

      .addCase(checkIn.pending, (state) => {
        state.loading = true
        state.error = null
      })

      .addCase(checkIn.fulfilled, (state, action) => {
        state.loading = false
        state.today = action.payload
      })

      .addCase(checkIn.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // ================= START BREAK =================

      .addCase(startBreak.pending, (state) => {
        state.loading = true
        state.error = null
      })

      .addCase(startBreak.fulfilled, (state, action) => {
        state.loading = false
        state.today = action.payload
      })

      .addCase(startBreak.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // ================= END BREAK =================

      .addCase(endBreak.pending, (state) => {
        state.loading = true
        state.error = null
      })

      .addCase(endBreak.fulfilled, (state, action) => {
        state.loading = false
        state.today = action.payload
      })

      .addCase(endBreak.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // ================= CHECK OUT =================

      .addCase(checkOut.pending, (state) => {
        state.loading = true
        state.error = null
      })

      .addCase(checkOut.fulfilled, (state, action) => {
        state.loading = false
        state.today = action.payload
      })

      .addCase(checkOut.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { clearAttendance } = attendanceSlice.actions

export default attendanceSlice.reducer

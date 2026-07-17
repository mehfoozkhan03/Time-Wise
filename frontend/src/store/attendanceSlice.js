import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  today: null,

  requestStatus: 'idle',

  loading: false,

  error: null,
}

const attendanceSlice = createSlice({
  name: 'attendance',

  initialState,

  reducers: {
    setAttendance(state, action) {
      state.today = action.payload
    },

    setRequestStatus(state, action) {
      state.requestStatus = action.payload
    },

    setAttendanceLoading(state, action) {
      state.loading = action.payload
    },

    setAttendanceError(state, action) {
      state.error = action.payload
    },

    clearAttendance(state) {
      state.today = null
      state.requestStatus = 'idle'
      state.loading = false
      state.error = null
    },
  },
})

export const {
  setAttendance,
  setRequestStatus,
  setAttendanceLoading,
  setAttendanceError,
  clearAttendance,
} = attendanceSlice.actions

export default attendanceSlice.reducer

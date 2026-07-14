import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  today: null,

  status: 'idle',

  loading: false,
}

const attendanceSlice = createSlice({
  name: 'attendance',

  initialState,

  reducers: {
    setAttendance(state, action) {
      state.today = action.payload
    },

    setAttendanceStatus(state, action) {
      state.status = action.payload
    },

    setAttendanceLoading(state, action) {
      state.loading = action.payload
    },

    clearAttendance(state) {
      state.today = null
      state.status = 'idle'
    },
  },
})

export const {
  setAttendance,
  setAttendanceStatus,
  setAttendanceLoading,
  clearAttendance,
} = attendanceSlice.actions

export default attendanceSlice.reducer

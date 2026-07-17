import api from './api'

export const attendanceService = {
  checkIn() {
    return api.post('/attendance/checkin')
  },

  checkOut() {
    return api.post('/attendance/checkout')
  },

  startBreak() {
    return api.post('/attendance/break/start')
  },

  endBreak() {
    return api.post('/attendance/break/end')
  },

  getTodayAttendance() {
    return api.get('/attendance/today')
  },

  getAttendanceHistory() {
    return api.get('/attendance/history')
  },
}

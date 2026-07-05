import api from './api'

export const attendanceService = {
  checkIn() {
    return api.post('/attendance/checkin')
  },

  checkOut() {
    return api.post('/attendance/checkout')
  },

  startBreak() {
    return api.post('/attendance/start-break')
  },

  endBreak() {
    return api.post('/attendance/end-break')
  },

  getTodayAttendance() {
    return api.get('/attendance/today')
  },
}

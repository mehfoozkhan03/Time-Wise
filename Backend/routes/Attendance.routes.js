import express from 'express'
import { auth } from '../middleware/AuthMiddleware.js'
import {
  checkIn,
  startBreak,
  endBreak,
  checkOut,
  getTodayAttendance,
  getAttendanceHistory,
  getDashboardStats,
} from '../controllers/attendanceController.js'

const attendanceRouter = express.Router()

attendanceRouter.post('/checkin', auth, checkIn)

attendanceRouter.post('/break/start', auth, startBreak)

attendanceRouter.post('/break/end', auth, endBreak)

attendanceRouter.post('/checkout', auth, checkOut)

attendanceRouter.get('/today', auth, getTodayAttendance)

attendanceRouter.get('/history', auth, getAttendanceHistory)

attendanceRouter.get('/dashboard-stats', auth, getDashboardStats)

export { attendanceRouter }

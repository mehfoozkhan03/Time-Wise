import express from 'express';
import { auth } from '../middleware/AuthMiddleware.js';
import { authorize } from '../middleware/Allowrole.middleware.js';
import {
  checkIn,
  startBreak,
  endBreak,
  checkOut,
  getTodayAttendance,
  getAttendanceHistory,
  getDashboardStats,
} from '../controllers/attendance.controller.js';

const attendanceRouter = express.Router();

attendanceRouter.post('/checkin', auth,authorize("user"), checkIn);

attendanceRouter.post('/break/start', auth,authorize("user"), startBreak);

attendanceRouter.post('/break/end', auth,authorize("user"), endBreak);

attendanceRouter.post('/checkout', auth,authorize("user"), checkOut);

attendanceRouter.get('/today', auth,authorize("user"), getTodayAttendance);

attendanceRouter.get('/history', auth,authorize("user"), getAttendanceHistory);

attendanceRouter.get('/dashboard-stats', auth,authorize("user"), getDashboardStats);

export { attendanceRouter };

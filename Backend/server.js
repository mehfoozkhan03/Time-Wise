<<<<<<< HEAD
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
=======
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import http from "http";
import { initializeSocket } from "./socket/socket.js";

dotenv.config();

<<<<<<< HEAD
import { Connection } from "./config/db.js";
import { userRoutes } from "./routes/User.routes.js";
import postRoutes from "./routes/Post.routes.js";
import { attendanceRouter } from "./routes/Attendance.routes.js";
import calendarRoutes from "./routes/Calendar.routes.js";
import holidayRouter from "./routes/Holiday.routes.js";
import { contactRoute } from "./routes/Contact.routes.js";
import notificationRoute from "./routes/Notification.routes.js";
import aiRoutes from "./routes/Ai.routes.js";
=======
import { Connection } from './config/db.js';
import { userRoutes } from './routes/User.routes.js';
import postRoutes from './routes/Post.routes.js';
import { attendanceRouter } from './routes/Attendance.routes.js';
import calendarRoutes from './routes/Calendar.routes.js';
import holidayRouter from "./routes/Holiday.routes.js";
import { contactRoute } from './routes/Contact.routes.js';
import notificationRoute from './routes/Notification.routes.js';
>>>>>>> 2f5cb8235e940a7bee02d98a2a0eaab4a4b9edaf

const server = express();

const httpServer = http.createServer(server);

// Initialize Socket.IO
initializeSocket(httpServer);

/// ================= Middleware =================

server.use(
  cors({
    origin: [
<<<<<<< HEAD
      "http://localhost:8000",
      "http://localhost:5173",
      "http://localhost:5174",
=======
      'http://localhost:8000',
      'http://localhost:5173',
      'http://localhost:5174',
>>>>>>> 2f5cb8235e940a7bee02d98a2a0eaab4a4b9edaf
    ],
    credentials: true,
  }),
);

server.use(express.json(), express.text(), cookieParser());

// ================= Routes =================

<<<<<<< HEAD
server.use("/user", userRoutes);

server.use("/posts", postRoutes);

server.use("/attendance", attendanceRouter);
=======
server.use('/user', userRoutes);

server.use('/posts', postRoutes);

server.use('/attendance', attendanceRouter);
>>>>>>> 2f5cb8235e940a7bee02d98a2a0eaab4a4b9edaf

server.use('/calendar', calendarRoutes);

server.use("/holiday", holidayRouter);

server.use('/api/contact', contactRoute);

server.use("/notifications", notificationRoute);

server.use("/holiday", holidayRouter);

server.use("/api/contact", contactRoute);

server.use("/notifications", notificationRoute);

server.use("/ai", aiRoutes);

// ================= Server =================

// server.listen(process.env.Port, async () => {
//   try {
//     await Connection();
//     console.log('DB Connected successfully ✅');
//   } catch (error) {
//     console.log(error);
//     console.log('DB Crashed! Something went wrong ❌');
//   } finally {
//     console.log(`Server running on port ${process.env.Port}`);
//   }
// });

httpServer.listen(process.env.Port, async () => {
  try {
    await Connection();
    console.log("DB Connected successfully ✅");
  } catch (error) {
    console.log(error);
    console.log("DB Crashed! Something went wrong ❌");
  } finally {
    console.log(`Server running on port ${process.env.Port}`);
  }
});

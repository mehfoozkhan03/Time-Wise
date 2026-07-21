import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'

dotenv.config()

import { Connection } from './config/db.js'
import { userRoutes } from './routes/User.routes.js'
import { postRoutes } from './routes/Post.routes.js'
import { attendanceRouter } from './routes/Attendance.routes.js'
import calendarRoutes from "./routes/Calendar.routes.js";

const server = express()

/// ================= Middleware =================

server.use(
  cors({
    origin: ['http://localhost:9000','http://localhost:5173',"http://localhost:5174"],
    credentials: true,
  })
);

server.use(express.json(),express.text(),cookieParser())

// ================= Routes =================

server.use('/user', userRoutes)

server.use('/posts', postRoutes)

server.use('/attendance', attendanceRouter)

server.use("/calendar", calendarRoutes);

// ================= Server =================

server.listen(process.env.Port, async () => {
  try {
    await Connection()
    console.log('DB Connected successfully ✅')
  } catch (error) {
    console.log(error)
    console.log('DB Crashed! Something went wrong ❌')
  } finally {
    console.log(`Server running on port ${process.env.Port}`)
  }
})

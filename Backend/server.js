import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'

dotenv.config()

import { Connection } from './config/db.js'
import { userRoutes } from './Routes/User.routes.js'
import { auth } from './middleware/AuthMiddleware.js'

const server = express()

// ================= Middleware =================

server.use(
  cors({
    origin: 'http://localhost:5173', // Vite frontend
    credentials: true,
  }),
)

server.use(express.json())
server.use(express.text())
server.use(cookieParser())

// ================= Routes =================

server.use('/user', userRoutes)

// Protected Routes
server.use(auth)

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

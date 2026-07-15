import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'

dotenv.config()

import { Connection } from './config/db.js'
import { userRoutes } from './routes/User.routes.js'
import { postRoutes } from './routes/Post.routes.js'

const server = express()

/// ================= Middleware =================

server.use(cookieParser());
server.use(express.json());
server.use(express.text());

server.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

// ================= Routes =================

server.use("/user", userRoutes);

// server.use("/posts", postRoutes);
server.use('/posts', (req, res, next) => {
  console.log('SERVER HIT POSTS')
  next()
})

server.use('/posts', postRoutes)

// ================= Server =================

server.listen(process.env.Port, async () => {
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

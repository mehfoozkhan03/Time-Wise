import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();
import { Connection } from './config/db.js';
// import { blogRoutes } from './Routes/Blog.routes.js';
import { userRoutes } from './Routes/User.routes.js';
import { auth } from './middleware/AuthMiddleware.js';
// import { blogModel } from './model/Blog.model.js';

const server = express();

server.use(express.text(), express.json(), cors());

/* server.get('/', async (req, res) => {
  const blogs = await blogModel.find().populate('author');
  res.send(blogs);
}); */

// routes
server.use('/user', userRoutes);

// auth-check
server.use(auth);

// blog routes
// server.use('/blog', blogRoutes);

// server running
server.listen(process.env.Port, async () => {
  try {
    await Connection();
    console.log('DB Connected successfully✅');
  } catch (error) {
    console.log(`🚀 ~ error:`, error);
    console.log('DB Crashed! something went wrong ❌');
  } finally {
    console.log(`port is running on ${process.env.Port}`);
  }
});

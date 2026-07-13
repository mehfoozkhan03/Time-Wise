import express from 'express';

import {
  login,
  signup,
  admin_login,
  getCurrentUser,
} from '../controller/userData.js'
import { auth } from '../middleware/AuthMiddleware.js'

const userRoutes = express.Router();

userRoutes.get('/', (req, res) => {
  res.send("all user's");
});

// /user/signup

// /user/login

// /user/adminlogin

userRoutes.post('/signup', signup)

userRoutes.post('/login', login)

userRoutes.post('/adminlogin', admin_login)

userRoutes.get('/me', auth, getCurrentUser)

export { userRoutes };

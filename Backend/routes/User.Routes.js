import express from 'express';

import {
  admin_login,
  login,
  signup,
  getCurrentUser,
  updateTheme,
  logout,
} from '../controllers/userData.js';

import { auth } from '../middleware/AuthMiddleware.js';

const userRoutes = express.Router();

// /user/signup

// /user/login

// /user/adminlogin

// /user/me

userRoutes.post('/login', login);

userRoutes.post('/signup', signup);

userRoutes.post('/logout', logout);

userRoutes.get('/me', auth, getCurrentUser);

userRoutes.patch('/theme', auth, updateTheme);

userRoutes.post('/adminlogin', admin_login);

// userRoutes.get('/alluser', auth, getAllUser)

export { userRoutes };

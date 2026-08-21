import express from 'express';

import {
  admin_login,
  login,
  signup,
  getCurrentUser,
  updateTheme,
  logout,
  getUserProfile,
  getAllUser,
  updateActivity,
} from '../controllers/userData.controller.js';

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

userRoutes.get('/users', auth, getAllUser);

userRoutes.patch("/activity", auth, updateActivity);

userRoutes.get('/profile/:userId', auth, getUserProfile);

userRoutes.patch('/theme', auth, updateTheme);

userRoutes.post('/adminlogin', admin_login);


export { userRoutes };

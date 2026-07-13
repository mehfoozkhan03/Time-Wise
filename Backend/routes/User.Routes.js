import express from 'express';

import {
  login,
  signup,
  admin_login,
  getCurrentUser,
} from '../controller/userData.js';
import { auth } from '../middleware/AuthMiddleware.js';

const userRoutes = express.Router();

// /user/signup

// /user/login

// /user/adminlogin

// /user/me

userRoutes.post('/signup', signup);

userRoutes.post('/login', login);

userRoutes.post('/adminlogin', admin_login);

userRoutes.get('/me', auth, getCurrentUser);

export { userRoutes };

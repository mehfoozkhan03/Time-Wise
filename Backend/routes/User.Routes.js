import express from 'express'

import {
  admin_login,
  login,
  signup,
  getCurrentUser,
  updateTheme,
} from '../controllers/userData.js'
import { auth } from '../middleware/AuthMiddleware.js'

const userRoutes = express.Router()

// /user/signup

// /user/login

// /user/adminlogin

// /user/me

userRoutes.post('/signup', signup)

userRoutes.post('/login', login)

userRoutes.post('/adminlogin', admin_login)

userRoutes.get('/me', auth, getCurrentUser);

userRoutes.patch("/theme", auth, updateTheme);

// userRoutes.get('/alluser', auth, getAllUser)

export { userRoutes }

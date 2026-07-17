import express from 'express'

import {
  createPost,
  getAllPosts,
  getFeaturedThought,
} from '../controllers/postData.js'

import { auth } from '../middleware/AuthMiddleware.js'

const postRoutes = express.Router()

// Create Post
postRoutes.post('/', auth, createPost)

// Get All Posts
postRoutes.get('/', auth, getAllPosts)

// Featured Thought
postRoutes.get('/featured', auth, getFeaturedThought)

export { postRoutes }

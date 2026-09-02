import express from 'express'

import {
  createPost,
  deletePost,
  getAllPosts,
  getFeaturedThought,
  getPost,
  updatePost,
} from '../controllers/post.controller.js'

import {
  togglePostLike,
  toggleCommentLike,
} from '../controllers/like.controller.js'

import {
  createComment,
  deleteComment,
  getComments,
  updateComment,
} from '../controllers/comment.controller.js'

import { toggleSavedPost } from '../controllers/savedPost.controller.js'

import { auth } from '../middleware/AuthMiddleware.js'

import { uploadPostFiles } from '../middleware/postUpload.middleware.js'

const router = express.Router()

router.get('/test-save', (req, res) => {
  res.json({
    message: 'Save route is working',
  })
})

router.use(auth)

// =======================================================
// Posts
// =======================================================

router.post(
  '/',
  uploadPostFiles.fields([
    { name: 'images', maxCount: 4 },
    { name: 'attachments', maxCount: 5 },
  ]),
  createPost,
)

router.get('/', getAllPosts)

router.get('/featured', getFeaturedThought)

// router.get('/trending', getTrendingPosts)

// router.get('/search', searchPosts)

router.get('/:id', getPost)

router.patch('/:id', updatePost)

router.delete('/:id', deletePost)

// =======================================================
// Save Post
// =======================================================

router.post('/:postId/save', toggleSavedPost)

// =======================================================
// Post Likes
// =======================================================

router.post('/:id/like', togglePostLike)

// =======================================================
// Comments
// =======================================================

router.post('/:id/comments', createComment)

router.get('/:id/comments', getComments)

router.patch('/comments/:commentId', updateComment)

router.delete('/comments/:commentId', deleteComment)

// =======================================================
// Comment Likes
// =======================================================

router.post('/comments/:commentId/like', toggleCommentLike)

// =======================================================
// Contributors
// =======================================================

// router.get('/contributors/top', getTopContributors)

export default router

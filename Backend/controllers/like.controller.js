import mongoose from 'mongoose'

import { likeModel } from '../models/Like.model.js'
import { postModel } from '../models/Post.model.js'
import { commentModel } from '../models/Comment.model.js'

// =======================================================
// Toggle Post Like
// =======================================================

export const togglePostLike = async (req, res) => {
  const session = await mongoose.startSession()

  try {
    session.startTransaction()

    const { id } = req.params

    const userId = req.user.userID

    const post = await postModel
      .findOne({
        _id: id,
        isDeleted: false,
      })
      .session(session)

    if (!post) {
      await session.abortTransaction()

      return res.status(404).json({
        success: false,
        message: 'Post not found.',
      })
    }

    const existingLike = await likeModel
      .findOne({
        user: userId,
        targetType: 'post',
        targetId: id,
      })
      .session(session)

    if (existingLike) {
      await likeModel.deleteOne(
        {
          _id: existingLike._id,
        },
        {
          session,
        },
      )

      post.likesCount = Math.max(post.likesCount - 1, 0)

      await post.save({ session })

      await session.commitTransaction()

      return res.status(200).json({
        success: true,
        liked: false,
        likesCount: post.likesCount,
      })
    }

    await likeModel.create(
      [
        {
          user: userId,
          targetType: 'post',
          targetId: id,
        },
      ],
      {
        session,
      },
    )

    post.likesCount += 1

    await post.save({ session })

    await session.commitTransaction()

    return res.status(200).json({
      success: true,
      liked: true,
      likesCount: post.likesCount,
    })
  } catch (error) {
    await session.abortTransaction()

    console.error(error)

    return res.status(500).json({
      success: false,
      message: 'Unable to update like.',
    })
  } finally {
    session.endSession()
  }
}

// =======================================================
// Toggle Comment Like
// =======================================================

export const toggleCommentLike = async (req, res) => {
  const session = await mongoose.startSession()

  try {
    session.startTransaction()

    const { commentId } = req.params

    const userId = req.user.userID

    const comment = await commentModel
      .findOne({
        _id: commentId,
        isDeleted: false,
      })
      .session(session)

    if (!comment) {
      await session.abortTransaction()

      return res.status(404).json({
        success: false,
        message: 'Comment not found.',
      })
    }

    const existingLike = await likeModel
      .findOne({
        user: userId,
        targetType: 'comment',
        targetId: commentId,
      })
      .session(session)

    if (existingLike) {
      await likeModel.deleteOne(
        {
          _id: existingLike._id,
        },
        {
          session,
        },
      )

      comment.likesCount = Math.max(comment.likesCount - 1, 0)

      await comment.save({ session })

      await session.commitTransaction()

      return res.status(200).json({
        success: true,
        liked: false,
        likesCount: comment.likesCount,
      })
    }

    await likeModel.create(
      [
        {
          user: userId,
          targetType: 'comment',
          targetId: commentId,
        },
      ],
      {
        session,
      },
    )

    comment.likesCount += 1

    await comment.save({ session })

    await session.commitTransaction()

    return res.status(200).json({
      success: true,
      liked: true,
      likesCount: comment.likesCount,
    })
  } catch (error) {
    await session.abortTransaction()

    console.error(error)

    return res.status(500).json({
      success: false,
      message: 'Unable to update like.',
    })
  } finally {
    session.endSession()
  }
}

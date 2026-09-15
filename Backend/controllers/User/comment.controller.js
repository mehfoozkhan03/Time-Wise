import mongoose from 'mongoose'

import { commentModel } from '../../models/Comment.model.js'
import { postModel } from '../../models/Post.model.js'
import { likeModel } from '../../models/Like.model.js'
import { userModel } from '../../models/User.model.js'

import { createNotification } from '../../services/notification.service.js'

// =======================================================
// CONSTANTS
// =======================================================

const COMMENT_AUTHOR_FIELDS =
  'firstName lastName profileImage designation department'

const MAX_COMMENT_LENGTH = 500

// =======================================================
// CREATE COMMENT
// =======================================================

export const createComment = async (req, res) => {
  const session = await mongoose.startSession()

  try {
    const { id: postId } = req.params
    const { text } = req.body
    const userId = req.user.userID

    const trimmedText = text?.trim()

    // ---------------------------------------------------
    // Validation
    // ---------------------------------------------------

    if (!trimmedText) {
      return res.status(400).json({
        success: false,
        message: 'Comment cannot be empty.',
      })
    }

    if (trimmedText.length > MAX_COMMENT_LENGTH) {
      return res.status(400).json({
        success: false,
        message: `Comment cannot exceed ${MAX_COMMENT_LENGTH} characters.`,
      })
    }

    // ---------------------------------------------------
    // Start transaction
    // ---------------------------------------------------

    session.startTransaction()

    // ---------------------------------------------------
    // Find post
    // ---------------------------------------------------

    const post = await postModel
      .findOne({
        _id: postId,
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

    // ---------------------------------------------------
    // Check comments permission
    // ---------------------------------------------------

    if (!post.allowComments) {
      await session.abortTransaction()

      return res.status(403).json({
        success: false,
        message: 'Comments are disabled for this post.',
      })
    }

    // ---------------------------------------------------
    // Create comment
    // ---------------------------------------------------

    const [comment] = await commentModel.create(
      [
        {
          post: postId,
          createdBy: userId,
          text: trimmedText,
        },
      ],
      { session },
    )

    // ---------------------------------------------------
    // Increment comment count
    // ---------------------------------------------------

    await postModel.updateOne(
      { _id: postId },
      {
        $inc: {
          commentsCount: 1,
        },
      },
      { session },
    )

    // ---------------------------------------------------
    // Create notification
    // ---------------------------------------------------

    if (post.createdBy.toString() !== userId.toString()) {
      const currentUser = await userModel
        .findById(userId)
        .select('firstName lastName')
        .lean()

      if (currentUser) {
        await createNotification({
          sender: userId,
          title: 'New Comment',
          message: `${currentUser.firstName} ${currentUser.lastName} commented on your post.`,
          type: 'post',
          referenceModel: 'Post',
          referenceId: post._id,
          audienceType: 'specific',
          targetUsers: [post.createdBy],
        })
      }
    }

    // ---------------------------------------------------
    // Commit transaction
    // ---------------------------------------------------

    await session.commitTransaction()

    // ---------------------------------------------------
    // Populate comment
    // ---------------------------------------------------

    const populatedComment = await commentModel
      .findById(comment._id)
      .populate('createdBy', COMMENT_AUTHOR_FIELDS)
      .lean()

    return res.status(201).json({
      success: true,
      message: 'Comment added successfully.',
      comment: {
        ...populatedComment,
        isLiked: false,
      },
    })
  } catch (error) {
    if (session.inTransaction()) {
      await session.abortTransaction()
    }

    console.error('Create Comment Error:', error)

    return res.status(500).json({
      success: false,
      message: 'Unable to add comment.',
    })
  } finally {
    await session.endSession()
  }
}

// =======================================================
// GET COMMENTS
// =======================================================

export const getComments = async (req, res) => {
  try {
    const { id: postId } = req.params
    const userId = req.user.userID

    const page = Math.max(parseInt(req.query.page, 10) || 1, 1)

    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 10, 1), 50)

    const skip = (page - 1) * limit

    // ---------------------------------------------------
    // Run independent queries in parallel
    // ---------------------------------------------------

    const [totalComments, comments] = await Promise.all([
      commentModel.countDocuments({
        post: postId,
        isDeleted: false,
      }),

      commentModel
        .find({
          post: postId,
          isDeleted: false,
        })
        .populate('createdBy', COMMENT_AUTHOR_FIELDS)
        .sort({ createdAt: 1 })
        .skip(skip)
        .limit(limit)
        .lean(),
    ])

    // ---------------------------------------------------
    // Find comments liked by current user
    // ---------------------------------------------------

    const commentIds = comments.map((comment) => comment._id)

    const likedComments =
      commentIds.length > 0
        ? await likeModel
            .find({
              user: userId,
              targetType: 'comment',
              targetId: {
                $in: commentIds,
              },
            })
            .select('targetId')
            .lean()
        : []

    const likedSet = new Set(
      likedComments.map((like) => like.targetId.toString()),
    )

    // ---------------------------------------------------
    // Format response
    // ---------------------------------------------------

    const formattedComments = comments.map((comment) => ({
      ...comment,
      isLiked: likedSet.has(comment._id.toString()),
    }))

    return res.status(200).json({
      success: true,
      page,
      totalComments,
      totalPages: Math.ceil(totalComments / limit),
      comments: formattedComments,
    })
  } catch (error) {
    console.error('Get Comments Error:', error)

    return res.status(500).json({
      success: false,
      message: 'Unable to fetch comments.',
    })
  }
}

// =======================================================
// UPDATE COMMENT
// =======================================================

export const updateComment = async (req, res) => {
  try {
    const { commentId } = req.params
    const userId = req.user.userID
    const { text } = req.body

    const trimmedText = text?.trim()

    // ---------------------------------------------------
    // Validation
    // ---------------------------------------------------

    if (!trimmedText) {
      return res.status(400).json({
        success: false,
        message: 'Comment cannot be empty.',
      })
    }

    if (trimmedText.length > MAX_COMMENT_LENGTH) {
      return res.status(400).json({
        success: false,
        message: `Comment cannot exceed ${MAX_COMMENT_LENGTH} characters.`,
      })
    }

    // ---------------------------------------------------
    // Find comment
    // ---------------------------------------------------

    const comment = await commentModel.findById(commentId)

    if (!comment || comment.isDeleted) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found.',
      })
    }

    // ---------------------------------------------------
    // Authorization
    // ---------------------------------------------------

    if (comment.createdBy.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized.',
      })
    }

    // ---------------------------------------------------
    // Update
    // ---------------------------------------------------

    comment.text = trimmedText
    comment.isEdited = true
    comment.editedAt = new Date()

    await comment.save()

    // ---------------------------------------------------
    // Fetch populated comment + like state
    // ---------------------------------------------------

    const [populatedComment, liked] = await Promise.all([
      commentModel
        .findById(comment._id)
        .populate('createdBy', COMMENT_AUTHOR_FIELDS)
        .lean(),

      likeModel.exists({
        user: userId,
        targetType: 'comment',
        targetId: comment._id,
      }),
    ])

    return res.status(200).json({
      success: true,
      message: 'Comment updated successfully.',
      comment: {
        ...populatedComment,
        isLiked: !!liked,
      },
    })
  } catch (error) {
    console.error('Update Comment Error:', error)

    return res.status(500).json({
      success: false,
      message: 'Unable to update comment.',
    })
  }
}

// =======================================================
// DELETE COMMENT
// =======================================================

export const deleteComment = async (req, res) => {
  const session = await mongoose.startSession()

  try {
    const { commentId } = req.params
    const userId = req.user.userID

    session.startTransaction()

    // ---------------------------------------------------
    // Find comment
    // ---------------------------------------------------

    const comment = await commentModel.findById(commentId).session(session)

    if (!comment || comment.isDeleted) {
      await session.abortTransaction()

      return res.status(404).json({
        success: false,
        message: 'Comment not found.',
      })
    }

    // ---------------------------------------------------
    // Authorization
    // ---------------------------------------------------

    if (comment.createdBy.toString() !== userId.toString()) {
      await session.abortTransaction()

      return res.status(403).json({
        success: false,
        message: 'Unauthorized.',
      })
    }

    // ---------------------------------------------------
    // Soft delete comment
    // ---------------------------------------------------

    comment.isDeleted = true
    comment.deletedAt = new Date()
    comment.deletedBy = userId

    await comment.save({ session })

    // ---------------------------------------------------
    // Decrease post comment count
    // ---------------------------------------------------

    await postModel.updateOne(
      {
        _id: comment.post,
        commentsCount: {
          $gt: 0,
        },
      },
      {
        $inc: {
          commentsCount: -1,
        },
      },
      { session },
    )

    // ---------------------------------------------------
    // Remove comment likes
    // ---------------------------------------------------

    await likeModel.deleteMany(
      {
        targetType: 'comment',
        targetId: comment._id,
      },
      { session },
    )

    // ---------------------------------------------------
    // Commit
    // ---------------------------------------------------

    await session.commitTransaction()

    return res.status(200).json({
      success: true,
      message: 'Comment deleted successfully.',
    })
  } catch (error) {
    if (session.inTransaction()) {
      await session.abortTransaction()
    }

    console.error('Delete Comment Error:', error)

    return res.status(500).json({
      success: false,
      message: 'Unable to delete comment.',
    })
  } finally {
    await session.endSession()
  }
}

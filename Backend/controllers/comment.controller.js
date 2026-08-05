import mongoose from 'mongoose'

import { commentModel } from '../models/Comment.model.js'
import { postModel } from '../models/Post.model.js'
import { likeModel } from '../models/Like.model.js'
import { userModel } from '../models/User.model.js'
import { createNotification } from '../services/notification.service.js'

// =======================================================
// Create Comment
// =======================================================

export const createComment = async (req, res) => {
  const session = await mongoose.startSession()

  try {
    session.startTransaction()

    const { id } = req.params
    const { text } = req.body

    if (!text || !text.trim()) {
      await session.abortTransaction()

      return res.status(400).json({
        success: false,
        message: 'Comment cannot be empty.',
      })
    }

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

    if (!post.allowComments) {
      await session.abortTransaction()

      return res.status(403).json({
        success: false,
        message: 'Comments are disabled for this post.',
      })
    }

    const [comment] = await commentModel.create(
      [
        {
          post: id,
          createdBy: req.user.userID,
          text: text.trim(),
        },
      ],
      { session },
    )

    post.commentsCount += 1

    await post.save({ session })

    // =======================================================
// Create Comment Notification
// =======================================================

// Don't notify if user comments on own post
if (post.createdBy.toString() !== req.user.userID.toString()) {
  const currentUser = await userModel
    .findById(req.user.userID)
    .select("firstName lastName");

  if (currentUser) {
    await createNotification({
      sender: req.user.userID,

      title: "New Comment",

      message: `${currentUser.firstName} ${currentUser.lastName} commented on your post.`,

      type: "post",

      referenceModel: "Post",

      referenceId: post._id,

      audienceType: "specific",

      targetUsers: [post.createdBy],
    });
  }
}

    await session.commitTransaction()

    const populatedComment = await commentModel
      .findById(comment._id)
      .populate(
        'createdBy',
        'firstName lastName profileImage designation department',
      )

    return res.status(201).json({
      success: true,
      message: 'Comment added successfully.',
      comment: {
        ...populatedComment.toObject(),
        isLiked: false,
      },
    })
  } catch (error) {
    await session.abortTransaction()

    console.error('Create Comment Error:', error)

    return res.status(500).json({
      success: false,
      message: 'Unable to add comment.',
    })
  } finally {
    session.endSession()
  }
}

// =======================================================
// Get Comments
// =======================================================

export const getComments = async (req, res) => {
  try {
    const { id } = req.params

    const page = Math.max(parseInt(req.query.page) || 1, 1)
    const limit = Math.max(parseInt(req.query.limit) || 10, 1)

    const skip = (page - 1) * limit

    const totalComments = await commentModel.countDocuments({
      post: id,
      isDeleted: false,
    })

    const comments = await commentModel
      .find({
        post: id,
        isDeleted: false,
      })
      .populate(
        'createdBy',
        'firstName lastName profileImage designation department',
      )
      .sort({
        createdAt: 1,
      })
      .skip(skip)
      .limit(limit)

    // Find all comments liked by the current user
    const likedComments = await likeModel.find({
      user: req.user.userID,
      targetType: 'comment',
      targetId: {
        $in: comments.map((comment) => comment._id),
      },
    })

    const likedSet = new Set(
      likedComments.map((like) => like.targetId.toString()),
    )

    const formattedComments = comments.map((comment) => ({
      ...comment.toObject(),
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
// Update Comment
// =======================================================

export const updateComment = async (req, res) => {
  try {
    const { commentId } = req.params
    const { text } = req.body

    if (!text || !text.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Comment cannot be empty.',
      })
    }

    const comment = await commentModel.findById(commentId)

    if (!comment || comment.isDeleted) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found.',
      })
    }

    if (comment.createdBy.toString() !== req.user.userID) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized.',
      })
    }

    comment.text = text.trim()
    comment.isEdited = true
    comment.editedAt = new Date()

    await comment.save()

    const populatedComment = await commentModel
      .findById(comment._id)
      .populate(
        'createdBy',
        'firstName lastName profileImage designation department',
      )

    const liked = await likeModel.exists({
      user: req.user.userID,
      targetType: 'comment',
      targetId: comment._id,
    })

    return res.status(200).json({
      success: true,
      message: 'Comment updated successfully.',
      comment: {
        ...populatedComment.toObject(),
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
// Delete Comment
// =======================================================

export const deleteComment = async (req, res) => {
  const session = await mongoose.startSession()

  try {
    session.startTransaction()

    const { commentId } = req.params

    const comment = await commentModel.findById(commentId).session(session)

    if (!comment || comment.isDeleted) {
      await session.abortTransaction()

      return res.status(404).json({
        success: false,
        message: 'Comment not found.',
      })
    }

    if (comment.createdBy.toString() !== req.user.userID) {
      await session.abortTransaction()

      return res.status(403).json({
        success: false,
        message: 'Unauthorized.',
      })
    }

    comment.isDeleted = true
    comment.deletedAt = new Date()

    await comment.save({ session })

    await postModel.findByIdAndUpdate(
      comment.post,
      {
        $inc: {
          commentsCount: -1,
        },
      },
      {
        session,
      },

      await likeModel.deleteMany(
        {
          targetType: 'comment',
          targetId: comment._id,
        },
        { session },
      ),
    )

    await session.commitTransaction()

    return res.status(200).json({
      success: true,
      message: 'Comment deleted successfully.',
    })
  } catch (error) {
    await session.abortTransaction()

    console.error('Delete Comment Error:', error)

    return res.status(500).json({
      success: false,
      message: 'Unable to delete comment.',
    })
  } finally {
    session.endSession()
  }
}

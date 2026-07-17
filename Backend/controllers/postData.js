import { postModel } from '../models/Post.model.js'
import { userModel } from '../models/User.model.js'

// =======================================================
// Create Post
// =======================================================

export const createPost = async (req, res) => {
  try {
    const { content, image, type, tags } = req.body

    if (!content || content.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Post content is required.',
      })
    }

    const post = await postModel.create({
      createdBy: req.user.userID,
      content: content.trim(),
      image: image || null,
      type: type || 'general',
      tags: tags || [],
    })

    // Add post reference to user
    await userModel.findByIdAndUpdate(req.user.userID, {
      $push: {
        posts: post._id,
      },
    })

    const populatedPost = await postModel
      .findById(post._id)
      .populate(
        'createdBy',
        'firstName lastName profileImage designation department',
      )

    return res.status(201).json({
      success: true,
      message: 'Post created successfully.',
      post: populatedPost,
    })
  } catch (error) {
    console.error('Create Post Error:', error)

    return res.status(500).json({
      success: false,
      message: 'Something went wrong while creating the post.',
    })
  }
}

// =======================================================
// Get All Posts
// =======================================================

export const getAllPosts = async (req, res) => {
  try {
    const posts = await postModel
      .find({
        isDeleted: false,
      })
      .populate(
        'createdBy',
        'firstName lastName profileImage designation department',
      )
      .populate('comments.createdBy', 'firstName lastName profileImage')
      .sort({
        createdAt: -1,
      })

    return res.status(200).json({
      success: true,
      totalPosts: posts.length,
      posts,
    })
  } catch (error) {
    console.error('Get All Posts Error:', error)

    return res.status(500).json({
      success: false,
      message: 'Unable to fetch posts.',
    })
  }
}

// =======================================================
// Get Featured Thought
// =======================================================

export const getFeaturedThought = async (req, res) => {
  try {
    let featuredPost = await postModel
      .findOne({
        isFeatured: true,
        isDeleted: false,
      })
      .populate(
        'createdBy',
        'firstName lastName profileImage designation department',
      )

    // If admin hasn't selected a featured post,
    // return the latest available post for now.
    // Later we'll replace this with the
    // "highest liked post from yesterday" logic.

    if (!featuredPost) {
      featuredPost = await postModel
        .findOne({
          isDeleted: false,
        })
        .populate(
          'createdBy',
          'firstName lastName profileImage designation department',
        )
        .sort({
          createdAt: -1,
        })
    }

    return res.status(200).json({
      success: true,
      featuredThought: featuredPost,
    })
  } catch (error) {
    console.error('Featured Thought Error:', error)

    return res.status(500).json({
      success: false,
      message: 'Unable to fetch featured thought.',
    })
  }
}

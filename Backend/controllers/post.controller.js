import { postModel } from '../models/Post.model.js'
import { userModel } from '../models/User.model.js'
import { likeModel } from '../models/Like.model.js'

// =======================================================
// Create Post
// =======================================================

export const createPost = async (req, res) => {
  try {
    const { content, image, type, tags, visibility } = req.body

    if (!content || !content.trim()) {
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
      visibility: visibility || 'public',
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
      post: {
        ...populatedPost.toObject(),
        isLiked: false,
      },
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
// Get Feed
// =======================================================

// =======================================================
// Get All Posts
// =======================================================

export const getAllPosts = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1)
    const limit = Math.max(parseInt(req.query.limit) || 10, 1)

    const sort = req.query.sort || 'newest'

    const skip = (page - 1) * limit

    let sortOption = {
      createdAt: -1,
    }

    switch (sort) {
      case 'oldest':
        sortOption = {
          createdAt: 1,
        }
        break

      case 'popular':
        sortOption = {
          likesCount: -1,
          commentsCount: -1,
          createdAt: -1,
        }
        break

      default:
        sortOption = {
          createdAt: -1,
        }
    }

    const totalPosts = await postModel.countDocuments({
      isDeleted: false,
    })

    const posts = await postModel
      .find({
        isDeleted: false,
      })
      .populate(
        'createdBy',
        'firstName lastName profileImage designation department',
      )
      .sort(sortOption)
      .skip(skip)
      .limit(limit)

    const likedPosts = await likeModel.find({
      user: req.user.userID,
      targetType: 'post',
      targetId: {
        $in: posts.map((post) => post._id),
      },
    })

    const likedSet = new Set(likedPosts.map((like) => like.targetId.toString()))

    const formattedPosts = posts.map((post) => ({
      ...post.toObject(),
      isLiked: likedSet.has(post._id.toString()),
    }))

    return res.status(200).json({
      success: true,

      page,

      limit,

      totalPosts,

      totalPages: Math.ceil(totalPosts / limit),

      hasMore: page * limit < totalPosts,

      posts: formattedPosts,
    })
  } catch (error) {
    console.error('Get Posts Error:', error)

    return res.status(500).json({
      success: false,
      message: 'Unable to fetch posts.',
    })
  }
}

// =======================================================
// Get Single Post
// =======================================================

export const getPost = async (req, res) => {
  try {
    const { id } = req.params

    const post = await postModel
      .findOne({
        _id: id,
        isDeleted: false,
      })
      .populate(
        'createdBy',
        'firstName lastName profileImage designation department',
      )

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found.',
      })
    }

    const liked = await likeModel.exists({
      user: req.user.userID,
      targetType: 'post',
      targetId: id,
    })

    return res.status(200).json({
      success: true,
      post: {
        ...post.toObject(),
        isLiked: !!liked,
      },
    })
  } catch (error) {
    console.error('Get Post Error:', error)

    return res.status(500).json({
      success: false,
      message: 'Unable to fetch post.',
    })
  }
}

// =======================================================
// Update Post
// =======================================================

export const updatePost = async (req, res) => {
  try {
    const { id } = req.params
    const { content, image, type, tags, visibility } = req.body

    const post = await postModel.findById(id)

    if (!post || post.isDeleted) {
      return res.status(404).json({
        success: false,
        message: 'Post not found.',
      })
    }

    if (post.createdBy.toString() !== req.user.userID) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to edit this post.',
      })
    }

    post.content = content ?? post.content
    post.image = image ?? post.image
    post.type = type ?? post.type
    post.tags = tags ?? post.tags
    post.visibility = visibility ?? post.visibility

    post.isEdited = true
    post.editedAt = new Date()
    post.editedBy = req.user.userID

    await post.save()

    const populatedPost = await postModel
      .findById(post._id)
      .populate(
        'createdBy',
        'firstName lastName profileImage designation department',
      )

    return res.status(200).json({
      success: true,
      message: 'Post updated successfully.',
      post: {
        ...populatedPost.toObject(),
        isLiked: false,
      },
    })
  } catch (error) {
    console.error('Update Post Error:', error)

    return res.status(500).json({
      success: false,
      message: 'Unable to update post.',
    })
  }
}

// =======================================================
// Delete Post
// =======================================================

export const deletePost = async (req, res) => {
  try {
    const { id } = req.params

    const post = await postModel.findById(id)

    if (!post || post.isDeleted) {
      return res.status(404).json({
        success: false,
        message: 'Post not found.',
      })
    }

    if (post.createdBy.toString() !== req.user.userID) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this post.',
      })
    }

    post.isDeleted = true
    post.deletedAt = new Date()
    post.deletedBy = req.user.userID

    await post.save()

    return res.status(200).json({
      success: true,
      message: 'Post deleted successfully.',
    })
  } catch (error) {
    console.error('Delete Post Error:', error)

    return res.status(500).json({
      success: false,
      message: 'Unable to delete post.',
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

    if (!featuredPost) {
      return res.status(200).json({
        success: true,
        featuredThought: null,
      })
    }

   const liked = await likeModel.exists({
     user: req.user.userID,
     targetType: 'post',
     targetId: featuredPost._id,
   })

    return res.status(200).json({
      success: true,
      featuredThought: {
        ...featuredPost.toObject(),
        isLiked: !!liked,
      },
    })
  } catch (error) {
    console.error('Featured Thought Error:', error)

    return res.status(500).json({
      success: false,
      message: 'Unable to fetch featured thought.',
    })
  }
}

// =======================================================
// Search Posts
// =======================================================

export const searchPosts = async (req, res) => {
  try {
    const { q } = req.query

    const filter = {
      isDeleted: false,
    }

    if (q && q.trim()) {
      filter.$or = [
        {
          content: {
            $regex: q.trim(),
            $options: 'i',
          },
        },
        {
          tags: {
            $in: [new RegExp(q.trim(), 'i')],
          },
        },
      ]
    }

    const posts = await postModel
      .find(filter)
      .populate(
        'createdBy',
        'firstName lastName profileImage designation department',
      )
      .sort({ createdAt: -1 })

    return res.status(200).json({
      success: true,
      posts,
    })
  } catch (error) {
    console.error(error)

    return res.status(500).json({
      success: false,
      message: 'Unable to search posts.',
    })
  }
}

// =======================================================
// Trending Posts
// =======================================================

export const getTrendingPosts = async (req, res) => {
  try {
    const posts = await postModel
      .find({
        isDeleted: false,
      })
      .populate(
        'createdBy',
        'firstName lastName profileImage designation department',
      )
      .sort({
        likesCount: -1,
        commentsCount: -1,
        createdAt: -1,
      })
      .limit(10)

    return res.status(200).json({
      success: true,
      posts,
    })
  } catch (error) {
    console.error(error)

    return res.status(500).json({
      success: false,
      message: 'Unable to fetch trending posts.',
    })
  }
}

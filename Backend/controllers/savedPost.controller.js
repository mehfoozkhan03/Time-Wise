import { SavedPost } from '../models/SavedPost.model.js'

export const toggleSavedPost = async (req, res) => {
  try {
    const userId = req.user.userID
    const { postId } = req.params

    const existing = await SavedPost.findOne({
      user: userId,
      post: postId,
    })

    if (existing) {
      await existing.deleteOne()

      return res.status(200).json({
        saved: false,
      })
    }

    await SavedPost.create({
      user: userId,
      post: postId,
    })

    res.status(200).json({
      saved: true,
    })
  } catch (error) {
    res.status(500).json({
      message: error.message,
    })
  }
}

import { postModel } from "../../models/Post.model.js";

export const adminDeleteThought = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await postModel.findById(id);

    if (!post || post.isDeleted) {
      return res.status(404).json({
        success: false,
        message: "Thought not found.",
      });
    }

    post.isDeleted = true;
    post.deletedAt = new Date();
    post.deletedBy = req.admin.adminID;

    await post.save();

    return res.status(200).json({
      success: true,
      message: "Thought deleted successfully.",
      postId: id,
    });
  } catch (error) {
    console.error("Admin Delete Thought Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to delete thought.",
    });
  }
};
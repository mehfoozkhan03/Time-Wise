import { postModel } from "../../models/Post.model.js";
import { createNotification } from "../../services/notification.service.js";
import { userModel } from './../../models/User.model.js';

//# =================== Create Admin Thought ===================
export const createAdminThought = async (req, res) => {
  try {
    const { content } = req.body;

    const uploadedImages = req.files?.images || [];
    const uploadedAttachments = req.files?.attachments || [];

    const hasContent = content && content.trim().length > 0;
    const hasImages = uploadedImages.length > 0;
    const hasAttachments = uploadedAttachments.length > 0;

    // At least one content type is required
    if (!hasContent && !hasImages && !hasAttachments) {
      return res.status(400).json({
        success: false,
        message: "Thought must contain text, an image or an attachment.",
      });
    }

    // Format uploaded images
    const images = uploadedImages.map((file) => ({
      url: file.path,
      publicId: file.filename,
      alt: "",
    }));

    // Format uploaded attachments
    const attachments = uploadedAttachments.map((file) => ({
      url: file.path,
      publicId: file.filename,
      originalName: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
    }));

    const post = await postModel.create({
      createdBy: req.admin.adminID,
      authorType: "Admin",
      content: hasContent ? content.trim() : "",
      image: images.length > 0 ? images[0].url : null,
      images,
      attachments,
      type: "thought",
      visibility: "public",
    });

    const users = await userModel.find({
      role: { $ne: "Admin" },
    }).select("_id");

    //# Create notification 
    await createNotification({
      sender: req.admin.adminID,
      senderModel: "Admin",
      title: "New Thought Published",
      message: "Admin has shared a new thought.",
      type: "post",
      referenceModel: "Post",
      referenceId: post._id,
      audienceType: "all",
      targetUsers: users.map((user) => user._id),
    });

    return res.status(201).json({
      success: true,
      message: "Thought created successfully.",
      post: {
        ...post.toObject(),
        createdBy: {
          _id: req.admin.adminID,
          firstName: "Admin",
          lastName: "",
          designation: "Administrator",
          profileImage: null,
        },
        isLiked: false,
        isSaved: false,
      },
    });
  } catch (error) {
    console.error("Create Admin Thought Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to create admin thought.",
    });
  }
};

//# =================== Pin thought =================== 
export const togglePinThought = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await postModel.findById(id);

    if (!post || post.isDeleted) {
      return res.status(404).json({
        success: false,
        message: "Thought not found.",
      });
    }

    // If already pinned, unpin it
    if (post.isPinned) {
      post.isPinned = false;
      post.pinnedAt = null;
      post.pinnedBy = null;

      await post.save();

      return res.status(200).json({
        success: true,
        message: "Thought unpinned successfully.",
        postId: post._id,
        isPinned: false,
      });
    }

    // Unpin all previously pinned thoughts
    await postModel.updateMany(
      {
        _id: { $ne: post._id },
        isPinned: true,
        isDeleted: false,
      },
      {
        $set: {
          isPinned: false,
          pinnedAt: null,
          pinnedBy: null,
        },
      }
    );

    // Pin the selected thought
    post.isPinned = true;
    post.pinnedAt = new Date();
    post.pinnedBy = req.admin.adminID;

    await post.save();

    return res.status(200).json({
      success: true,
      message: "Thought pinned successfully.",
      postId: post._id,
      isPinned: true,
      pinnedAt: post.pinnedAt,
    });

  } catch (error) {
    console.error("Toggle Pin Thought Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update thought pin.",
    });
  }
};



//# ================== Delete thought ===================== 
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



//# Featured thought for Admin home page 
export const getFeaturedThoughtForAdmin = async (req, res) => {
  try {
    let featuredPost = await postModel
      .findOne({
        isPinned: true,
        isDeleted: false,
      })
      .populate(
        "createdBy",
        "firstName lastName profileImage designation department"
      )
      .sort({
        pinnedAt: -1,
      });

    // No pinned thought → latest thought
    if (!featuredPost) {
      featuredPost = await postModel
        .findOne({
          type: "thought",
          isDeleted: false,
        })
        .populate(
          "createdBy",
          "firstName lastName profileImage designation department"
        )
        .sort({
          createdAt: -1,
        });
    }

    // return res.status(200).json({
    //   success: true,
    //   featuredThought: featuredPost || null,
    // });

    if (featuredPost?.authorType === "Admin") {
      const postData = featuredPost.toObject();

      postData.createdBy = {
        _id: featuredPost.createdBy?._id,
        firstName: "Admin",
        lastName: "",
        designation: "Administrator",
        profileImage: null,
      };

      featuredPost = postData;
    }

    return res.status(200).json({
      success: true,
      featuredThought: featuredPost || null,
    });
  } catch (error) {
    console.error("Admin Featured Thought Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch featured thought.",
    });
  }
};
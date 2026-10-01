import mongoose from "mongoose";
import { annoucementModel } from "../../models/Announcement.model.js";

// ============================================================
// CREATE ANNOUNCEMENT
// ============================================================

export const createAnnouncement = async (req, res) => {
  try {
    const {
      title,
      category,
      priority,
      description,
      status,
      publishedAt,
      scheduledAt,
      expiryDate,
      expiryTime,
      audience,
      department,
      role,
      specificEmployees,
      attachments,
      actionButton,
      isPinned,
    } = req.body;

    // Basic validation
    if (!title?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Title is required.",
      });
    }

    if (!category) {
      return res.status(400).json({
        success: false,
        message: "Category is required.",
      });
    }

    if (!description?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Description is required.",
      });
    }

    // Validate department when audience is Department
    if (audience === "Department" && department) {
      if (!mongoose.Types.ObjectId.isValid(department)) {
        return res.status(400).json({
          success: false,
          message: "Invalid department ID.",
        });
      }
    }

    // Validate specific employees
    if (audience === "Specific Employees" && specificEmployees?.length) {
      const invalidEmployee = specificEmployees.some(
        (id) => !mongoose.Types.ObjectId.isValid(id),
      );

      if (invalidEmployee) {
        return res.status(400).json({
          success: false,
          message: "One or more employee IDs are invalid.",
        });
      }
    }

    // Determine final status
    let finalStatus = status || "Draft";

    if (finalStatus === "Published") {
      finalStatus = "Published";
    }

    if (finalStatus === "Scheduled") {
      if (!scheduledAt) {
        return res.status(400).json({
          success: false,
          message: "Scheduled date and time are required.",
        });
      }
    }

    // Published announcement gets publishedAt
    let finalPublishedAt = publishedAt || null;

    if (finalStatus === "Published" && !finalPublishedAt) {
      finalPublishedAt = new Date();
    }

    //# Creating announcement
    const announcement = await annoucementModel.create({
      title: title.trim(),
      category,
      priority: priority || "Normal",
      description: description.trim(),

      status: finalStatus,

      publishedAt: finalPublishedAt,
      scheduledAt: scheduledAt || null,

      expiryDate: expiryDate || null,
      expiryTime: expiryTime || null,

      audience: audience || "Everyone",

      department: audience === "Department" && department ? department : null,

      role: audience === "Role" && role ? role : null,

      specificEmployees:
        audience === "Specific Employees" ? specificEmployees || [] : [],

      attachments: attachments || [],

      actionButton: actionButton || {
        enabled: false,
        label: null,
        url: null,
      },

      isPinned: isPinned || false,

      createdBy: req.admin?.userID || req.user?.userID,
    });

    const populatedAnnouncement = await annoucementModel
      .findById(announcement._id)
      .populate(
        "createdBy",
        "firstName lastName profileImage designation department",
      )
      .populate("updatedBy", "firstName lastName");
    return res.status(201).json({
      success: true,
      message: "Announcement created successfully.",
      announcement: populatedAnnouncement,
    });
  } catch (error) {
    console.error("Create Announcement Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to create announcement.",
      error: error.message,
    });
  }
};

// ============================================================
// GET ALL ANNOUNCEMENTS
// ============================================================

export const getAllAnnouncements = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      category,
      priority,
      audience,
      search,
      sort = "newest",
    } = req.query;

    const pageNumber = Math.max(Number(page), 1);
    const limitNumber = Math.max(Number(limit), 1);

    const filter = {};

    // Status filter
    if (status) {
      filter.status = status;
    }

    // Category filter
    if (category) {
      filter.category = category;
    }

    // Priority filter
    if (priority) {
      filter.priority = priority;
    }

    // Audience filter
    if (audience) {
      filter.audience = audience;
    }

    // Search
    if (search?.trim()) {
      filter.$or = [
        {
          title: {
            $regex: search.trim(),
            $options: "i",
          },
        },
        {
          description: {
            $regex: search.trim(),
            $options: "i",
          },
        },
      ];
    }

    // Sorting
    let sortOption = {
      createdAt: -1,
    };

    if (sort === "newest") {
      sortOption = {
        isPinned: -1,
        createdAt: -1,
      };
    }

    if (sort === "oldest") {
      sortOption = {
        createdAt: 1,
      };
    }

    if (sort === "az") {
      sortOption = { title: 1 };
    }

    if (sort === "priority") {
      sortOption = {
        priority: -1,
        createdAt: -1,
      };
    }

    const skip = (pageNumber - 1) * limitNumber;

    const [announcements, totalAnnouncements] = await Promise.all([
      annoucementModel
        .find(filter)
        .populate(
          "createdBy",
          "firstName lastName profileImage designation department",
        )
        .populate("updatedBy", "firstName lastName")

        .sort(sortOption)
        .skip(skip)
        .limit(limitNumber)
        .lean(),

      annoucementModel.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      announcements,
      pagination: {
        currentPage: pageNumber,
        totalPages: Math.ceil(totalAnnouncements / limitNumber),
        totalAnnouncements,
        limit: limitNumber,
      },
    });
  } catch (error) {
    console.error("Get All Announcements Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch announcements.",
      error: error.message,
    });
  }
};

// ============================================================
// GET SINGLE ANNOUNCEMENT
// ============================================================

export const getAnnouncementById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid announcement ID.",
      });
    }

    const announcement = await annoucementModel
      .findById(id)
      .populate(
        "createdBy",
        "firstName lastName profileImage designation department",
      )
      .populate("updatedBy", "firstName lastName")

      .populate(
        "specificEmployees",
        "firstName lastName profileImage designation department",
      );

    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: "Announcement not found.",
      });
    }

    return res.status(200).json({
      success: true,
      announcement,
    });
  } catch (error) {
    console.error("Get Announcement Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch announcement.",
      error: error.message,
    });
  }
};

// ============================================================
// UPDATE ANNOUNCEMENT
// ============================================================

export const updateAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid announcement ID.",
      });
    }

    const existingAnnouncement = await annoucementModel.findById(id);

    if (!existingAnnouncement) {
      return res.status(404).json({
        success: false,
        message: "Announcement not found.",
      });
    }

    const {
      title,
      category,
      priority,
      description,
      status,
      publishedAt,
      scheduledAt,
      expiryDate,
      expiryTime,
      audience,
      department,
      role,
      specificEmployees,
      attachments,
      actionButton,
      isPinned,
    } = req.body;

    // Build update object
    const updateData = {};

    if (title !== undefined) {
      if (!title.trim()) {
        return res.status(400).json({
          success: false,
          message: "Title cannot be empty.",
        });
      }

      updateData.title = title.trim();
    }

    if (category !== undefined) {
      updateData.category = category;
    }

    if (priority !== undefined) {
      updateData.priority = priority;
    }

    if (description !== undefined) {
      if (!description.trim()) {
        return res.status(400).json({
          success: false,
          message: "Description cannot be empty.",
        });
      }

      updateData.description = description.trim();
    }

    if (status !== undefined) {
      updateData.status = status;

      if (status === "Published") {
        updateData.publishedAt =
          publishedAt || existingAnnouncement.publishedAt || new Date();

        updateData.scheduledAt = null;
      }

      if (status === "Scheduled") {
        if (!scheduledAt) {
          return res.status(400).json({
            success: false,
            message: "Scheduled date and time are required.",
          });
        }

        updateData.scheduledAt = scheduledAt;
        updateData.publishedAt = null;
      }

      if (status === "Draft") {
        updateData.publishedAt = null;
        updateData.scheduledAt = null;
      }
    }

    if (publishedAt !== undefined && status !== "Draft") {
      updateData.publishedAt = publishedAt;
    }

    if (scheduledAt !== undefined && status !== "Published") {
      updateData.scheduledAt = scheduledAt;
    }

    if (expiryDate !== undefined) {
      updateData.expiryDate = expiryDate || null;
    }

    if (expiryTime !== undefined) {
      updateData.expiryTime = expiryTime || null;
    }

    if (audience !== undefined) {
      updateData.audience = audience;

      // Clear unrelated audience fields
      if (audience !== "Department") {
        updateData.department = null;
      }

      if (audience !== "Role") {
        updateData.role = null;
      }

      if (audience !== "Specific Employees") {
        updateData.specificEmployees = [];
      }
    }

    if (department !== undefined) {
      if (department && !mongoose.Types.ObjectId.isValid(department)) {
        return res.status(400).json({
          success: false,
          message: "Invalid department ID.",
        });
      }

      updateData.department = department || null;
    }

    if (role !== undefined) {
      updateData.role = role || null;
    }

    if (specificEmployees !== undefined) {
      updateData.specificEmployees = specificEmployees;
    }

    if (attachments !== undefined) {
      updateData.attachments = attachments;
    }

    if (actionButton !== undefined) {
      updateData.actionButton = actionButton;
    }

    if (isPinned !== undefined) {
      updateData.isPinned = isPinned;
    }

    updateData.updatedBy = req.admin?.userID || req.user?.userID;

    const updatedAnnouncement = await annoucementModel
      .findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
      })
      .populate(
        "createdBy",
        "firstName lastName profileImage designation department",
      )
      .populate("updatedBy", "firstName lastName");

    return res.status(200).json({
      success: true,
      message: "Announcement updated successfully.",
      announcement: updatedAnnouncement,
    });
  } catch (error) {
    console.error("Update Announcement Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update announcement.",
      error: error.message,
    });
  }
};

// ============================================================
// DELETE ANNOUNCEMENT
// ============================================================

export const deleteAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid announcement ID.",
      });
    }

    const announcement = await annoucementModel.findById(id);

    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: "Announcement not found.",
      });
    }

    await annoucementModel.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Announcement deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Announcement Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to delete announcement.",
      error: error.message,
    });
  }
};

// ============================================================
// PUBLISH ANNOUNCEMENT
// ============================================================

export const publishAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid announcement ID.",
      });
    }

    const announcement = await annoucementModel.findById(id);

    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: "Announcement not found.",
      });
    }

    if (announcement.status === "Published") {
      return res.status(400).json({
        success: false,
        message: "Announcement is already published.",
      });
    }

    announcement.status = "Published";
    announcement.publishedAt = new Date();
    announcement.scheduledAt = null;

    announcement.updatedBy = req.admin?.userID || req.user?.userID;

    await announcement.save();

    return res.status(200).json({
      success: true,
      message: "Announcement published successfully.",
      announcement,
    });
  } catch (error) {
    console.error("Publish Announcement Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to publish announcement.",
      error: error.message,
    });
  }
};

// ============================================================
// SCHEDULE ANNOUNCEMENT
// ============================================================

export const scheduleAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    const { scheduledAt } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid announcement ID.",
      });
    }

    if (!scheduledAt) {
      return res.status(400).json({
        success: false,
        message: "Scheduled date and time are required.",
      });
    }

    const scheduleDate = new Date(scheduledAt);

    if (Number.isNaN(scheduleDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid scheduled date.",
      });
    }

    if (scheduleDate <= new Date()) {
      return res.status(400).json({
        success: false,
        message: "Scheduled time must be in the future.",
      });
    }

    const announcement = await annoucementModel.findById(id);

    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: "Announcement not found.",
      });
    }

    announcement.status = "Scheduled";
    announcement.scheduledAt = scheduleDate;
    announcement.publishedAt = null;

    announcement.updatedBy = req.admin?.userID || req.user?.userID;

    await announcement.save();

    return res.status(200).json({
      success: true,
      message: "Announcement scheduled successfully.",
      announcement,
    });
  } catch (error) {
    console.error("Schedule Announcement Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to schedule announcement.",
      error: error.message,
    });
  }
};

// ============================================================
// PIN / UNPIN ANNOUNCEMENT
// ============================================================

export const togglePinAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid announcement ID.",
      });
    }

    const announcement = await annoucementModel.findById(id);

    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: "Announcement not found.",
      });
    }

    // ==============================
    // UNPIN
    // ==============================
    if (announcement.isPinned) {
      announcement.isPinned = false;

      announcement.updatedBy = req.admin?.userID || req.user?.userID;

      await announcement.save();

      return res.status(200).json({
        success: true,
        message: "Announcement unpinned successfully.",
        announcement,
      });
    }

    // ==============================
    // PIN
    // ==============================

    // First unpin any existing pinned announcement
    await annoucementModel.updateMany(
      {
        isPinned: true,
        _id: { $ne: id },
      },
      {
        $set: {
          isPinned: false,
        },
      },
    );

    // Now pin the selected announcement
    announcement.isPinned = true;

    announcement.updatedBy = req.admin?.userID || req.user?.userID;

    await announcement.save();

    return res.status(200).json({
      success: true,
      message: "Announcement pinned successfully.",
      announcement,
    });
  } catch (error) {
    console.error("Toggle Pin Announcement Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update announcement pin.",
      error: error.message,
    });
  }
};

import { holidayModel } from "../models/Holidays.model.js";
import { userModel } from "../models/User.model.js";
import { AdminModel } from "../models/Admin.model.js";

/* =========================================
   Logged In User Helper
========================================= */

const getLoggedInAccount = async (req) => {
  // Employee Login
  if (req.user?.userID) {
    const employee = await userModel.findById(req.user.userID);

    if (!employee) return null;

    return {
      account: employee,
      accountType: "employee",
      isEmployee: true,
      isAdmin: false,
    };
  }

  // Admin Login
  if (req.user?.adminID) {
    const admin = await AdminModel.findById(req.user.adminID);

    if (!admin) return null;

    return {
      account: admin,
      accountType: "admin",
      isEmployee: false,
      isAdmin: true,
    };
  }

  return null;
};

/* =========================================
   GET ALL HOLIDAYS
========================================= */
export const getAllHolidays = async (req, res) => {
  try {
    const auth = await getLoggedInAccount(req);

    if (!auth) {
      return res.status(404).json({
        success: false,
        message: "Account not found.",
      });
    }

    const holidays = await holidayModel
      .find({
        isActive: true,
      })
      .sort({
        date: 1,
      });

    return res.status(200).json({
      success: true,
      count: holidays.length,
      data: holidays,
    });
  } catch (error) {
    console.error("Get Holidays Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch holidays.",
    });
  }
};

/* =========================================
   GET HOLIDAY BY ID
========================================= */
export const getHolidayById = async (req, res) => {
  try {
    const auth = await getLoggedInAccount(req);

    if (!auth) {
      return res.status(404).json({
        success: false,
        message: "Account not found.",
      });
    }

    const holiday = await holidayModel.findById(req.params.id);

    if (!holiday || !holiday.isActive) {
      return res.status(404).json({
        success: false,
        message: "Holiday not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: holiday,
    });
  } catch (error) {
    console.error("Get Holiday Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch holiday.",
    });
  }
};

export const createHoliday = async (req, res) => {
  try {
    const auth = await getLoggedInAccount(req);

    if (!auth) {
      return res.status(404).json({
        success: false,
        message: "Account not found.",
      });
    }

    if (!auth.isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Only admins can create holidays.",
      });
    }

    const { title, description, type, date } = req.body;

    const existingHoliday = await holidayModel.findOne({
      title: {
        $regex: new RegExp(`^${title.trim()}$`, "i"),
      },
      date,
      isActive: true,
    });

    if (existingHoliday) {
      return res.status(409).json({
        success: false,
        message: "Holiday already exists.",
      });
    }

    const holiday = await holidayModel.create({
      title: title.trim(),
      description,
      type,
      date,
      createdBy: auth.account._id,
    });

    return res.status(201).json({
      success: true,
      message: "Holiday created successfully.",
      data: holiday,
    });
  } catch (error) {
    console.error("Create Holiday Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create holiday.",
    });
  }
};

/* =========================================
   UPDATE HOLIDAY
========================================= */
export const updateHoliday = async (req, res) => {
  try {
    const auth = await getLoggedInAccount(req);

    if (!auth) {
      return res.status(404).json({
        success: false,
        message: "Account not found.",
      });
    }

    if (!auth.isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Only admins can update holidays.",
      });
    }

    const holiday = await holidayModel.findById(req.params.id);

    if (!holiday || !holiday.isActive) {
      return res.status(404).json({
        success: false,
        message: "Holiday not found.",
      });
    }

    const updatedTitle = (req.body.title ?? holiday.title).trim();
    const updatedDate = req.body.date ?? holiday.date;

    const duplicateHoliday = await holidayModel.findOne({
      _id: {
        $ne: holiday._id,
      },
      title: {
        $regex: new RegExp(`^${updatedTitle}$`, "i"),
      },
      date: updatedDate,
      isActive: true,
    });

    if (duplicateHoliday) {
      return res.status(409).json({
        success: false,
        message: "Holiday already exists.",
      });
    }

    holiday.title = updatedTitle;
    holiday.description = req.body.description ?? holiday.description;
    holiday.type = req.body.type ?? holiday.type;
    holiday.date = updatedDate;

    if (req.body.isActive !== undefined) {
      holiday.isActive = req.body.isActive;
    }

    holiday.updatedBy = auth.account._id;

    await holiday.save();

    return res.status(200).json({
      success: true,
      message: "Holiday updated successfully.",
      data: holiday,
    });
  } catch (error) {
    console.error("Update Holiday Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update holiday.",
    });
  }
};

/* =========================================
   DELETE HOLIDAY
========================================= */
export const deleteHoliday = async (req, res) => {
  try {
    const auth = await getLoggedInAccount(req);

    if (!auth) {
      return res.status(404).json({
        success: false,
        message: "Account not found.",
      });
    }

    if (!auth.isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Only admins can delete holidays.",
      });
    }

    const holiday = await holidayModel.findById(req.params.id);

    if (!holiday || !holiday.isActive) {
      return res.status(404).json({
        success: false,
        message: "Holiday not found.",
      });
    }

    holiday.isActive = false;
    holiday.updatedBy = auth.account._id;

    await holiday.save();

    return res.status(200).json({
      success: true,
      message: "Holiday deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Holiday Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete holiday.",
    });
  }
};

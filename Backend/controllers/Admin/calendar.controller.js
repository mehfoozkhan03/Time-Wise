import mongoose from "mongoose";

import { calendarModel } from "../../models/Calendar.model.js";
import { userModel } from "../../models/User.model.js";

// ============================================================
// ADMIN EVENT TYPE CONFIGURATION
// ============================================================

const ADMIN_EVENT_TYPES = [
  "PRESENT",
  "LEAVE",
  "HOLIDAY",
  "GOVERNMENT_HOLIDAY",
  "FESTIVAL",
  "SPECIAL_EVENT",
  "WORK_EVENT",
  "REVIEW",
  "DEADLINE",
  "CLIENT_MEETING",
  "TRAINING",
  "MEETING",
  "PERSONAL",
];

const GENERAL_EVENT_TYPES = [
  "HOLIDAY",
  "GOVERNMENT_HOLIDAY",
  "FESTIVAL",
  "SPECIAL_EVENT",
  "WORK_EVENT",
  "BIRTHDAY",
];

const PUBLIC_EVENT_TYPES = [
  "HOLIDAY",
  "GOVERNMENT_HOLIDAY",
  "FESTIVAL",
  "SPECIAL_EVENT",
  "MEETING",
  "WORK_EVENT",
  "BIRTHDAY",
];

// ============================================================
// VISIBILITY HELPERS
// ============================================================

const getVisibility = (type) => {
  if (PUBLIC_EVENT_TYPES.includes(type)) {
    return "PUBLIC";
  }

  return "PRIVATE";
};

const requiresEmployee = (type) => {
  return !GENERAL_EVENT_TYPES.includes(type);
};

const getEmployeeName = (employee) => {
  if (!employee) {
    return "";
  }

  if (employee.name) {
    return employee.name;
  }

  return `${employee.firstName || ""} ${employee.lastName || ""}`.trim();
};

// ============================================================
// GET ALL EVENTS
// ============================================================

export const getAllEvents = async (req, res) => {
  try {
    if (!req.admin?.adminID) {
      return res.status(404).json({
        success: false,
        message: "Account not found.",
      });
    }

    const events = await calendarModel
      .find({
        isActive: true,
      })
      .sort({ date: 1 });

    return res.status(200).json({
      success: true,
      count: events.length,
      data: events,
    });
  } catch (error) {
    console.error("Get Events Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch calendar events.",
    });
  }
};

// ============================================================
// GET EVENT BY ID
// ============================================================

export const getEventById = async (req, res) => {
  try {
    if (!req.admin?.adminID) {
      return res.status(404).json({
        success: false,
        message: "Account not found.",
      });
    }

    const event = await calendarModel.findById(req.params.id);

    if (!event || !event.isActive) {
      return res.status(404).json({
        success: false,
        message: "Event not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: event,
    });
  } catch (error) {
    console.error("Get Event Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch event.",
    });
  }
};

// ============================================================
// CREATE EVENT
// ============================================================

export const createEvent = async (req, res) => {
  try {
    if (!req.admin?.adminID) {
      return res.status(404).json({
        success: false,
        message: "Account not found.",
      });
    }

    const {
      title,
      description,
      type,
      date,
      startTime,
      endTime,
      employeeId,
      location,
      priority,
      color,
      isAllDay,
    } = req.body;

    // ----------------------------------------------------------
    // VALIDATE ADMIN EVENT TYPE
    // ----------------------------------------------------------

    if (!ADMIN_EVENT_TYPES.includes(type)) {
      return res.status(403).json({
        success: false,
        message: "Invalid event type.",
      });
    }

    // ----------------------------------------------------------
    // EMPLOYEE ASSIGNMENT
    // ----------------------------------------------------------

    let employee = null;

    if (requiresEmployee(type)) {
      if (!employeeId) {
        return res.status(400).json({
          success: false,
          message: "Employee is required for this event type.",
        });
      }

      if (!mongoose.Types.ObjectId.isValid(employeeId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid employee ID.",
        });
      }

      employee = await userModel.findById(employeeId);

      if (!employee) {
        return res.status(404).json({
          success: false,
          message: "Employee not found.",
        });
      }
    }

    // ----------------------------------------------------------
    // CREATE ADMIN EVENT
    // ----------------------------------------------------------

    const event = await calendarModel.create({
      title,
      description,
      type,
      date,
      startTime,
      endTime,

      employeeId: employee ? employee._id : null,
      employeeName: employee ? getEmployeeName(employee) : "",
      department: employee ? employee.department : null,
      designation: employee ? employee.designation : null,

      location,
      priority,
      color,
      isAllDay,

      visibility: getVisibility(type),

      createdBy: req.admin.adminID,
      createdByModel: "Admin",
    });

    return res.status(201).json({
      success: true,
      message: "Event created successfully.",
      data: event,
    });
  } catch (error) {
    console.error("Create Event Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create event.",
    });
  }
};

// ============================================================
// UPDATE EVENT
// ============================================================

export const updateEvent = async (req, res) => {
  try {
    if (!req.admin?.adminID) {
      return res.status(404).json({
        success: false,
        message: "Account not found.",
      });
    }

    const event = await calendarModel.findById(req.params.id);

    if (!event || !event.isActive) {
      return res.status(404).json({
        success: false,
        message: "Event not found.",
      });
    }

    // ----------------------------------------------------------
    // VALIDATE EVENT TYPE
    // ----------------------------------------------------------

    const newType = req.body.type || event.type;

    if (!ADMIN_EVENT_TYPES.includes(newType)) {
      return res.status(403).json({
        success: false,
        message: "Invalid event type.",
      });
    }

    // ----------------------------------------------------------
    // UPDATE BASIC EVENT DATA
    // ----------------------------------------------------------

    event.title = req.body.title ?? event.title;
    event.description = req.body.description ?? event.description;
    event.date = req.body.date ?? event.date;
    event.startTime = req.body.startTime ?? event.startTime;
    event.endTime = req.body.endTime ?? event.endTime;
    event.location = req.body.location ?? event.location;
    event.priority = req.body.priority ?? event.priority;
    event.color = req.body.color ?? event.color;
    event.isAllDay = req.body.isAllDay ?? event.isAllDay;

    event.type = newType;
    event.visibility = getVisibility(newType);

    // ----------------------------------------------------------
    // HANDLE EMPLOYEE ASSIGNMENT
    // ----------------------------------------------------------

    if (requiresEmployee(newType)) {
      if (!req.body.employeeId) {
        return res.status(400).json({
          success: false,
          message: "Employee is required for this event type.",
        });
      }

      if (!mongoose.Types.ObjectId.isValid(req.body.employeeId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid employee ID.",
        });
      }

      const employee = await userModel.findById(req.body.employeeId);

      if (!employee) {
        return res.status(404).json({
          success: false,
          message: "Employee not found.",
        });
      }

      event.employeeId = employee._id;
      event.employeeName = getEmployeeName(employee);
      event.department = employee.department || null;
      event.designation = employee.designation || null;
    } else {
      event.employeeId = null;
      event.employeeName = "";
      event.department = null;
      event.designation = null;
    }

    // ----------------------------------------------------------
    // UPDATED BY ADMIN
    // ----------------------------------------------------------

    event.updatedBy = req.admin.adminID;
    event.updatedByModel = "Admin";

    await event.save();

    return res.status(200).json({
      success: true,
      message: "Event updated successfully.",
      data: event,
    });
  } catch (error) {
    console.error("Update Event Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update event.",
    });
  }
};

// ============================================================
// DELETE EVENT
// ============================================================

export const deleteEvent = async (req, res) => {
  try {
    if (!req.admin?.adminID) {
      return res.status(404).json({
        success: false,
        message: "Account not found.",
      });
    }

    const event = await calendarModel.findById(req.params.id);

    if (!event || !event.isActive) {
      return res.status(404).json({
        success: false,
        message: "Event not found.",
      });
    }

    // ----------------------------------------------------------
    // SOFT DELETE
    // ----------------------------------------------------------

    event.isActive = false;
    event.updatedBy = req.admin.adminID;
    event.updatedByModel = "Admin";

    await event.save();

    return res.status(200).json({
      success: true,
      message: "Event deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Event Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete event.",
    });
  }
};
import mongoose from "mongoose";

import { calendarModel } from "../models/Calendar.model.js";
import { userModel } from "../models/User.model.js";
import { AdminModel } from "../models/Admin.model.js";

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

const EMPLOYEE_EVENT_TYPES = ["PERSONAL", "MEETING", "BIRTHDAY"];

const GENERAL_EVENT_TYPES = [
  "HOLIDAY",
  "GOVERNMENT_HOLIDAY",
  "FESTIVAL",
  "SPECIAL_EVENT",
  "WORK_EVENT",
];

const PUBLIC_EVENT_TYPES = [
  "HOLIDAY",
  "GOVERNMENT_HOLIDAY",
  "FESTIVAL",
  "SPECIAL_EVENT",
  "MEETING",
  "WORK_EVENT",
];

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

const getLoggedInAccount = async (req) => {
  if (req.user?.userID) {
    const employee = await userModel.findById(req.user.userID);

    if (!employee) {
      return null;
    }

    return {
      account: employee,
      accountType: "employee",
      isEmployee: true,
      isAdmin: false,
    };
  }

  if (req.user?.adminID) {
    const admin = await AdminModel.findById(req.user.adminID);

    if (!admin) {
      return null;
    }

    return {
      account: admin,
      accountType: "admin",
      isEmployee: false,
      isAdmin: true,
    };
  }

  return null;
};

export const getAllEvents = async (req, res) => {
  try {
    const auth = await getLoggedInAccount(req);

    if (!auth) {
      return res.status(404).json({
        success: false,
        message: "Account not found.",
      });
    }

    let query = {
      isActive: true,
    };

    if (!auth.isAdmin) {
      query = {
        isActive: true,
        $or: [
          {
            visibility: "PUBLIC",
          },
          {
            employeeId: auth.account._id,
          },
        ],
      };
    }

    const events = await calendarModel.find(query).sort({ date: 1 });

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

export const getEventById = async (req, res) => {
  try {
    const auth = await getLoggedInAccount(req);

    if (!auth) {
      return res.status(404).json({
        success: false,
        message: "Account not found.",
      });
    }

    console.log("Logged Account:", auth.account.email);
    console.log("Account Type:", auth.accountType);

    const event = await calendarModel.findById(req.params.id);

    if (!event || !event.isActive) {
      return res.status(404).json({
        success: false,
        message: "Event not found.",
      });
    }

    if (
      !auth.isAdmin &&
      event.visibility === "PRIVATE" &&
      event.employeeId &&
      event.employeeId.toString() !== auth.account._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Access denied.",
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

export const createEvent = async (req, res) => {
  try {
    const auth = await getLoggedInAccount(req);

    if (!auth) {
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

    if (auth.isEmployee) {
      if (!EMPLOYEE_EVENT_TYPES.includes(type)) {
        return res.status(403).json({
          success: false,
          message: "You cannot create this type of event.",
        });
      }

      const employee = auth.account;

      const event = await calendarModel.create({
        title,
        description,
        type,
        date,
        startTime,
        endTime,
        employeeId: employee._id,
        employeeName: getEmployeeName(employee),
        department: employee.department,
        designation: employee.designation,
        location,
        priority,
        color,
        isAllDay,
        visibility: getVisibility(type),
        createdBy: employee._id,
        createdByModel: "User",
      });

      return res.status(201).json({
        success: true,
        message: "Event created successfully.",
        data: event,
      });
    }

    if (!ADMIN_EVENT_TYPES.includes(type)) {
      return res.status(403).json({
        success: false,
        message: "Invalid event type.",
      });
    }

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

      createdBy: auth.account._id,
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

export const updateEvent = async (req, res) => {
  try {
    const auth = await getLoggedInAccount(req);

    if (!auth) {
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

    if (auth.isEmployee) {
      const employee = auth.account;

      if (
        !event.employeeId ||
        event.employeeId.toString() !== employee._id.toString()
      ) {
        return res.status(403).json({
          success: false,
          message: "You can only update your own events.",
        });
      }

      if (!EMPLOYEE_EVENT_TYPES.includes(event.type)) {
        return res.status(403).json({
          success: false,
          message: "You cannot update this event.",
        });
      }

      event.title = req.body.title ?? event.title;
      event.description = req.body.description ?? event.description;
      event.date = req.body.date ?? event.date;
      event.startTime = req.body.startTime ?? event.startTime;
      event.endTime = req.body.endTime ?? event.endTime;
      event.location = req.body.location ?? event.location;
      event.priority = req.body.priority ?? event.priority;
      event.color = req.body.color ?? event.color;
      event.isAllDay = req.body.isAllDay ?? event.isAllDay;

      if (req.body.type) {
        if (!EMPLOYEE_EVENT_TYPES.includes(req.body.type)) {
          return res.status(403).json({
            success: false,
            message: "Invalid event type.",
          });
        }

        event.type = req.body.type;
        event.visibility = getVisibility(req.body.type);
      }

      event.updatedBy = employee._id;
      event.updatedByModel = "User";

      await event.save();

      return res.status(200).json({
        success: true,
        message: "Event updated successfully.",
        data: event,
      });
    }

    const newType = req.body.type || event.type;

    if (!ADMIN_EVENT_TYPES.includes(newType)) {
      return res.status(403).json({
        success: false,
        message: "Invalid event type.",
      });
    }

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

    event.updatedBy = auth.account._id;
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

export const deleteEvent = async (req, res) => {
  try {
    const auth = await getLoggedInAccount(req);

    if (!auth) {
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

    if (auth.isEmployee) {
      const employee = auth.account;

      if (
        !event.employeeId ||
        event.employeeId.toString() !== employee._id.toString()
      ) {
        return res.status(403).json({
          success: false,
          message: "You can only delete your own events.",
        });
      }

      if (!EMPLOYEE_EVENT_TYPES.includes(event.type)) {
        return res.status(403).json({
          success: false,
          message: "You cannot delete this event.",
        });
      }

      event.isActive = false;
      event.updatedBy = employee._id;
      event.updatedByModel = "User";

      await event.save();

      return res.status(200).json({
        success: true,
        message: "Event deleted successfully.",
      });
    }

    event.isActive = false;
    event.updatedBy = auth.account._id;
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

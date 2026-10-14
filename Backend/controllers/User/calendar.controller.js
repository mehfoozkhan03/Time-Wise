import { calendarModel } from "../../models/Calendar.model.js";
import { userModel } from "../../models/User.model.js";

// ============================================================
// EMPLOYEE EVENT TYPE CONFIGURATION
// ============================================================

const EMPLOYEE_EVENT_TYPES = ["PERSONAL", "MEETING", "BIRTHDAY"];

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
    if (!req.user?.userID) {
      return res.status(404).json({
        success: false,
        message: "Account not found.",
      });
    }

    const employee = await userModel.findById(req.user.userID);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Account not found.",
      });
    }

    // ----------------------------------------------------------
    // EMPLOYEE EVENT VISIBILITY
    // ----------------------------------------------------------
    //
    // Employees can see:
    //
    // 1. Their own events
    // 2. Public events created by an Admin
    //
    // We intentionally check createdByModel === "Admin".
    // This prevents another employee's PUBLIC event from
    // appearing in the current employee's calendar.
    // ----------------------------------------------------------

    const events = await calendarModel
      .find({
        isActive: true,
        $or: [
          {
            employeeId: employee._id,
          },
          {
            createdByModel: "Admin",
            visibility: "PUBLIC",
            type: {
              $in: PUBLIC_EVENT_TYPES,
            },
          },
        ],
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
    if (!req.user?.userID) {
      return res.status(404).json({
        success: false,
        message: "Account not found.",
      });
    }

    const employee = await userModel.findById(req.user.userID);

    if (!employee) {
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
    // EMPLOYEE ACCESS CONTROL
    // ----------------------------------------------------------
    //
    // Employee can access:
    //
    // - Their own event
    // - An Admin-created PUBLIC event
    //
    // Employee cannot access another employee's event.
    // ----------------------------------------------------------

    const isOwnEvent =
      event.employeeId &&
      event.employeeId.toString() === employee._id.toString();

    const isAdminPublicEvent =
      event.createdByModel === "Admin" &&
      event.visibility === "PUBLIC" &&
      PUBLIC_EVENT_TYPES.includes(event.type);

    if (!isOwnEvent && !isAdminPublicEvent) {
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

// ============================================================
// CREATE EVENT
// ============================================================

export const createEvent = async (req, res) => {
  try {
    if (!req.user?.userID) {
      return res.status(404).json({
        success: false,
        message: "Account not found.",
      });
    }

    const employee = await userModel.findById(req.user.userID);

    if (!employee) {
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
      location,
      priority,
      color,
      isAllDay,
    } = req.body;

    // ----------------------------------------------------------
    // VALIDATE EMPLOYEE EVENT TYPE
    // ----------------------------------------------------------

    if (!EMPLOYEE_EVENT_TYPES.includes(type)) {
      return res.status(403).json({
        success: false,
        message: "You cannot create this type of event.",
      });
    }

    // ----------------------------------------------------------
    // CREATE EMPLOYEE EVENT
    // ----------------------------------------------------------
    //
    // employeeId is ALWAYS taken from the authenticated user.
    // The client cannot create an event for another employee.
    // ----------------------------------------------------------

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
    if (!req.user?.userID) {
      return res.status(404).json({
        success: false,
        message: "Account not found.",
      });
    }

    const employee = await userModel.findById(req.user.userID);

    if (!employee) {
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
    // OWN EVENT CHECK
    // ----------------------------------------------------------

    if (
      !event.employeeId ||
      event.employeeId.toString() !== employee._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "You can only update your own events.",
      });
    }

    // ----------------------------------------------------------
    // EVENT TYPE CHECK
    // ----------------------------------------------------------

    if (!EMPLOYEE_EVENT_TYPES.includes(event.type)) {
      return res.status(403).json({
        success: false,
        message: "You cannot update this event.",
      });
    }

    // ----------------------------------------------------------
    // UPDATE EVENT DATA
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

    // ----------------------------------------------------------
    // OPTIONAL EVENT TYPE UPDATE
    // ----------------------------------------------------------

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

    // ----------------------------------------------------------
    // UPDATED BY EMPLOYEE
    // ----------------------------------------------------------

    event.updatedBy = employee._id;
    event.updatedByModel = "User";

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
    if (!req.user?.userID) {
      return res.status(404).json({
        success: false,
        message: "Account not found.",
      });
    }

    const employee = await userModel.findById(req.user.userID);

    if (!employee) {
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
    // OWN EVENT CHECK
    // ----------------------------------------------------------

    if (
      !event.employeeId ||
      event.employeeId.toString() !== employee._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own events.",
      });
    }

    // ----------------------------------------------------------
    // EVENT TYPE CHECK
    // ----------------------------------------------------------

    if (!EMPLOYEE_EVENT_TYPES.includes(event.type)) {
      return res.status(403).json({
        success: false,
        message: "You cannot delete this event.",
      });
    }

    // ----------------------------------------------------------
    // SOFT DELETE
    // ----------------------------------------------------------

    event.isActive = false;
    event.updatedBy = employee._id;
    event.updatedByModel = "User";

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
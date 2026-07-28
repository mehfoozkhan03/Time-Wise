import { calendarModel } from "../models/Calendar.model.js";
import { userModel } from "../models/User.model.js";

/* =========================================
   Event Permissions
========================================= */

const ADMIN_EVENT_TYPES = [
  "PRESENT",
  "LEAVE",
  "HOLIDAY",
  "GOVERNMENT_HOLIDAY",
  "FESTIVAL",
  "SPECIAL_EVENT",
  "WORK_EVENT",
];

const EMPLOYEE_EVENT_TYPES = [
  "PERSONAL",
  "MEETING",
  "BIRTHDAY",
];

/* =========================================
   Event Visibility
========================================= */

const PUBLIC_EVENT_TYPES = [
  "HOLIDAY",
  "GOVERNMENT_HOLIDAY",
  "FESTIVAL",
  "SPECIAL_EVENT",
  "MEETING",
];

const getVisibility = (type) => {
  if (PUBLIC_EVENT_TYPES.includes(type)) {
    return "PUBLIC";
  }

  return "PRIVATE";
};
/* =========================================
   Logged In User Helper
========================================= */

// const getLoggedInUser = async (req) => {
//     return await userModel.findById(req.user.userID);
// };
const getLoggedInUser = async (req) => {
    console.log("JWT User ID:", req.user.userID);

    const user = await userModel.findById(req.user.userID);

    console.log(user);

    return user;
};

/* =========================================
   GET ALL EVENTS
========================================= */

export const getAllEvents = async (req, res) => {
    try {

        const loggedInUser = await getLoggedInUser(req);

        if (!loggedInUser) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }

        let query = {
            isActive: true,
        };

        if (loggedInUser.role !== "admin") {
            query = {
                isActive: true,
                $or: [
                    {
                        visibility: "PUBLIC",
                    },
                    {
                        employeeId: loggedInUser._id,
                    },
                ],
            };
        }

        const events = await calendarModel
            .find(query)
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

/* =========================================
   GET EVENT BY ID
========================================= */

export const getEventById = async (req, res) => {
    try {

        const loggedInUser = await getLoggedInUser(req);
                console.log("Logged User:", loggedInUser.email);
                console.log("Role:", loggedInUser.role);

        if (!loggedInUser) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }

        const event = await calendarModel.findById(req.params.id);

        if (!event || !event.isActive) {
            return res.status(404).json({
                success: false,
                message: "Event not found.",
            });
        }

        if (
            loggedInUser.role !== "admin" &&
            event.visibility === "PRIVATE" &&
            event.employeeId.toString() !== loggedInUser._id.toString()
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

/* =========================================
   CREATE EVENT
========================================= */

export const createEvent = async (req, res) => {

  try {
    const loggedInUser = await getLoggedInUser(req);

    if (!loggedInUser) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
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

    /* =========================================
       Employee Create Event
    ========================================= */

    if (loggedInUser.role === "employee") {
      if (!EMPLOYEE_EVENT_TYPES.includes(type)) {
        return res.status(403).json({
          success: false,
          message: "You cannot create this type of event.",
        });
      }

      const event = await calendarModel.create({
        title,
        description,
        type,
        date,
        startTime,
        endTime,

        employeeId: loggedInUser._id,

        employeeName:
          loggedInUser.name ||
          `${loggedInUser.firstName} ${loggedInUser.lastName}`,

        department: loggedInUser.department,
        designation: loggedInUser.designation,

        location,
        priority,
        color,
        isAllDay,

        visibility: getVisibility(type),

        createdBy: loggedInUser._id,
      });

      return res.status(201).json({
        success: true,
        message: "Event created successfully.",
        data: event,
      });
    }

    /* =========================================
       Admin Create Event
    ========================================= */

    if (!ADMIN_EVENT_TYPES.includes(type)) {
      return res.status(403).json({
        success: false,
        message: "Invalid event type.",
      });
    }

    const employee = await userModel.findById(employeeId);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found.",
      });
    }

    const event = await calendarModel.create({
      title,
      description,
      type,
      date,
      startTime,
      endTime,

      employeeId,

      employeeName:
        employee.name ||
        `${employee.firstName} ${employee.lastName}`,

      department: employee.department,
      designation: employee.designation,

      location,
      priority,
      color,
      isAllDay,

      visibility: getVisibility(type),

      createdBy: loggedInUser._id,
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

/* =========================================
   UPDATE EVENT
========================================= */

export const updateEvent = async (req, res) => {
  try {
    const loggedInUser = await getLoggedInUser(req);

    if (!loggedInUser) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const event = await calendarModel.findById(req.params.id);

    if (!event || !event.isActive) {
      return res.status(404).json({
        success: false,
        message: "Event not found.",
      });
    }

    /* =========================================
       Employee Update
    ========================================= */

    if (loggedInUser.role === "employee") {
      if (event.employeeId.toString() !== loggedInUser._id.toString()) {
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

      event.updatedBy = loggedInUser._id;

      await event.save();

      return res.status(200).json({
        success: true,
        message: "Event updated successfully.",
        data: event,
      });
    }

    /* =========================================
       Admin Update
    ========================================= */

    if (req.body.type) {
      if (!ADMIN_EVENT_TYPES.includes(req.body.type)) {
        return res.status(403).json({
          success: false,
          message: "Invalid event type.",
        });
      }

      event.type = req.body.type;
      event.visibility = getVisibility(req.body.type);
    }

    if (req.body.employeeId) {
      const employee = await userModel.findById(req.body.employeeId);

      if (!employee) {
        return res.status(404).json({
          success: false,
          message: "Employee not found.",
        });
      }

      event.employeeId = employee._id;
      event.employeeName =
        employee.name ||
        `${employee.firstName} ${employee.lastName}`;
      event.department = employee.department;
      event.designation = employee.designation;
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

    event.updatedBy = loggedInUser._id;

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

/* =========================================
   DELETE EVENT
========================================= */

export const deleteEvent = async (req, res) => {
  try {
    const loggedInUser = await getLoggedInUser(req);

    if (!loggedInUser) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const event = await calendarModel.findById(req.params.id);

    if (!event || !event.isActive) {
      return res.status(404).json({
        success: false,
        message: "Event not found.",
      });
    }

    /* =========================================
       Employee Delete
    ========================================= */

    if (loggedInUser.role === "employee") {
      if (event.employeeId.toString() !== loggedInUser._id.toString()) {
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
      event.updatedBy = loggedInUser._id;

      await event.save();

      return res.status(200).json({
        success: true,
        message: "Event deleted successfully.",
      });
    }

    /* =========================================
       Admin Delete
    ========================================= */

    event.isActive = false;
    event.updatedBy = loggedInUser._id;

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
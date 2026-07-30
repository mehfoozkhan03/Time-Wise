import { calendarModel } from '../models/Calendar.model.js';
import { userModel } from '../models/User.model.js';
import { AdminModel } from '../models/Admin.model.js';

/* =========================================
   Event Permissions
========================================= */

const ADMIN_EVENT_TYPES = [
  'PRESENT',
  'LEAVE',
  'HOLIDAY',
  'GOVERNMENT_HOLIDAY',
  'FESTIVAL',
  'SPECIAL_EVENT',
  'WORK_EVENT',
];

const EMPLOYEE_EVENT_TYPES = ['PERSONAL', 'MEETING', 'BIRTHDAY'];

/* =========================================
   Event Visibility
========================================= */

const PUBLIC_EVENT_TYPES = [
  'HOLIDAY',
  'GOVERNMENT_HOLIDAY',
  'FESTIVAL',
  'SPECIAL_EVENT',
  'MEETING',
];

const getVisibility = (type) => {
  if (PUBLIC_EVENT_TYPES.includes(type)) {
    return 'PUBLIC';
  }
  return 'PRIVATE';
};
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
      accountType: 'employee',
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
      accountType: 'admin',
      isEmployee: false,
      isAdmin: true,
    };
  }

  return null;
};

/* =========================================
   GET ALL EVENTS
========================================= */

export const getAllEvents = async (req, res) => {
  try {
    const auth = await getLoggedInAccount(req);

    if (!auth) {
      return res.status(404).json({
        success: false,
        message: 'Account not found.',
      });
    }

    let query = {
      isActive: true,
    };

    // Employees can only see public events + their own events
    if (!auth.isAdmin) {
      query = {
        isActive: true,
        $or: [
          {
            visibility: 'PUBLIC',
          },
          {
            employeeId: auth.account._id,
          },
        ],
      };
    }

    // Admins can see all active events

    const events = await calendarModel.find(query).sort({ date: 1 });

    return res.status(200).json({
      success: true,
      count: events.length,
      data: events,
    });
  } catch (error) {
    console.error('Get Events Error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to fetch calendar events.',
    });
  }
};

/* =========================================
   GET EVENT BY ID
========================================= */

export const getEventById = async (req, res) => {
  try {
    const auth = await getLoggedInAccount(req);

    if (!auth) {
      return res.status(404).json({
        success: false,
        message: 'Account not found.',
      });
    }

    console.log('Logged Account:', auth.account.email);
    console.log('Account Type:', auth.accountType);

    const event = await calendarModel.findById(req.params.id);

    if (!event || !event.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Event not found.',
      });
    }

    // Employees can only view their own private events
    if (
      !auth.isAdmin &&
      event.visibility === 'PRIVATE' &&
      event.employeeId.toString() !== auth.account._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Access denied.',
      });
    }

    return res.status(200).json({
      success: true,
      data: event,
    });
  } catch (error) {
    console.error('Get Event Error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to fetch event.',
    });
  }
};

/* =========================================
   CREATE EVENT
========================================= */

export const createEvent = async (req, res) => {
  try {
    const auth = await getLoggedInAccount(req);

    if (!auth) {
      return res.status(404).json({
        success: false,
        message: 'Account not found.',
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

    if (auth.isEmployee) {
      if (!EMPLOYEE_EVENT_TYPES.includes(type)) {
        return res.status(403).json({
          success: false,
          message: 'You cannot create this type of event.',
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

        employeeName:
          employee.name || `${employee.firstName} ${employee.lastName}`,

        department: employee.department,
        designation: employee.designation,

        location,
        priority,
        color,
        isAllDay,

        visibility: getVisibility(type),

        // createdBy: employee._id,
        createdBy: employee._id,
        createdByModel: "User",
      });

      return res.status(201).json({
        success: true,
        message: 'Event created successfully.',
        data: event,
      });
    }

    /* =========================================
       Admin Create Event
    ========================================= */

    if (!ADMIN_EVENT_TYPES.includes(type)) {
      return res.status(403).json({
        success: false,
        message: 'Invalid event type.',
      });
    }

    const employee = await AdminModel.findById(employeeId);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found.',
      });
    }

    const event = await calendarModel.create({
      title,
      description,
      type,
      date,
      startTime,
      endTime,

      employeeId: employee._id,

      employeeName:
        employee.name ||
        `${employee.firstName} ${employee.lastName}` ||
        'no name given',

      department: employee.department || 'not assigned',
      designation: employee.designation || 'untitled',

      location,
      priority,
      color,
      isAllDay,

      visibility: getVisibility(type),

      // Logged in admin
      createdBy: auth.account._id,
      createdByModel: "Admin",
    });

    return res.status(201).json({
      success: true,
      message: 'Event created successfully.',
      data: event,
    });
  } catch (error) {
    console.error('Create Event Error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to create event.',
    });
  }
};

/* =========================================
   UPDATE EVENT
========================================= */

export const updateEvent = async (req, res) => {
  try {
    const auth = await getLoggedInAccount(req);

    if (!auth) {
      return res.status(404).json({
        success: false,
        message: 'Account not found.',
      });
    }

    const event = await calendarModel.findById(req.params.id);

    if (!event || !event.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Event not found.',
      });
    }

    /* =========================================
       Employee Update
    ========================================= */

    if (auth.isEmployee) {
      const employee = auth.account;

      if (event.employeeId.toString() !== employee._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'You can only update your own events.',
        });
      }

      if (!EMPLOYEE_EVENT_TYPES.includes(event.type)) {
        return res.status(403).json({
          success: false,
          message: 'You cannot update this event.',
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
            message: 'Invalid event type.',
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
        message: 'Event updated successfully.',
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
          message: 'Invalid event type.',
        });
      }

      event.type = req.body.type;
      event.visibility = getVisibility(req.body.type);
    }

    if (req.body.employeeId) {
      const employee = await AdminModel.findById(req.body.employeeId);

      if (!employee) {
        return res.status(404).json({
          success: false,
          message: 'Employee not found.',
        });
      }

      event.employeeId = employee._id;
      event.employeeName =
        employee.name || `${employee.firstName} ${employee.lastName}`;
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

    // Logged-in admin
    event.updatedBy = auth.account._id;
    event.updatedByModel = "Admin";

    await event.save();

    return res.status(200).json({
      success: true,
      message: 'Event updated successfully.',
      data: event,
    });
  } catch (error) {
    console.error('Update Event Error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to update event.',
    });
  }
};

/* =========================================
   DELETE EVENT
========================================= */

export const deleteEvent = async (req, res) => {
  try {
    const auth = await getLoggedInAccount(req);

    if (!auth) {
      return res.status(404).json({
        success: false,
        message: 'Account not found.',
      });
    }

    const event = await calendarModel.findById(req.params.id);

    if (!event || !event.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Event not found.',
      });
    }

    /* =========================================
       Employee Delete
    ========================================= */

    if (auth.isEmployee) {
      const employee = auth.account;

      if (event.employeeId.toString() !== employee._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'You can only delete your own events.',
        });
      }

      if (!EMPLOYEE_EVENT_TYPES.includes(event.type)) {
        return res.status(403).json({
          success: false,
          message: 'You cannot delete this event.',
        });
      }

      event.isActive = false;
      event.updatedBy = employee._id;
      event.updatedByModel = "User";

      await event.save();

      return res.status(200).json({
        success: true,
        message: 'Event deleted successfully.',
      });
    }

    /* =========================================
       Admin Delete
    ========================================= */

    event.isActive = false;
    event.updatedBy = auth.account._id;
    event.updatedByModel = "Admin";

    await event.save();

    return res.status(200).json({
      success: true,
      message: 'Event deleted successfully.',
    });
  } catch (error) {
    console.error('Delete Event Error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to delete event.',
    });
  }
};

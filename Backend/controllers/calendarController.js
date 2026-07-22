import { calendarModel } from "../models/Calendar.model.js";
import { userModel } from "../models/User.model.js";

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

const getVisibility = (type) =>
    PUBLIC_EVENT_TYPES.includes(type)
        ? "PUBLIC"
        : "PRIVATE";

/* =========================================
   Logged In User Helper
========================================= */

const getLoggedInUser = async (req) => {
    return await userModel.findById(req.user.userID);
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

        if (loggedInUser.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Only admin can create calendar events.",
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

        if (loggedInUser.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Only admin can update calendar events.",
            });
        }

        const event = await calendarModel.findById(req.params.id);

        if (!event || !event.isActive) {
            return res.status(404).json({
                success: false,
                message: "Event not found.",
            });
        }

        Object.assign(event, req.body);

        if (req.body.type) {
            event.visibility = getVisibility(req.body.type);
        }

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

        if (loggedInUser.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Only admin can delete calendar events.",
            });
        }

        const event = await calendarModel.findById(req.params.id);

        if (!event || !event.isActive) {
            return res.status(404).json({
                success: false,
                message: "Event not found.",
            });
        }

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
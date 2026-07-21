import { calendarModel } from "../models/Calendar.model.js";
import { userModel } from "../models/User.model.js";

/* =========================================
   GET ALL CALENDAR EVENTS
========================================= */

export const getAllEvents = async (req, res) => {
    try {
        const events = await calendarModel
            .find({ isActive: true })
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
   GET SINGLE EVENT
========================================= */

export const getEventById = async (req, res) => {
    try {
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

/* =========================================
   CREATE EVENT
========================================= */

export const createEvent = async (req, res) => {
    try {
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

            createdBy: req.user?._id ?? employee._id,
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
        const event = await calendarModel.findById(req.params.id);

        if (!event || !event.isActive) {
            return res.status(404).json({
                success: false,
                message: "Event not found.",
            });
        }

        Object.assign(event, req.body);

        event.updatedBy = req.user?._id ?? null;

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
   DELETE EVENT (Soft Delete)
========================================= */

export const deleteEvent = async (req, res) => {
    try {
        const event = await calendarModel.findById(req.params.id);

        if (!event || !event.isActive) {
            return res.status(404).json({
                success: false,
                message: "Event not found.",
            });
        }

        event.isActive = false;
        event.updatedBy = req.user?._id ?? null;

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
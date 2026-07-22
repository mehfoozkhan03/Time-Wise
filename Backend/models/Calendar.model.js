import mongoose from "mongoose";

const calendarSchema = new mongoose.Schema(
    {
        /* ==========================
           Event Information
        ========================== */

        title: {
            type: String,
            required: true,
            trim: true,
            maxlength: 100,
        },

        description: {
            type: String,
            trim: true,
            default: "",
            maxlength: 500,
        },

        type: {
            type: String,
            required: true,
            enum: [
                "PRESENT",
                "LEAVE",
                "BIRTHDAY",
                "HOLIDAY",
                "GOVERNMENT_HOLIDAY",
                "FESTIVAL",
                "WORK_EVENT",
                "SPECIAL_EVENT",
                "MEETING",
            ],
        },

        /* ==========================
           Date & Time
        ========================== */

        date: {
            type: Date,
            required: true,
        },

        startTime: {
            type: String,
            default: "",
        },

        endTime: {
            type: String,
            default: "",
        },

        isAllDay: {
            type: Boolean,
            default: false,
        },

        /* ==========================
           Employee
        ========================== */

        employeeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        // Snapshot values for fast UI & history
        employeeName: {
            type: String,
            required: true,
            trim: true,
        },

        department: {
            type: String,
            default: null,
        },

        designation: {
            type: String,
            default: null,
        },

        /* ==========================
           Extra Information
        ========================== */

        location: {
            type: String,
            default: "",
            trim: true,
        },

        priority: {
            type: String,
            enum: ["LOW", "MEDIUM", "HIGH"],
            default: "MEDIUM",
        },

        color: {
            type: String,
            default: "",
        },

        /* ==========================
           Access Control
        ========================== */

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        updatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },

        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

export const calendarModel = mongoose.model(
    "CalendarEvent",
    calendarSchema
);
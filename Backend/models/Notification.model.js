// import mongoose from 'mongoose';

// const notificationSchema = new mongoose.Schema(
//   {
//     // ================= Sender =================

//     sender: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'User',
//       required: true,
//       index: true,
//     },

//     // ================= Notification =================

//     title: {
//       type: String,
//       required: true,
//       trim: true,
//     },

//     message: {
//       type: String,
//       required: true,
//       trim: true,
//     },

//     type: {
//       type: String,
//       enum: ['attendance', 'post', 'announcement', 'leave', 'system'],
//       required: true,
//     },

//     // ================= Reference =================

//     referenceModel: {
//       type: String,
//       enum: ['Post', 'Attendance', 'Leave', 'Announcement'],
//       default: null,
//     },

//     referenceId: {
//       type: mongoose.Schema.Types.ObjectId,
//       refPath: 'referenceModel',
//       default: null,
//     },

//     // ================= Audience =================

//     audienceType: {
//       type: String,
//       enum: ['all', 'department', 'specific'],
//       default: 'all',
//     },

//     targetUsers: [
//       {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'User',
//       },
//     ],

//     // Future use
//     targetDepartment: {
//       type: String,
//       default: null,
//     },

//     // ================= Admin Control =================

//     isArchived: {
//       type: Boolean,
//       default: false,
//     },
//   },
//   {
//     timestamps: true,
//     versionKey: false,
//   },
// );

// notificationSchema.index({
//   createdAt: -1,
// });

// export const notificationModel = mongoose.model(
//   'Notification',
//   notificationSchema,
// );



import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "senderModel",
      required: true,
      index: true,
    },

    senderModel: {
      type: String,
      enum: ["User", "Admin"],
      default: "User",
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: [
        "attendance",
        "post",
        "announcement",
        "leave",
        "system",
      ],
      required: true,
    },

    referenceModel: {
      type: String,
      enum: ["Post", "Attendance", "Leave", "Announcement"],
      default: null,
    },

    referenceId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "referenceModel",
      default: null,
    },

    audienceType: {
      type: String,
      enum: ["all", "department", "designation", "specific"],
      default: "all",
    },

    // Snapshot of the recipients selected when the notification was created.
    targetUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    targetDepartment: {
      type: String,
      default: null,
    },

    targetDesignation: {
      type: String,
      default: null,
    },

    isArchived: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

notificationSchema.index({ createdAt: -1 });
notificationSchema.index({ targetUsers: 1, createdAt: -1 });

export const notificationModel = mongoose.model(
  "Notification",
  notificationSchema
);

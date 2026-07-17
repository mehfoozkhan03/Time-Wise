import mongoose from 'mongoose'

const attendanceSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    date: {
      type: Date,
      required: true,
    },

    checkInTime: {
      type: Date,
      default: null,
    },

    checkOutTime: {
      type: Date,
      default: null,
    },

    breaks: [
      {
        breakStart: {
          type: Date,
          required: true,
        },

        breakEnd: {
          type: Date,
          default: null,
        },

        duration: {
          type: Number,
          default: 0,
        },
      },
    ],

    totalBreakSeconds: {
      type: Number,
      default: 0,
    },

    totalWorkingSeconds: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ['Present', 'Late', 'Absent', 'Leave', 'Holiday', 'Half Day'],
      default: 'Absent',
    },

    notes: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
  },
)

attendanceSchema.index(
  {
    user: 1,
    date: 1,
  },
  {
    unique: true,
  },
)

export const attendanceModel = mongoose.model('Attendance', attendanceSchema)

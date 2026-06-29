import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    attendanceDate: {
      type: Date,
      required: true,
    },

    checkInTime: Date,
    checkOutTime: Date,

    breaks: [
      {
        breakStart: Date,
        breakEnd: Date,
        duration: Number,
      },
    ],

    totalBreakMinutes: {
      type: Number,
      default: 0,
    },

    totalWorkingMinutes: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ['Present', 'Absent', 'Leave', 'Holiday'],
      default: 'Absent',
    },

    // Extra fields for filtering
    day: Number,
    month: Number,
    year: Number,
  },
  {
    timestamps: true,
  },
);

// Prevent duplicate attendance for same day
attendanceSchema.index(
  {
    user: 1,
    attendanceDate: 1,
  },
  {
    unique: true,
  },
);

export const attendanceModel = mongoose.model('Attendance', attendanceSchema);

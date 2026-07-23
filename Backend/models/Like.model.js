import mongoose from 'mongoose'

const likeSchema = new mongoose.Schema(
  {
    // ================= User =================

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    // ================= Target =================

    targetType: {
      type: String,
      enum: ['post', 'comment'],
      required: true,
      index: true,
    },

    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
)

// Prevent duplicate likes
likeSchema.index(
  {
    user: 1,
    targetType: 1,
    targetId: 1,
  },
  {
    unique: true,
  },
)

export const likeModel = mongoose.model('Like', likeSchema)

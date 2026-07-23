import mongoose from 'mongoose'

const postSchema = new mongoose.Schema(
  {
    // ================= Author =================

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    // ================= Content =================

    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },

    image: {
      type: String,
      default: null,
    },

    type: {
      type: String,
      enum: ['general', 'thought', 'announcement', 'achievement', 'question'],
      default: 'general',
    },

    tags: [
      {
        type: String,
        trim: true,
      },
    ],

    // ================= Engagement =================

    likesCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    commentsCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    // ================= Visibility =================

    visibility: {
      type: String,
      enum: ['public', 'department'],
      default: 'public',
    },

    allowComments: {
      type: Boolean,
      default: true,
    },

    // ================= Featured =================

    isFeatured: {
      type: Boolean,
      default: false,
    },

    featuredDate: {
      type: Date,
      default: null,
    },

    featuredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },

    // ================= Edit History =================

    isEdited: {
      type: Boolean,
      default: false,
    },

    editedAt: {
      type: Date,
      default: null,
    },

    editedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },

    // ================= Soft Delete =================

    isDeleted: {
      type: Boolean,
      default: false,
    },

    deletedAt: {
      type: Date,
      default: null,
    },

    deletedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
)

export const postModel = mongoose.model('Post', postSchema)

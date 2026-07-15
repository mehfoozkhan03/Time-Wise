import mongoose from 'mongoose'

const commentSchema = new mongoose.Schema(
  {
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    text: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },

    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    timestamps: true,
    _id: true,
    versionKey: false,
  },
)

const postSchema = new mongoose.Schema(
  {
    // ================= Relations =================

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
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

    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],

    comments: [commentSchema],

    // ================= Featured Thought =================

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

    // ================= Status =================

    isEdited: {
      type: Boolean,
      default: false,
    },

    editedAt: {
      type: Date,
      default: null,
    },

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

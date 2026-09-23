import multer from 'multer'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import cloudinary from '../config/cloudinary.js'

// =======================================================
// CLOUDINARY STORAGE
// =======================================================

const storage = new CloudinaryStorage({
  cloudinary,

  params: async (req, file) => {
    // ===================================================
    // IMAGES
    // ===================================================

    if (file.fieldname === 'images') {
      return {
        folder: 'timewise/posts/images',
        resource_type: 'image',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
      }
    }

    // ===================================================
    // ATTACHMENTS
    // ===================================================

    return {
      folder: 'timewise/posts/attachments',
      resource_type: 'raw',
    }
  },
})

// =======================================================
// FILE FILTER
// =======================================================

const fileFilter = (req, file, cb) => {
  // =====================================================
  // IMAGE VALIDATION
  // =====================================================

  if (file.fieldname === 'images') {
    const allowedImageTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
    ]

    if (allowedImageTypes.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error('Only JPG, JPEG, PNG and WEBP images are allowed.'), false)
    }

    return
  }

  // =====================================================
  // ATTACHMENT VALIDATION
  // =====================================================

  if (file.fieldname === 'attachments') {
    const allowedAttachmentTypes = [
      'application/pdf',

      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',

      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',

      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',

      'text/plain',
    ]

    if (allowedAttachmentTypes.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(
        new Error(
          'Only PDF, Word, Excel, PowerPoint and TXT files are allowed.',
        ),
        false,
      )
    }

    return
  }

  // =====================================================
  // UNKNOWN FIELD
  // =====================================================

  cb(new Error('Invalid upload field.'), false)
}

// =======================================================
// COMBINED POST UPLOAD
// =======================================================

export const uploadPostFiles = multer({
  storage,
  fileFilter,

  limits: {
    fileSize: 10 * 1024 * 1024,
  },
})

import multer from 'multer'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import { randomUUID } from 'crypto'
import { extname } from 'path'

import cloudinary from '../config/cloudinary.js'

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    if (file.fieldname === 'images') {
      return {
        folder: 'timewise/posts/images',
        resource_type: 'image',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
      }
    }

    if (file.fieldname === 'attachments') {
      const extension = extname(file.originalname).toLowerCase()

      return {
        folder: 'timewise/posts/attachments',
        resource_type: 'raw',
        public_id: `${randomUUID()}${extension}`,
      }
    }

    throw new Error('Invalid upload field.')
  },
})

const fileFilter = (req, file, cb) => {
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

  cb(new Error('Invalid upload field.'), false)
}

export const uploadPostFiles = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
})

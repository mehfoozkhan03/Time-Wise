import multer from 'multer'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import { randomUUID } from 'crypto'

import cloudinary from '../config/cloudinary.js'

const allowedMimeTypes = new Set(['image/jpeg', 'image/jpg', 'image/png', 'image/webp'])

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'timewise/profiles',
    resource_type: 'image',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    public_id: () => randomUUID(),
  },
})

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024, files: 1 },
  fileFilter: (_req, file, callback) => {
    if (!allowedMimeTypes.has(file.mimetype)) {
      callback(new Error('Please upload a JPG, PNG or WebP image.'))
      return
    }

    callback(null, true)
  },
})

export const uploadProfileImage = (req, res, next) => {
  upload.single('profileImage')(req, res, (error) => {
    if (!error) {
      next()
      return
    }

    const isSizeError = error.code === 'LIMIT_FILE_SIZE'
    const isTypeError = error.message === 'Please upload a JPG, PNG or WebP image.'

    res.status(isSizeError || isTypeError ? 400 : 500).json({
      success: false,
      message: isSizeError
        ? 'Profile image must be 5 MB or smaller.'
        : isTypeError
          ? error.message
          : 'Unable to upload profile image.',
    })
  })
}

import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

import { userModel } from '../../models/User.model.js'
import { AdminModel } from '../../models/Admin.model.js'
import cloudinary from '../../config/cloudinary.js'

const getStoredCloudinaryImagePublicId = (user) => {
  if (user.profileImagePublicId) return user.profileImagePublicId
  if (!user.profileImage) return null

  try {
    const imageUrl = new URL(user.profileImage)
    const cloudName = cloudinary.config().cloud_name
    const uploadPath = `/${cloudName}/image/upload/`

    if (
      imageUrl.protocol !== 'https:' ||
      imageUrl.hostname !== 'res.cloudinary.com' ||
      !cloudName ||
      !imageUrl.pathname.startsWith(uploadPath)
    ) {
      return null
    }

    const segments = imageUrl.pathname.slice(uploadPath.length).split('/')
    const versionIndex = segments.findIndex((segment) => /^v\d+$/.test(segment))

    if (versionIndex === -1) return null

    const publicIdSegments = segments.slice(versionIndex + 1)
    const lastSegmentIndex = publicIdSegments.length - 1
    publicIdSegments[lastSegmentIndex] = publicIdSegments[lastSegmentIndex]
      ?.replace(/\.[a-z0-9]+$/i, '')

    const publicId = publicIdSegments.join('/')
    return publicId || null
  } catch {
    return null
  }
}

// ================= Validation ===============

const validateSignup = (body) => {
  return (
    body.firstName?.trim() &&
    body.lastName?.trim() &&
    body.email?.trim() &&
    body.password?.trim()
  )
}

const validateLogin = (body) => {
  return body.email?.trim() && body.password?.trim()
}

// ================= Signup ===============

export const signup = async (req, res) => {
  try {
    if (!validateSignup(req.body)) {
      return res.status(400).json({
        success: false,
        title: 'Signup Failed',
        message: 'Please fill all required fields.',
        reason: 'One or more required fields are empty.',
      })
    }

    const existingUser = await userModel.findOne({
      email: req.body.email,
    })

    if (existingUser) {
      return res.status(409).json({
        success: false,
        title: 'Account Already Exists',
        message: 'User already exists. Please login.',
        reason: 'Please sign in instead or use another email address.',
      })
    }

    const admins = await AdminModel.find()

    const salt = await bcrypt.genSalt(+process.env.saltRounds)

    const hashedPassword = await bcrypt.hash(req.body.password, salt)

    const userCreated = await userModel.create({
      firstName: req.body.firstName.trim(),
      lastName: req.body.lastName.trim(),

      email: req.body.email.trim().toLowerCase(),

      password: hashedPassword,

      dob: req.body.dob || null,

      gender: req.body.gender || null,

      role: req.body.role || null,

      department: req.body.department || null,

      designation: req.body.designation || null,

      profileImage: req.body.profileImage || null,

      theme: req.body.theme || 'system',

      adminID: admins[0]?._id ?? null,
    })

    const user = userCreated.toObject()

    delete user.password

    return res.status(201).json({
      success: true,
      title: 'Welcome to TimeWise!',
      message: 'Your account has been created successfully.',
      description: 'You can now sign in and start using TimeWise.',
      reason: 'Your account is ready to use.',
      user,
      role: 'user',
    })
  } catch (error) {
    console.error('Signup Error:', error)

    // Check if it's a MongoDB connection error
    if (error.name === 'MongooseError' || error.message.includes('connect')) {
      return res.status(500).json({
        success: false,
        title: 'Database Connection Error',
        message: 'Unable to connect to the database.',
        reason:
          'The server encountered a database issue. Please try again in a moment.',
      })
    }

    // Check if it's a validation error
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        title: 'Validation Error',
        message: 'Please check your input.',
        reason: Object.values(error.errors)
          .map((e) => e.message)
          .join(', '),
      })
    }

    // Generic server error
    return res.status(500).json({
      success: false,
      title: 'Something Went Wrong',
      message: 'An unexpected error occurred during signup.',
      reason:
        process.env.NODE_ENV === 'development'
          ? error.message
          : 'Please try again in a few moments.',
    })
  }
}

// ================= User Login ===============

export const login = async (req, res) => {
  try {
    if (!validateLogin(req.body)) {
      return res.status(400).json({
        success: false,
        title: 'Login Failed',
        message: 'Email and password are required.',
        reason: 'Please enter both your email address and password.',
      })
    }

    const userData = await userModel.findOne({
      email: req.body.email.trim().toLowerCase(),
    })

    if (!userData) {
      return res.status(404).json({
        success: false,
        title: 'Account Not Found',
        message: 'No account was found with this email.',
        reason: 'Check the email address or create a new account.',
      })
    }

    const isMatch = await bcrypt.compare(req.body.password, userData.password)

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        title: 'Login Failed',
        message: 'Incorrect password.',
        reason: 'The password you entered is incorrect.',
      })
    }

    userData.lastActiveAt = new Date()
    await userData.save()

    const token = jwt.sign(
      {
        userID: userData._id,
        userEmail: userData.email,
        role: 'user',
      },
      process.env.PrivateKey,
      {
        expiresIn: '12h',
      },
    )

    res.cookie('token', token, {
      httpOnly: false,
      secure: false,
      sameSite: 'Lax',
      maxAge: (24 / 2) * 60 * 60 * 1000,
    })

    const user = userData.toObject()
    delete user.password

    return res.status(200).json({
      success: true,
      title: 'Welcome Back!',
      message: 'Login successful.',
      description: 'Redirecting you to your home...',
      reason: 'You have been successfully authenticated.',
      user,
      role: 'user',
    })
  } catch (error) {
    console.error('Login Error:', error)

    // Check if it's a MongoDB connection error
    if (error.name === 'MongooseError' || error.message.includes('connect')) {
      return res.status(500).json({
        success: false,
        title: 'Database Connection Error',
        message: 'Unable to connect to the database.',
        reason:
          'The server encountered a database issue. Please try again in a moment.',
      })
    }

    // Check if it's a JWT error
    if (error.name === 'JsonWebTokenError') {
      return res.status(500).json({
        success: false,
        title: 'Authentication Error',
        message: 'Failed to generate authentication token.',
        reason: 'Please try logging in again.',
      })
    }

    // Generic server error
    return res.status(500).json({
      success: false,
      title: 'Something Went Wrong',
      message: 'An unexpected error occurred during login.',
      reason:
        process.env.NODE_ENV === 'development'
          ? error.message
          : 'Please try again in a few moments.',
    })
  }
}

// ================= Current User ===============

export const getCurrentUser = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.userID).select('-password')

    if (!user) {
      return res.status(404).json({
        success: false,
        title: 'Account Not Found',
        message: 'No account was found.',
        reason: 'Your account may have been deleted or is inaccessible.',
      })
    }

    return res.status(200).json({
      success: true,
      title: 'Profile Loaded',
      message: 'User profile loaded successfully.',
      description: 'Latest profile information has been retrieved.',
      reason: 'Your profile is up to date.',
      user,
    })
  } catch (error) {
    console.error('Get Current User Error:', error)

    // Check if it's a MongoDB connection error
    if (error.name === 'MongooseError' || error.message.includes('connect')) {
      return res.status(500).json({
        success: false,
        title: 'Database Connection Error',
        message: 'Unable to connect to the database.',
        reason:
          'The server encountered a database issue. Please try again in a moment.',
      })
    }

    // Generic server error
    return res.status(500).json({
      success: false,
      title: 'Something Went Wrong',
      message: 'An unexpected error occurred while fetching your profile.',
      reason:
        process.env.NODE_ENV === 'development'
          ? error.message
          : 'Please try again in a few moments.',
    })
  }
}

//# ================= Update User Profile =================

export const updateProfile = async (req, res) => {
  let keepUploadedImage = false

  try {
    const userId = req.user.userID

    const currentUser = await userModel
      .findById(userId)
      .select('profileImage profileImagePublicId firstName lastName email phone address bio')

    if (!currentUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      })
    }

    // Only update fields included in the request. This lets photo-only saves
    // keep the existing account details without resending them from the UI.
    const body = req.body || {}
    const update = {}
    for (const field of ['firstName', 'lastName', 'email']) {
      if (!Object.prototype.hasOwnProperty.call(body, field)) continue

      const value = body[field]?.trim() || ''
      // Empty name/email fields from an image-only form are treated as omitted;
      // never replace the already registered value with an empty string.
      if (!value) continue

      update[field] = field === 'email' ? value.toLowerCase() : value
    }

    for (const field of ['phone', 'address', 'bio']) {
      if (Object.prototype.hasOwnProperty.call(body, field)) {
        update[field] = body[field]?.trim() || ''
      }
    }

    if (update.email && update.email !== currentUser.email) {
      const existingUser = await userModel.findOne({
        email: update.email,
        _id: { $ne: userId },
      })

      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: 'This email is already being used by another account.',
        })
      }
    }

    if (req.file) {
      update.profileImage = req.file.path
      update.profileImagePublicId = req.file.filename
    }

    const updatedUser = await userModel
      .findByIdAndUpdate(
        userId,
        update,
        {
          returnDocument: "after",
          runValidators: true,
        },
      )
      .select('-password')

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      })
    }

    keepUploadedImage = true

    const previousImagePublicId = getStoredCloudinaryImagePublicId(currentUser)

    if (req.file && previousImagePublicId) {
      try {
        await cloudinary.uploader.destroy(previousImagePublicId, {
          resource_type: 'image',
          invalidate: true,
        })
      } catch (deleteError) {
        console.error('Previous profile image cleanup failed:', deleteError.message)
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      user: updatedUser,
    })
  } catch (error) {
    console.error('Update Profile Error:', error)

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'This email is already in use.',
      })
    }

    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Please check your input.',
        reason: Object.values(error.errors)
          .map((err) => err.message)
          .join(', '),
      })
    }

    return res.status(500).json({
      success: false,
      message: 'Failed to update profile.',
      reason:
        process.env.NODE_ENV === 'development'
          ? error.message
          : 'Please try again later.',
    })
  } finally {
    if (!keepUploadedImage && req.file?.filename) {
      try {
        await cloudinary.uploader.destroy(req.file.filename, {
          resource_type: 'image',
          invalidate: true,
        })
      } catch (cleanupError) {
        console.error('Uncommitted profile image cleanup failed:', cleanupError.message)
      }
    }
  }
}

// ================= User Status ==================
export const updateActivity = async (req, res) => {
  try {
    await userModel.findByIdAndUpdate(req.user.userID, {
      lastActiveAt: new Date(),
    })

    return res.status(200).json({
      success: true,
      message: 'Activity updated',
    })
  } catch (error) {
    console.error('Update Activity Error:', error)

    return res.status(500).json({
      success: false,
      message: 'Failed to update activity',
    })
  }
}

// ================= Community User Profile ===============

export const getUserProfile = async (req, res) => {
  try {
    const { userId } = req.params

    const user = await userModel
      .findById(userId)
      .select(
        '_id firstName lastName email designation department profileImage createdAt lastActiveAt',
      )

    if (!user) {
      return res.status(404).json({
        success: false,
        title: 'User Not Found',
        message: 'The requested user profile was not found.',
        reason: 'The user may have been deleted or does not exist.',
      })
    }

    return res.status(200).json({
      success: true,
      title: 'Profile Loaded',
      message: 'User profile loaded successfully.',
      user,
    })
  } catch (error) {
    console.error('Get User Profile Error:', error)

    return res.status(500).json({
      success: false,
      title: 'Something Went Wrong',
      message: 'Unable to load user profile.',
      reason: error.message,
    })
  }
}

// ================= Logout =================

export const logout = async (req, res) => {
  try {
    res.clearCookie('token', {
      httpOnly: false,
      secure: false,
      sameSite: 'Lax',
    })

    return res.status(200).json({
      success: true,
      title: 'See You Soon!',
      message: 'You have been logged out successfully.',
      description: 'Have a wonderful day. We look forward to seeing you again!',
      reason: 'You have been successfully logged out.',
    })
  } catch (error) {
    console.error('Logout Error:', error)

    return res.status(500).json({
      success: false,
      title: 'Something Went Wrong',
      message: 'An unexpected error occurred during logout.',
      reason:
        process.env.NODE_ENV === 'development'
          ? error.message
          : 'Please try again in a few moments.',
    })
  }
}

import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

import { userModel } from '../models/User.model.js'
import { AdminModel } from '../models/Admin.model.js'

// ================= Validation =================

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

// ================= Signup =================

export const signup = async (req, res) => {
  try {
    if (!validateSignup(req.body)) {
      return res.status(400).json({
        success: false,
        message: 'Please fill all required fields.',
      })
    }

    const existingUser = await userModel.findOne({
      email: req.body.email,
    })

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User already exists. Please login.',
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

      role: req.body.role || 'employee',

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
      message: 'User created successfully.',
      user,
    })
  } catch (error) {
    console.error('Signup Error:', error)

    return res.status(500).json({
      success: false,
      message: 'Internal Server Error.',
    })
  }
}

// ================= User Login =================

export const login = async (req, res) => {
  try {
    if (!validateLogin(req.body)) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required.',
      })
    }

    const userData = await userModel.findOne({
      email: req.body.email.trim().toLowerCase(),
    })

    if (!userData) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      })
    }

    const isMatch = await bcrypt.compare(req.body.password, userData.password)

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Incorrect password.',
      })
    }

    const token = jwt.sign(
      {
        userID: userData._id,
      },
      process.env.PrivateKey,
      {
        expiresIn: '7d',
      },
    )

    res.cookie('token', token, {
      httpOnly: false,
      secure: false,
      sameSite: 'Lax',
      maxAge: 24 * 60 * 60 * 1000,
    })

    const user = userData.toObject()

    delete user.password

    return res.status(200).json({
      success: true,
      message: 'Login successful.',
      user,
    })
  } catch (error) {
    console.error('Login Error:', error)

    return res.status(500).json({
      success: false,
      message: 'Internal Server Error.',
    })
  }
}

// ================= Admin Login =================

export const admin_login = async (req, res) => {
  try {
    if (!validateLogin(req.body)) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required.',
      })
    }

    const admin = await userModel.findOne({
      email: req.body.email,
      role: 'admin',
    })

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found.',
      })
    }

    const isMatch = await bcrypt.compare(req.body.password, admin.password)

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Incorrect password.',
      })
    }

    const token = jwt.sign(
      {
        userID: admin._id,
      },
      process.env.PrivateKey,
      {
        expiresIn: '7d',
      },
    )

    res.cookie('token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })

    const user = admin.toObject()

    delete user.password

    return res.status(200).json({
      success: true,
      message: 'Admin login successful.',
      user,
    })
  } catch (error) {
    console.error('Admin Login Error:', error)

    return res.status(500).json({
      success: false,
      message: 'Internal Server Error.',
    })
  }
}

// ================= Current User =================

export const getCurrentUser = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.userID).select('-password')

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      })
    }

    return res.status(200).json({
      success: true,
      user,
    })
  } catch (error) {
    console.error('Get Current User Error:', error)

    return res.status(500).json({
      success: false,
      message: 'Internal Server Error.',
    })
  }
}

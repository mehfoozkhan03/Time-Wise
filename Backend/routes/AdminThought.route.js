import express from "express";

import { adminAuth } from "../middleware/adminAuth.js";
import {
  getAllPostsForAdmin,
  getPostForAdmin,
} from "../controllers/User/post.controller.js";

import { adminDeleteThought, createAdminThought, getFeaturedThoughtForAdmin, togglePinThought } from "../controllers/Admin/adminThought.controller.js";
import { uploadPostFiles } from "../middleware/postUpload.middleware.js";

const adminThoughtRoute = express.Router();

adminThoughtRoute.get("/", adminAuth, getAllPostsForAdmin);

adminThoughtRoute.get("/posts/:id", adminAuth, getPostForAdmin);

adminThoughtRoute.get("/featured", adminAuth, getFeaturedThoughtForAdmin);

// Admin Thought Create
adminThoughtRoute.post( "/thoughts", adminAuth, uploadPostFiles.fields([   { name: "images", maxCount: 4 },   { name: "attachments", maxCount: 5 }, ]), createAdminThought);

adminThoughtRoute.delete("/delete/thoughts/:id", adminAuth, adminDeleteThought);

adminThoughtRoute.patch("/thoughts/:id/pin", adminAuth, togglePinThought);

export { adminThoughtRoute };

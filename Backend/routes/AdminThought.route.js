import express from "express";

import { adminAuth } from "../middleware/adminAuth.js";
import {
  getAllPostsForAdmin,
  getPostForAdmin,
} from "../controllers/User/post.controller.js";
import { getFeaturedThoughtForAdmin } from "../controllers/Admin/adminThought.controller.js";

const adminThoughtRoute = express.Router();

adminThoughtRoute.get("/", adminAuth, getAllPostsForAdmin);

adminThoughtRoute.get("/posts/:id", adminAuth, getPostForAdmin);

adminThoughtRoute.get("/featured",  adminAuth,  getFeaturedThoughtForAdmin);

export { adminThoughtRoute };

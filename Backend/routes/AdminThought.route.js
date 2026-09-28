import express from "express";

import { adminAuth } from "../middleware/adminAuth.js";
import {
  getAllPostsForAdmin,
  getPostForAdmin,
} from "../controllers/User/post.controller.js";

const adminThoughtRoute = express.Router();

adminThoughtRoute.get("/", adminAuth, getAllPostsForAdmin);

adminThoughtRoute.get("/posts/:id", adminAuth, getPostForAdmin);

export { adminThoughtRoute };

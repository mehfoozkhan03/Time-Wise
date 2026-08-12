import express from "express";
import { askAI } from "../controllers/ai.controllers.js";
import { auth } from "../middleware/AuthMiddleware.js";

const aiRouter = express.Router();

aiRouter.post("/chat", auth, askAI);

export default aiRouter;

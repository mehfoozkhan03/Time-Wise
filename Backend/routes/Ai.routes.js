import express from "express";
import {
  askAI,
  clearAIConversation,
  getAIConversation,
} from "../controllers/ai.controllers.js";
import { auth } from "../middleware/AuthMiddleware.js";

const aiRouter = express.Router();

aiRouter.post("/chat", auth, askAI);
aiRouter.get("/chat", auth, getAIConversation);
aiRouter.delete("/chat", auth, clearAIConversation);

export default aiRouter;

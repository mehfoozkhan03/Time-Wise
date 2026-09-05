import express from "express";
import {
  askAI,
  clearAIConversation,
  getAIConversation,
} from "../controllers/ai.controllers.js";
import { auth } from "../middleware/AuthMiddleware.js";
import { authorize } from "../middleware/Allowrole.middleware.js";

const aiRouter = express.Router();

aiRouter.post("/chat", auth, authorize("user", "admin"), askAI);
aiRouter.get("/chat", auth, authorize("user", "admin"), getAIConversation);
aiRouter.delete("/chat", auth, authorize("user", "admin"), clearAIConversation);

export default aiRouter;

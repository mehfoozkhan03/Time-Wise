import { askTimeWiseAI } from "../services/ai.services.js";
import { getAIUserContext } from "../services/aiContext.services.js";
import { getRequestedContext } from "../services/aiContextSelector.services.js";
import {
  addConversationMessage,
  getConversation,
  clearConversation,
} from "../services/aiConversation.service.js";

export const askAI = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please enter a question.",
      });
    }

    const userID = req.user.userID;

    const conversation = getConversation(userID);

    const userContext = await getAIUserContext(userID);

    const requestedContext = getRequestedContext(
      message.trim(),
      userContext,
      conversation,
    );

    const answer = await askTimeWiseAI(
      message.trim(),
      requestedContext,
      conversation,
    );

    addConversationMessage(userID, "user", message.trim());

    addConversationMessage(userID, "assistant", answer);

    return res.status(200).json({
      success: true,
      answer,
    });
  } catch (error) {
    console.error("AI Controller Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to connect to the TimeWise Assistant.",
    });
  }
};

export const clearAIConversation = async (req, res) => {
  try {
    const userID = req.user.userID;

    clearConversation(userID);

    return res.status(200).json({
      success: true,
      message: "AI conversation cleared successfully.",
    });
  } catch (error) {
    console.error("Clear AI Conversation Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to clear the AI conversation.",
    });
  }
};

export const getAIConversation = async (req, res) => {
  try {
    const userID = req.user.userID;

    const conversation = getConversation(userID);

    return res.status(200).json({
      success: true,
      conversation,
    });
  } catch (error) {
    console.error("Get AI Conversation Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load the AI conversation.",
    });
  }
};

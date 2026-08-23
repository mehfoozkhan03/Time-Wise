import { askTimeWiseAI } from "../services/ai.services.js";
import { getAIUserContext } from "../services/aiContext.services.js";
import { getRequestedContext } from "../services/aiContextSelector.services.js";
import {
  addConversationMessage,
  getConversation,
  clearConversation,
} from "../services/aiConversation.service.js";
import { understandTimeWiseQuery } from "../services/aiQueryUnderstanding.services.js";
import { understandIntentAndEntity } from "../services/aiIntentEntity.services.js";
import { routeTimeWiseData } from "../services/aiDataRouter.services.js";
import { retrieveTimeWiseData } from "../services/aiDataRetrieval.services.js";
import { generateTimeWiseResponse } from "../services/ai.response.services.js";

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

    const conversation = await getConversation(userID);

    const userContext = await getAIUserContext(userID);

    // ==================================================
    // PHASE 1: AI QUERY UNDERSTANDING
    // ==================================================

    const queryUnderstanding = await understandTimeWiseQuery(
      message.trim(),
      conversation,
    );

    // ==================================================
    // PHASE 2: INTENT + ENTITY
    // ==================================================

    const intentEntity = await understandIntentAndEntity({
      message: message.trim(),
      phase1Result: queryUnderstanding,
      conversation,
    });

    // ==================================================
    // PHASE 3: DATA / CONTEXT ROUTING
    // ==================================================

    const dataRoute = routeTimeWiseData({
      intentEntity,
    });

    const retrievedData = retrieveTimeWiseData({
      userContext,
      dataRoute,
    });

    console.log("========== PHASE 5 INPUT ==========");
    console.log(
      JSON.stringify(
        {
          question: message,
          retrievedData,
        },
        null,
        2,
      ),
    );
    console.log("===================================");

    const phase5 = await generateTimeWiseResponse({
      question: message,
      phase2: intentEntity,
      phase3: dataRoute,
      phase4: retrievedData,
    });

    // ==================================================
    // PHASE 5 FINAL RESPONSE
    // ==================================================

    const answer = phase5.answer;

    await addConversationMessage(userID, "user", message.trim());

    await addConversationMessage(userID, "assistant", answer);

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

    await clearConversation(userID);

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

    const conversation = await getConversation(userID);

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

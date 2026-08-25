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
import { understandMultipleIntents } from "../services/aiMultiIntent.services.js";
import {
  prepareRequests,
  loadPending,
  savePending,
  clearPending,
  getNextPending,
} from "../services/aiOrchestrator.services.js";

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

    const getSinglePhase2Request = (phase2) => {
      if (!phase2) {
        return null;
      }

      return {
        intent: phase2.intent,
        action: phase2.action,
        entity: phase2.entity,
        period: phase2.period,
        dateReference: phase2.dateReference,
        search: phase2.search,
        confidence: phase2.confidence,
      };
    };

    // ==================================================
    // PHASE 5.5 - MULTI-INTENT DETECTION
    // ==================================================

    const multiIntent = await understandMultipleIntents({
      message: message.trim(),
      phase1Result: queryUnderstanding,
      phase2Result: intentEntity,
    });

    // ==================================================
    // PHASE 5.5 - MULTI-INTENT / FOLLOW-UP
    // ==================================================

    const phase2Requests = multiIntent.requests || [];

    const { completeRequests, incompleteRequests } = prepareRequests({
      requests: phase2Requests,
      question: message,
    });

    const existingPending = await loadPending(userID);

    const allPending = [...existingPending, ...incompleteRequests];

    console.log("========== PHASE 5.5 ========== ");

    console.log(
      JSON.stringify(
        {
          completeRequests,
          incompleteRequests,
          existingPending,
          allPending,
        },
        null,
        2,
      ),
    );

    console.log("================================");

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

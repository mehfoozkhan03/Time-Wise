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

const editDistance = (a, b) => {
  const rows = a.length + 1;
  const cols = b.length + 1;
  const dp = Array.from({ length: rows }, () => new Array(cols).fill(0));

  for (let i = 0; i < rows; i++) dp[i][0] = i;
  for (let j = 0; j < cols; j++) dp[0][j] = j;

  for (let i = 1; i < rows; i++) {
    for (let j = 1; j < cols; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost,
      );

      // Adjacent transposition (e.g. "weke" -> "week") counts as ONE edit.
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        dp[i][j] = Math.min(dp[i][j], dp[i - 2][j - 2] + 1);
      }
    }
  }

  return dp[a.length][b.length];
};

// Exact words / phrases we accept as-is (kept separate so short
// synonyms like "all" never fuzzy-match unrelated words).
const PERIOD_EXACT = {
  today: "today",
  "this day": "today",
  "this week": "week",
  weekly: "week",
  "this month": "month",
  monthly: "month",
  overall: "total",
  all: "total",
  "in total": "total",
};

// Canonical period words we fuzzy-match single tokens against.
const PERIOD_CANONICAL = ["today", "week", "month", "total"];

const detectPeriod = (rawMessage) => {
  const cleaned = String(rawMessage || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  if (!cleaned) return null;

  // 1) Exact word / phrase match (fast + unambiguous).
  if (PERIOD_EXACT[cleaned]) return PERIOD_EXACT[cleaned];
  if (PERIOD_CANONICAL.includes(cleaned)) return cleaned;

  // 2) Typo-tolerant match, token by token.
  const tokens = cleaned.split(" ");
  let best = { period: null, distance: Infinity };

  for (const token of tokens) {
    if (PERIOD_EXACT[token]) {
      return PERIOD_EXACT[token];
    }

    for (const word of PERIOD_CANONICAL) {
      const threshold = word.length <= 4 ? 1 : 2;
      const distance = editDistance(token, word);

      if (distance <= threshold && distance < best.distance) {
        best = { period: word, distance };
      }
    }
  }

  return best.period;
};

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

    // ==================================================
    // FOLLOW-UP RESUME
    // If we already asked the user for a period (e.g. for overtime
    // or working hours) and their reply is just that period
    // ("month", "total", ...), CONTINUE that saved question.
    // Without this, a bare "month" goes through the AI and gets
    // misread as monthly WORKING hours.
    // ==================================================

    // Typo-tolerant period detection: "wek" -> week, "totl" -> total,
    // "monht" -> month, "todya" -> today, etc. (see detectPeriod above).
    const answeredPeriod = detectPeriod(message);

    const pendingList = await loadPending(userID);

    if (pendingList.length > 0) {
      if (answeredPeriod) {
        const pendingRequest = pendingList[0];

        const resumedRequest = {
          ...pendingRequest,
          period: answeredPeriod,
        };

        const resumedUserContext = await getAIUserContext(userID);

        const resumedRoute = routeTimeWiseData({
          intentEntity: resumedRequest,
        });

        const resumedData = retrieveTimeWiseData({
          userContext: resumedUserContext,
          dataRoute: resumedRoute,
        });

        const resumedPhase5 = await generateTimeWiseResponse({
          question: `${pendingRequest.originalQuestion || pendingRequest.intent} ${answeredPeriod}`,
          phase2: resumedRequest,
          phase3: resumedRoute,
          phase4: resumedData,
        });

        const resumedAnswer = resumedPhase5.answer;

        await addConversationMessage(userID, "user", message.trim());

        await addConversationMessage(userID, "assistant", resumedAnswer);

        return res.status(200).json({
          success: true,
          answer: resumedAnswer,
        });
      }

      // The user ignored the follow-up and asked something new,
      // so drop the stale pending question before continuing.
      await clearPending(userID);
    }

    // ==================================================
    // SIMPLE TIMEWISE QUERY FAST PATH
    // ==================================================

    const normalizedMessage = message.trim().toLowerCase();

    const simpleQueries = {
      attendance: {
        intent: "attendance",
        action: "get",
        entity: "attendance_percentage",
        period: "none",
        dateReference: "none",
        search: "none",
        confidence: 1,
      },

      overtime: {
        intent: "overtime",
        action: "get",
        entity: "overtime_hours",
        period: "none",
        dateReference: "none",
        search: "none",
        confidence: 1,
      },

      "working hours": {
        intent: "working_hours",
        action: "get",
        entity: "working_hours",
        period: "none",
        dateReference: "none",
        search: "none",
        confidence: 1,
      },

      "working hour": {
        intent: "working_hours",
        action: "get",
        entity: "working_hours",
        period: "none",
        dateReference: "none",
        search: "none",
        confidence: 1,
      },

      productivity: {
        intent: "productivity",
        action: "get",
        entity: "productivity_score",
        period: "none",
        dateReference: "none",
        search: "none",
        confidence: 1,
      },

      "productivity score": {
        intent: "productivity",
        action: "get",
        entity: "productivity_score",
        period: "none",
        dateReference: "none",
        search: "none",
        confidence: 1,
      },

      streak: {
        intent: "streak",
        action: "get",
        entity: "current_streak",
        period: "none",
        dateReference: "none",
        search: "none",
        confidence: 1,
      },

      "current streak": {
        intent: "streak",
        action: "get",
        entity: "current_streak",
        period: "none",
        dateReference: "none",
        search: "none",
        confidence: 1,
      },

      "average check-in": {
        intent: "average_checkin",
        action: "get",
        entity: "average_checkin_time",
        period: "none",
        dateReference: "none",
        search: "none",
        confidence: 1,
      },

      "average checkin": {
        intent: "average_checkin",
        action: "get",
        entity: "average_checkin_time",
        period: "none",
        dateReference: "none",
        search: "none",
        confidence: 1,
      },

      "leaves taken": {
        intent: "leaves",
        action: "get",
        entity: "leaves_taken",
        period: "none",
        dateReference: "none",
        search: "none",
        confidence: 1,
      },

      "how many leaves": {
        intent: "leaves",
        action: "get",
        entity: "leaves_taken",
        period: "none",
        dateReference: "none",
        search: "none",
        confidence: 1,
      },

      leaves: {
        intent: "leaves",
        action: "get",
        entity: "leaves_taken",
        period: "none",
        dateReference: "none",
        search: "none",
        confidence: 1,
      },
    };

    const simpleQueryResult = simpleQueries[normalizedMessage];

    if (simpleQueryResult) {
      const requests = [
        {
          ...simpleQueryResult,
          originalQuestion: message.trim(),
        },
      ];

      const { completeRequests, incompleteRequests } = prepareRequests({
        requests,
        question: message.trim(),
      });

      const existingPending = await loadPending(userID);

      const allPending = [...existingPending, ...incompleteRequests];

      console.log("========== SIMPLE QUERY ==========");

      console.log(
        JSON.stringify(
          {
            question: message.trim(),
            completeRequests,
            incompleteRequests,
          },
          null,
          2,
        ),
      );

      console.log("==================================");

      // If the query still needs a period (e.g. overtime), ask for it.
      if (incompleteRequests.length > 0) {
        // Start a fresh follow-up for THIS query only.
        // Drop any old, abandoned pending question (that's what made
        // "working hours" ask about overtime).
        await clearPending(userID);
        await savePending({ userID, requests: incompleteRequests });
        const nextPending = getNextPending(incompleteRequests);
        return res.status(200).json({
          success: true,
          answer:
            nextPending?.question || "What period would you like to check?",
        });
      }

      // ==================================================
      // SIMPLE QUERY DIRECT ANSWER
      // The query is complete, so answer it deterministically
      // through Phase 3 -> 4 -> 5. We do NOT ask Groq to guess
      // the entity, so single words like "leaves" and
      // "attendance" always route correctly (and we save tokens).
      // ==================================================

      if (completeRequests.length > 0) {
        const simpleRequest = completeRequests[0];

        const simpleUserContext = await getAIUserContext(userID);

        const simpleRoute = routeTimeWiseData({
          intentEntity: simpleRequest,
        });

        const simpleData = retrieveTimeWiseData({
          userContext: simpleUserContext,
          dataRoute: simpleRoute,
        });

        const simplePhase5 = await generateTimeWiseResponse({
          question: message.trim(),
          phase2: simpleRequest,
          phase3: simpleRoute,
          phase4: simpleData,
        });

        const simpleAnswer = simplePhase5.answer;

        await addConversationMessage(userID, "user", message.trim());

        await addConversationMessage(userID, "assistant", simpleAnswer);

        return res.status(200).json({
          success: true,
          answer: simpleAnswer,
        });
      }
    }

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

    // ==================================================
    // HELP REQUEST HANDLING
    // ==================================================

    const helpRequests = completeRequests.filter(
      (request) => request.action === "help",
    );

    if (helpRequests.length > 0) {
      const helpRequest = helpRequests[0];

      const helpResponse = await askTimeWiseAI(
        message.trim(),
        {
          user: userContext,
          calendar: {},
          helpRequest,
          isHelpRequest: true,
        },
        conversation,
      );

      await addConversationMessage(userID, "user", message.trim());

      await addConversationMessage(userID, "assistant", helpResponse);

      return res.status(200).json({
        success: true,
        answer: helpResponse,
      });
    }

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

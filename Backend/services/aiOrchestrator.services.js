import {
  savePendingRequests,
  getPendingRequests,
  clearPendingRequests,
} from "./aiConversation.service.js";

// ==================================================
// FOLLOW-UP REQUIREMENTS
// ==================================================

const FOLLOW_UP_RULES = {
  overtime: {
    field: "period",

    question:
      "Would you like to know your overtime for this month or your total overtime?",

    requiresPeriod: true,
  },

  working_hours: {
    field: "period",

    question:
      "Would you like to know your working hours for today, this week, this month, or your total working hours?",

    requiresPeriod: true,
  },

  // REMOVED: productivity no longer requires follow-up
  // Users asking "productivity" or "productivity score" now get immediate answer
};

// ==================================================
// NORMALIZE REQUEST
// ==================================================

const normalizeRequest = (request, originalQuestion = "") => {
  return {
    intent: request?.intent || "unknown",

    action: request?.action || "get",

    entity: request?.entity || "none",

    period: request?.period || "none",

    dateReference: request?.dateReference || "none",

    search: request?.search || "none",

    confidence: request?.confidence ?? 0,

    originalQuestion,
  };
};

// ==================================================
// GET FOLLOW-UP RULE
// ==================================================

const getFollowUpRule = (request) => {
  if (!request?.intent) {
    return null;
  }

  return FOLLOW_UP_RULES[request.intent] || null;
};

// ==================================================
// CHECK REQUEST COMPLETENESS
// ==================================================

export const isCompleteRequest = (request) => {
  const rule = getFollowUpRule(request);

  if (!rule) {
    return true;
  }

  // HELP / HOW-TO requests do not require
  // a period.
  if (request.action === "help") {
    return true;
  }

  const value = request[rule.field];

  return (
    value !== undefined && value !== null && value !== "" && value !== "none"
  );
};

// ==================================================
// FIND MISSING FIELD
// ==================================================

export const getMissingField = (request) => {
  const rule = getFollowUpRule(request);

  if (!rule) {
    return null;
  }

  if (isCompleteRequest(request)) {
    return null;
  }

  return rule.field;
};

// ==================================================
// CREATE PENDING REQUEST
// ==================================================

export const createPendingRequest = (request, originalQuestion) => {
  return {
    intent: request.intent || "unknown",

    action: request.action || "get",

    entity: request.entity || "none",

    period: request.period || "none",

    dateReference: request.dateReference || "none",

    search: request.search || "none",

    confidence: request.confidence ?? 0,

    missing: getMissingField(request),

    originalQuestion: originalQuestion || "",
  };
};

// ==================================================
// PREPARE REQUESTS
// ==================================================

export const prepareRequests = ({ requests = [], question = "" }) => {
  const completeRequests = [];
  const incompleteRequests = [];

  for (const request of requests) {
    const normalized = normalizeRequest(request, question);

    if (isCompleteRequest(normalized)) {
      completeRequests.push(normalized);
    } else {
      incompleteRequests.push(createPendingRequest(normalized, question));
    }
  }

  return {
    completeRequests,
    incompleteRequests,
  };
};

// ==================================================
// SAVE PENDING REQUESTS
// ==================================================

export const savePending = async ({ userID, requests }) => {
  if (!userID) {
    throw new Error("userID is required to save pending AI requests");
  }

  await savePendingRequests(userID, requests || []);

  return requests || [];
};

// ==================================================
// LOAD PENDING REQUESTS
// ==================================================

export const loadPending = async (userID) => {
  if (!userID) {
    return [];
  }

  return await getPendingRequests(userID);
};

// ==================================================
// CLEAR PENDING REQUESTS
// ==================================================

export const clearPending = async (userID) => {
  if (!userID) {
    return;
  }

  await clearPendingRequests(userID);
};

// ==================================================
// ADD TO EXISTING PENDING QUEUE
// ==================================================

export const appendPendingRequests = async ({
  userID,
  existingRequests = [],
  newRequests = [],
}) => {
  const combined = [...existingRequests, ...newRequests];

  await savePending({
    userID,
    requests: combined,
  });

  return combined;
};

// ==================================================
// GET NEXT PENDING REQUEST
// ==================================================

export const getNextPending = (pendingRequests = []) => {
  if (!Array.isArray(pendingRequests) || pendingRequests.length === 0) {
    return null;
  }

  const request = pendingRequests[0];

  const rule = getFollowUpRule(request);

  if (!rule) {
    return {
      request,
      question: null,
    };
  }

  return {
    request,

    question: rule.question,

    field: rule.field,
  };
};

// ==================================================
// REMOVE FIRST PENDING REQUEST
// ==================================================

export const removeFirstPending = async ({ userID, pendingRequests = [] }) => {
  const remaining = pendingRequests.slice(1);

  await savePending({
    userID,
    requests: remaining,
  });

  return remaining;
};

// ==================================================
// UPDATE PENDING REQUEST
// ==================================================

export const updatePendingRequest = async ({
  userID,
  pendingRequests = [],
  updatedRequest,
}) => {
  if (!Array.isArray(pendingRequests) || pendingRequests.length === 0) {
    return [];
  }

  const updated = [updatedRequest, ...pendingRequests.slice(1)];

  await savePending({
    userID,
    requests: updated,
  });

  return updated;
};

// ==================================================
// MULTI-INTENT SUMMARY
// ==================================================

export const summarizeRequests = ({
  completeRequests = [],
  incompleteRequests = [],
}) => {
  return {
    total: completeRequests.length + incompleteRequests.length,

    complete: completeRequests.length,

    incomplete: incompleteRequests.length,

    hasMultiple: completeRequests.length + incompleteRequests.length > 1,

    requiresFollowUp: incompleteRequests.length > 0,
  };
};

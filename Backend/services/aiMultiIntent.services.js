// ==================================================
// SIMPLE KEYWORD-BASED MULTI-INTENT DETECTOR
// NO AI REQUIRED - WORKS 100% DETERMINISTICALLY
// ==================================================

const KNOWN_INTENTS = [
  { keywords: ["attendance", "attend"], entity: "attendance_percentage" },
  { keywords: ["overtime"], entity: "overtime_hours" },
  { keywords: ["working", "hours", "hour"], entity: "working_hours" },
  { keywords: ["productivity"], entity: "productivity_score" },
  { keywords: ["streak"], entity: "current_streak" },
  { keywords: ["leaves", "leave", "absent"], entity: "leaves_taken" },
  {
    keywords: ["check-in", "checkin", "check in"],
    entity: "average_checkin_time",
  },
];

const detectIntentsByKeywords = (message) => {
  const cleaned = message.toLowerCase();

  // Split by "and" or commas
  const parts = cleaned.split(/\s+and\s+|,\s*/);

  const detectedRequests = [];

  for (const part of parts) {
    const trimmed = part.trim();
    if (!trimmed || trimmed.length < 3) continue;

    // Check each known intent
    for (const intent of KNOWN_INTENTS) {
      for (const keyword of intent.keywords) {
        if (trimmed.includes(keyword)) {
          detectedRequests.push({
            intent: intent.entity.includes("attendance")
              ? "attendance"
              : intent.entity.replace(/_/g, "").replace(/s$/, ""),
            action: "get",
            entity: intent.entity,
            period: "none",
            dateReference: "none",
            search: "none",
            confidence: 0.9,
            originalQuestion: trimmed,
          });
          break;
        }
      }
    }
  }

  // Remove duplicates
  const unique = [];
  const seen = new Set();
  for (const req of detectedRequests) {
    const key = req.entity;
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(req);
    }
  }

  return unique;
};

// ==================================================
// MULTI-INTENT UNDERSTANDING (NO AI - KEYWORDS ONLY)
// ==================================================

export const understandMultipleIntents = async ({
  message,
  phase1Result,
  phase2Result,
}) => {
  // Use keyword-based detection only (no AI calls)
  const keywordRequests = detectIntentsByKeywords(message);

  if (keywordRequests.length >= 2) {
    console.log(
      "MULTI-INTENT: Keyword detection found",
      keywordRequests.length,
      "requests",
    );

    return {
      multiple: true,
      requests: keywordRequests,
    };
  }

  // If only 0-1 intents found, return Phase 2 result as single request
  return {
    multiple: false,

    requests: [
      {
        intent: phase2Result?.intent || "unknown",
        action: phase2Result?.action || "get",
        entity: phase2Result?.entity || "none",
        period: phase2Result?.period || "none",
        dateReference: phase2Result?.dateReference || "none",
        search: phase2Result?.search || "none",
        confidence: phase2Result?.confidence || 0,
      },
    ],
  };
};

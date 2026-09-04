import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Use environment variable or fallback
const GROQ_MODEL = process.env.GROQ_MODEL || "llama3-8b-8192";

// ==================================================
// SAFE JSON PARSER
// ==================================================

const parseJSON = (text) => {
  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    const match = text.match(/\{[\s\S]*\}/);

    if (!match) {
      return null;
    }

    try {
      return JSON.parse(match[0]);
    } catch {
      return null;
    }
  }
};

// ==================================================
// NORMALIZE RESULT
// ==================================================

const normalizeIntentEntity = (result) => {
  const validIntents = new Set([
    "attendance",
    "working_hours",
    "overtime",
    "productivity",
    "streak",
    "leaves",
    "punctuality",
    "average_daily_hours",
    "average_checkin",
    "calendar_event",
    "holiday",
    "notification",
    "goal",
    "report",
    "profile",
    "general_conversation",
    "unknown",
  ]);

  const validActions = new Set([
    "get",
    "find",
    "list",
    "count",
    "show",
    "compare",
    "explain",
    "evaluate",
    "improve",
    "create",
    "update",
    "delete",
    "unknown",
    "help",
  ]);

  const validEntities = new Set([
    "attendance_percentage",
    "present_days",
    "absent_days",
    "working_hours",
    "today_working_hours",
    "weekly_working_hours",
    "monthly_working_hours",
    "total_working_hours",
    "overtime_hours",
    "monthly_overtime",
    "total_overtime",
    "productivity_score",
    "current_streak",
    "longest_streak",
    "leaves_taken",
    "punctuality_score",
    "average_daily_hours",
    "average_checkin_time",
    "calendar_event",
    "meeting",
    "presentation",
    "appointment",
    "task",
    "holiday",
    "festival",
    "notification",
    "unread_notifications",
    "weekly_goal",
    "goal_progress",
    "report",
    "profile",
    "department",
    "designation",
    "name",
    "none",
  ]);

  const validPeriods = new Set(["today", "week", "month", "total", "none"]);

  const validDateReferences = new Set([
    "today",
    "yesterday",
    "tomorrow",
    "this_week",
    "last_week",
    "next_week",
    "this_month",
    "last_month",
    "next_month",
    "this_year",
    "last_year",
    "next_year",
    "specific_date",
    "none",
  ]);

  const intent = validIntents.has(result?.intent) ? result.intent : "unknown";
  const action = validActions.has(result?.action) ? result.action : "unknown";
  const entity = validEntities.has(result?.entity) ? result.entity : "none";
  const period = validPeriods.has(result?.period) ? result.period : "none";
  const dateReference = validDateReferences.has(result?.dateReference)
    ? result.dateReference
    : "none";
  const search =
    typeof result?.search === "string" ? result.search.trim() : "none";

  let confidence = Number(result?.confidence);
  if (!Number.isFinite(confidence)) {
    confidence = 0;
  }
  confidence = Math.max(0, Math.min(1, confidence));

  return {
    intent,
    action,
    entity,
    period,
    dateReference,
    search: search || "none",
    confidence,
  };
};

// ==================================================
// KEYWORD-BASED FALLBACK (NO AI NEEDED)
// ==================================================

const detectByKeywords = (message) => {
  const lowerMsg = message.toLowerCase();

  if (lowerMsg.includes("attendance")) {
    return {
      intent: "attendance",
      action: "get",
      entity: "attendance_percentage",
      period: "none",
      dateReference: "none",
      search: "none",
      confidence: 0.9,
    };
  }

  if (lowerMsg.includes("hours")) {
    if (lowerMsg.includes("today")) {
      return {
        intent: "working_hours",
        action: "get",
        entity: "today_working_hours",
        period: "today",
        dateReference: "today",
        search: "none",
        confidence: 0.9,
      };
    }
    if (lowerMsg.includes("week")) {
      return {
        intent: "working_hours",
        action: "get",
        entity: "weekly_working_hours",
        period: "week",
        dateReference: "this_week",
        search: "none",
        confidence: 0.9,
      };
    }
    if (lowerMsg.includes("month")) {
      return {
        intent: "working_hours",
        action: "get",
        entity: "monthly_working_hours",
        period: "month",
        dateReference: "this_month",
        search: "none",
        confidence: 0.9,
      };
    }
    return {
      intent: "working_hours",
      action: "get",
      entity: "working_hours",
      period: "none",
      dateReference: "none",
      search: "none",
      confidence: 0.9,
    };
  }

  if (lowerMsg.includes("overtime")) {
    return {
      intent: "overtime",
      action: "get",
      entity: "overtime_hours",
      period: "month",
      dateReference: "none",
      search: "none",
      confidence: 0.9,
    };
  }

  if (lowerMsg.includes("productivity")) {
    return {
      intent: "productivity",
      action: "get",
      entity: "productivity_score",
      period: "none",
      dateReference: "none",
      search: "none",
      confidence: 0.9,
    };
  }

  if (lowerMsg.includes("streak")) {
    return {
      intent: "streak",
      action: "get",
      entity: "current_streak",
      period: "none",
      dateReference: "none",
      search: "none",
      confidence: 0.9,
    };
  }

  if (lowerMsg.includes("leaves") || lowerMsg.includes("leave")) {
    return {
      intent: "leaves",
      action: "get",
      entity: "leaves_taken",
      period: "none",
      dateReference: "none",
      search: "none",
      confidence: 0.9,
    };
  }

  if (
    lowerMsg.includes("calendar") ||
    lowerMsg.includes("meeting") ||
    lowerMsg.includes("event")
  ) {
    return {
      intent: "calendar_event",
      action: "find",
      entity: "calendar_event",
      period: "none",
      dateReference: "none",
      search: "none",
      confidence: 0.9,
    };
  }

  if (
    lowerMsg.includes("holiday") ||
    lowerMsg.includes("festival") ||
    lowerMsg.includes("janmashtami") ||
    lowerMsg.includes("diwali") ||
    lowerMsg.includes("ganesh") ||
    lowerMsg.includes("gandhi")
  ) {
    return {
      intent: "holiday",
      action: "find",
      entity: "holiday",
      period: "none",
      dateReference: "none",
      search: message,
      confidence: 0.9,
    };
  }

  return null;
};

// ==================================================
// MAIN FUNCTION
// ==================================================

export const understandIntentAndEntity = async ({
  message,
  phase1Result,
  conversation = [],
}) => {
  const safeMessage = String(message || "").trim();

  if (!safeMessage) {
    return normalizeIntentEntity(null);
  }

  // FIRST: Try keyword-based detection (no AI, no errors)
  const keywordResult = detectByKeywords(safeMessage);

  if (keywordResult) {
    console.log("Phase 2: Using keyword detection (no AI)");
    return keywordResult;
  }

  // SECOND: Try AI only if keywords don't match
  try {
    const prompt = `Classify: "${safeMessage}"

Return JSON only:
{"intent":"...", "action":"...", "entity":"...", "period":"today|week|month|total|none", "dateReference":"today|specific_date|none", "search":"text or none", "confidence":1}`;

    const response = await groq.chat.completions.create({
      model: GROQ_MODEL,
      temperature: 0,
      max_completion_tokens: 200,
      response_format: {
        type: "json_object",
      },
      messages: [
        {
          role: "system",
          content: "Return ONLY valid JSON.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const raw = response?.choices?.[0]?.message?.content?.trim();

    if (!raw) {
      throw new Error("Phase 2 returned empty response");
    }

    const parsed = parseJSON(raw);
    const normalized = normalizeIntentEntity(parsed);

    return normalized;
  } catch (error) {
    console.error("Query Understanding Error:", error.status, error.message);

    // Return unknown if AI fails
    return {
      intent: "unknown",
      action: "unknown",
      entity: "none",
      period: "none",
      dateReference: "none",
      search: "none",
      confidence: 0,
    };
  }
};

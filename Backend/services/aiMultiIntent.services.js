import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// ==================================================
// SIMPLE KEYWORD-BASED MULTI-INTENT DETECTOR
// Works WITHOUT AI for common patterns.
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
// MULTI-INTENT UNDERSTANDING
// ==================================================

export const understandMultipleIntents = async ({
  message,
  phase1Result,
  phase2Result,
}) => {
  try {
    // FIRST: Try simple keyword-based detection (no AI, no rate limits)
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

    // SECOND: Try AI-based detection for complex cases
    // Only call if keyword detection found 0-1 intents

    // Clean up the message for the prompt
    const cleanMessage = message.replace(/"/g, '\\"');

    const prompt = `
You are the Multi-Intent Engine for TimeWise.

Determine whether the user's message contains one request or multiple independent requests.

USER MESSAGE:
"${cleanMessage}"

PHASE 1:
${JSON.stringify(phase1Result)}

PHASE 2:
${JSON.stringify(phase2Result)}

Return ONLY valid JSON.

Rules:

1. If the user asks only one thing, return one request.

2. If the user asks multiple independent things (using "and", ",", "or"), return one request for EACH thing.

3. Never invent information. Use only what the user said.

4. Preserve the meaning of the user's request.

5. Each request must contain exactly these fields:
   - intent (string)
   - action (string)
   - entity (string)
   - period (string)
   - dateReference (string)
   - search (string)
   - confidence (number)

6. Use these known TimeWise entity names:
   - attendance_percentage
   - overtime_hours
   - working_hours
   - productivity_score
   - current_streak
   - leaves_taken
   - average_checkin_time

Return EXACTLY this format (no extra text):

{"multiple":true,"requests":[{"intent":"X","action":"get","entity":"Y","period":"none","dateReference":"none","search":"none","confidence":1}]}

Examples:

User: "What is my attendance and how many leaves have I taken?"
Response: {"multiple":true,"requests":[{"intent":"attendance","action":"get","entity":"attendance_percentage","period":"none","dateReference":"none","search":"none","confidence":1},{"intent":"leaves","action":"get","entity":"leaves_taken","period":"none","dateReference":"none","search":"none","confidence":1}]}

User: "Show me my streak and productivity"
Response: {"multiple":true,"requests":[{"intent":"streak","action":"get","entity":"current_streak","period":"none","dateReference":"none","search":"none","confidence":1},{"intent":"productivity","action":"get","entity":"productivity_score","period":"none","dateReference":"none","search":"none","confidence":1}]}

User: "What is my overtime this month?"
Response: {"multiple":false,"requests":[{"intent":"overtime","action":"get","entity":"overtime_hours","period":"month","dateReference":"none","search":"none","confidence":1}]}

Return JSON only. No markdown, no explanation.
`;

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",

      messages: [
        {
          role: "system",
          content:
            "You are a strict JSON multi-intent classifier. Return ONLY valid JSON.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],

      temperature: 0,

      max_completion_tokens: 500,
    });

    const content = response?.choices?.[0]?.message?.content?.trim();

    if (!content) {
      throw new Error("Multi-intent engine returned empty response");
    }

    // Clean up the response - remove markdown code blocks if present
    const cleaned = content
      .replace(/```json?/g, "")
      .replace(/```/g, "")
      .trim();

    const parsed = JSON.parse(cleaned);

    if (!Array.isArray(parsed?.requests)) {
      throw new Error(
        "Invalid multi-intent response: requests is not an array",
      );
    }

    // Filter out invalid requests
    const validRequests = parsed.requests.filter(
      (r) => r && typeof r.intent === "string" && typeof r.entity === "string",
    );

    if (validRequests.length === 0) {
      throw new Error("No valid requests found");
    }

    console.log(
      "MULTI-INTENT: AI detection found",
      validRequests.length,
      "requests",
    );

    return {
      multiple: validRequests.length > 1,

      requests: validRequests,
    };
  } catch (error) {
    console.error("Multi-Intent Engine Error:", error?.message || error);

    // THIRD: Fallback - extract what we can from keyword detection
    const keywordRequests = detectIntentsByKeywords(message);

    if (keywordRequests.length > 0) {
      console.log("MULTI-INTENT: Fallback to keyword detection");

      return {
        multiple: keywordRequests.length > 1,

        requests: keywordRequests,
      };
    }

    // FINAL fallback to Phase 2
    return {
      multiple: false,

      requests: phase2Result ? [phase2Result] : [],
    };
  }
};

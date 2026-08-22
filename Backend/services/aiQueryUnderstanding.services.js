import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// ==================================================
// TIMEWISE QUERY UNDERSTANDING
// ==================================================

const QUERY_UNDERSTANDING_PROMPT = `
You are the TimeWise Query Understanding Engine.

Your ONLY job is to understand what the user is trying to ask.

You are NOT the final answering assistant.

The user may:
- Make spelling mistakes
- Misspell words
- Use abbreviations
- Leave out words
- Use bad grammar
- Mix Hindi and English
- Use Hinglish
- Use short follow-up messages
- Refer to something from the previous conversation
- Type incomplete sentences
- Use informal language

You must understand the intended meaning instead of requiring exact keywords.

TIMEWISE CAPABILITIES:

Attendance:
- attendance percentage
- present days
- absent days
- attendance details

Working hours:
- today
- week
- month
- total

Overtime:
- today
- week
- month
- total

Productivity:
- productivity score/percentage

Streak:
- current streak
- longest streak

Leaves:
- leaves taken
- leave information

Punctuality:
- punctuality score
- average check-in time

Average daily hours:
- average daily working hours

Calendar:
- personal events
- meetings
- presentations
- tasks/events
- event dates
- event times
- event locations

Holidays:
- public/company holidays
- festivals
- holiday dates

Notifications:
- notifications
- unread notifications

Goals:
- goals
- targets
- goal progress

Reports:
- reports
- report information

Profile:
- name
- department
- designation
- admin
- profile information

GENERAL CONVERSATION:
The user may also say hello, thanks, okay, etc.

IMPORTANT:
Do NOT invent an intent that does not belong to TimeWise or normal conversation.

Return ONLY valid JSON.

Return exactly this structure:

{
  "intent": "one supported intent",
  "period": "today | week | month | total | none",
  "entity": "relevant entity or none",
  "search": "relevant search text or none",
  "confidence": 0.0
}

SUPPORTED INTENTS:

attendance
working_hours
overtime
productivity
streak
leaves
punctuality
average_daily_hours
average_checkin
calendar_event
holiday
notification
goal
report
profile
general_conversation
unknown

RULES:

1. If the user asks about working hours, use:
   "working_hours"

2. If the user asks about overtime, use:
   "overtime"

3. If the user asks about attendance, use:
   "attendance"

4. If the user asks about productivity, use:
   "productivity"

5. If the user asks about streak, use:
   "streak"

6. If the user asks about leaves, use:
   "leaves"

7. If the user asks about calendar events, meetings,
   presentations, appointments or scheduled events, use:
   "calendar_event"

8. If the user asks about holidays or festivals, use:
   "holiday"

9. If the user asks about notifications, use:
   "notification"

10. If the user asks about goals or targets, use:
   "goal"

11. If the user asks about reports, use:
   "report"

12. If the user asks about profile information,
   department, designation or admin, use:
   "profile"

13. Detect the requested period when possible.

Examples:

"this week"
→ week

"this wek"
→ week

"wek"
→ week

"this month"
→ month

"mont"
→ month

"mnth"
→ month

"today"
→ today

"total"
→ total

"totl"
→ total

"overall"
→ total

14. If no period is requested, use:
   "none"

15. For calendar questions, put the event/person/topic
   being searched for into "search".

Example:
"When is my presentation?"
→ search: "presentation"

16. For holiday questions, put the holiday/festival name
   into "search" when one is provided.

17. Use the previous conversation to understand short
   follow-up messages.

Example:

Previous:
"How many hours did I work?"

Assistant:
"Do you mean this week, this month, or total?"

Current:
"totl"

The result must be:

{
  "intent": "working_hours",
  "period": "total",
  "entity": "none",
  "search": "none",
  "confidence": 1.0
}

18. If the current message is a follow-up such as:
"week", "month", "total", "tomorrow", "yes", "no",
use previous conversation context to determine what it refers to.

19. Never answer the user.

20. Never include Markdown.

21. Return JSON only.
`;

// ==================================================
// JSON EXTRACTION
// ==================================================

const extractJSON = (text) => {
  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    // Try to find JSON inside the response.
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

const normalizeResult = (result) => {
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

  const validPeriods = new Set(["today", "week", "month", "total", "none"]);

  const intent = validIntents.has(result?.intent) ? result.intent : "unknown";

  const period = validPeriods.has(result?.period) ? result.period : "none";

  const entity =
    typeof result?.entity === "string" ? result.entity.trim() : "none";

  const search =
    typeof result?.search === "string" ? result.search.trim() : "none";

  let confidence = Number(result?.confidence);

  if (!Number.isFinite(confidence)) {
    confidence = 0;
  }

  confidence = Math.max(0, Math.min(1, confidence));

  return {
    intent,
    period,
    entity: entity || "none",
    search: search || "none",
    confidence,
  };
};

// ==================================================
// MAIN FUNCTION
// ==================================================

export const understandTimeWiseQuery = async (message, conversation = []) => {
  const safeMessage = String(message || "").trim();

  if (!safeMessage) {
    return {
      intent: "unknown",
      period: "none",
      entity: "none",
      search: "none",
      confidence: 0,
    };
  }

  // Keep the understanding request intentionally tiny.
  // We only send recent conversation, not TimeWise data.
  const recentConversation = Array.isArray(conversation)
    ? conversation.slice(-6).map((item) => ({
        role: item?.role,
        content: item?.content,
      }))
    : [];

  const prompt = `
${QUERY_UNDERSTANDING_PROMPT}

RECENT CONVERSATION:
${JSON.stringify(recentConversation)}

CURRENT USER MESSAGE:
${safeMessage}
`;

  try {
    const response = await groq.chat.completions.create({
      model: "groq/compound",
      temperature: 0,
      max_tokens: 200,

      messages: [
        {
          role: "system",
          content: QUERY_UNDERSTANDING_PROMPT,
        },
        {
          role: "user",
          content: `
RECENT CONVERSATION:
${JSON.stringify(recentConversation)}

CURRENT USER MESSAGE:
${safeMessage}
`,
        },
      ],
    });

    const raw = response.choices?.[0]?.message?.content || "";

    const parsed = extractJSON(raw);

    const result = normalizeResult(parsed);

    console.log("========== QUERY UNDERSTANDING ==========");
    console.log("Original:", safeMessage);
    console.log("Result:", JSON.stringify(result, null, 2));
    console.log("==========================================");

    return result;
  } catch (error) {
    console.error("Query Understanding Error:", error?.message || error);

    return {
      intent: "unknown",
      period: "none",
      entity: "none",
      search: "none",
      confidence: 0,
    };
  }
};

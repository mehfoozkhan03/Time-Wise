import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// ==================================================
// PHASE 2
// INTENT + ENTITY ENGINE
// ==================================================

const INTENT_ENTITY_PROMPT = `
You are the Phase 2 Intent and Entity Engine for TimeWise.

Your job is to take the user's message and the Phase 1
query-understanding result and convert them into a precise
structured request.

You do NOT answer the user.

You ONLY return JSON.

==================================================
SUPPORTED INTENTS
==================================================

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

==================================================
SUPPORTED ACTIONS
==================================================

get
find
list
count
show
help
compare
explain
evaluate
improve
create
update
delete
unknown

==================================================
ENTITIES
==================================================

attendance_percentage
present_days
absent_days

working_hours
today_working_hours
weekly_working_hours
monthly_working_hours
total_working_hours

overtime_hours
monthly_overtime
total_overtime

productivity_score
current_streak
longest_streak

leaves_taken
punctuality_score
average_daily_hours
average_checkin_time

calendar_event
meeting
presentation
appointment
task

holiday
festival

notification
unread_notifications

weekly_goal
goal_progress
report
profile
department
designation
name

none

ENTITY MAPPING FOR WORKING HOURS:

- "how many hours have I worked today?"
  → today_working_hours

- "how many hours have I worked this week?"
  → weekly_working_hours

- "how many hours have I worked this month?"
  → monthly_working_hours

- "how many hours have I worked overall?"
  → total_working_hours

- generic working-hours question without a period
  → working_hours

==================================================
DATE REFERENCES
==================================================

Use one of:

today
yesterday
tomorrow
this_week
last_week
next_week
this_month
last_month
next_month
this_year
last_year
next_year
specific_date
none

==================================================
RULES
==================================================

1. Use Phase 1's intent as the starting point.

2. Correctly determine the user's requested entity.

3. Correctly determine the action.

4. Detect time/date references.

5. Do NOT invent information.

6. If the user asks for a specific calendar event,
put its identifying text in "search".

7. If the user asks about a specific holiday,
put its identifying text in "search".

8. Use "count" only when the user is asking for the number of records/items/days/events/leaves/etc.

9. Use "get" when the user is asking for a numeric value or statistic such as working hours, overtime hours, attendance percentage, productivity, punctuality, streak, or goals.

10. For questions like "How many hours have I worked?",
use action "get", not "count".

11. If the user asks "is this good?",
use:
"evaluate".

12. If the user asks "how can I improve...",
use:
"improve".

13. If the user asks to show multiple records,
use:
"list".

14. Preserve the Phase 1 period when it is correct.

15. If Phase 1 says period = none, detect a date
reference from the actual message if possible.

16. If the user sends a short follow-up such as:

"week"
"month"
"total"
"tomorrow"
"yes"
"no"

use the previous conversation and Phase 1 result
to determine what the user is referring to.

17. Never answer the user's question.

18. Never return Markdown.

19. Return valid JSON only.

ATTENDANCE RULE:

If the user asks how to check, view, see, access, or find their attendance,
classify the action as "help".

Examples:

"How do I check my attendance?"
"Where can I see my attendance?"
"How can I view my attendance?"
"Where is my attendance?"
"How do I see attendance?"

Return:

{
  "intent": "attendance",
  "action": "help",
  "entity": "attendance",
  "period": "none",
  "dateReference": "none",
  "search": "none",
  "confidence": 1
}

Do NOT ask for a period for these questions.

==================================================
OUTPUT FORMAT
==================================================

{
  "intent": "supported intent",
  "action": "supported action",
  "entity": "supported entity",
  "period": "today | week | month | total | none",
  "dateReference": "supported date reference",
  "search": "text or none",
  "confidence": 0.0
}
`;

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

  const recentConversation = Array.isArray(conversation)
    ? conversation.slice(-4).map((item) => ({
        role: item?.role,
        content: item?.content,
      }))
    : [];

  try {
    const response = await groq.chat.completions.create({
      model: "openai/gpt-oss-20b",

      temperature: 0,

      reasoning_effort: "low",

      include_reasoning: false,

      max_completion_tokens: 400,

      response_format: {
        type: "json_object",
      },

      messages: [
        {
          role: "system",
          content: INTENT_ENTITY_PROMPT,
        },
        {
          role: "user",
          content: `
PHASE 1 RESULT:

${JSON.stringify(phase1Result || {}, null, 2)}

RECENT CONVERSATION:

${JSON.stringify(recentConversation, null, 2)}

CURRENT USER MESSAGE:

${safeMessage}
`,
        },
      ],
    });

    const raw = response.choices?.[0]?.message?.content || "";

    const parsed = parseJSON(raw);

    const result = normalizeIntentEntity(parsed);

    return result;
  } catch (error) {
    console.error("Intent + Entity Engine Error:", error?.message || error);

    // Phase 1 is still valid.
    // Preserve it if Phase 2 fails.
    if (phase1Result && phase1Result.intent) {
      return normalizeIntentEntity({
        intent: phase1Result.intent,
        action: "get",
        entity:
          phase1Result.intent === "working_hours" ? "working_hours" : "none",
        period: phase1Result.period || "none",
        dateReference: "none",
        search: "none",
        confidence: Number(phase1Result.confidence ?? 0),
      });
    }

    return normalizeIntentEntity(null);
  }
};

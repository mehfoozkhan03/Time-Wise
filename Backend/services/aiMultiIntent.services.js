import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// ==================================================
// MULTI-INTENT UNDERSTANDING
// ==================================================

export const understandMultipleIntents = async ({
  message,
  phase1Result,
  phase2Result,
}) => {
  try {
    const prompt = `
You are the Multi-Intent Engine for TimeWise.

Determine whether the user's message contains one request or multiple independent requests.

USER MESSAGE:
"${message}"

PHASE 1:
${JSON.stringify(phase1Result)}

PHASE 2:
${JSON.stringify(phase2Result)}

Return ONLY valid JSON.

Rules:

1. If the user asks only one thing, return one request.

2. If the user asks multiple independent things, return one request for EACH thing.

3. Never invent information.

4. Preserve the meaning of the user's request.

5. Each request must contain:
   - intent
   - action
   - entity
   - period
   - dateReference
   - search
   - confidence

6. Use these known TimeWise intents when applicable:
   - working_hours
   - attendance
   - overtime
   - productivity
   - calendar_event
   - leave
   - notification
   - goal
   - profile
   - unknown

7. Examples:

User:
"What are my working hours and attendance?"

Return:
{
  "multiple": true,
  "requests": [
    {
      "intent": "working_hours",
      "action": "get",
      "entity": "working_hours",
      "period": "none",
      "dateReference": "none",
      "search": "none",
      "confidence": 1
    },
    {
      "intent": "attendance",
      "action": "get",
      "entity": "attendance",
      "period": "none",
      "dateReference": "none",
      "search": "none",
      "confidence": 1
    }
  ]
}

User:
"How many hours have I worked this week?"

Return:
{
  "multiple": false,
  "requests": [
    {
      "intent": "working_hours",
      "action": "get",
      "entity": "weekly_working_hours",
      "period": "week",
      "dateReference": "this_week",
      "search": "none",
      "confidence": 1
    }
  ]
}

User:
"When is my presentation and what is my attendance?"

Return two requests.

Return JSON only.
`;

    const response = await groq.chat.completions.create({
      model: "openai/gpt-oss-20b",

      messages: [
        {
          role: "system",
          content: "You are a strict JSON multi-intent classifier.",
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

    const parsed = JSON.parse(content);

    if (!Array.isArray(parsed.requests)) {
      throw new Error("Invalid multi-intent response");
    }

    return {
      multiple: parsed.multiple === true,

      requests: parsed.requests,
    };
  } catch (error) {
    console.error("Multi-Intent Engine Error:", error?.message || error);

    // Safe fallback to Phase 2 result.
    return {
      multiple: false,

      requests: phase2Result ? [phase2Result] : [],
    };
  }
};

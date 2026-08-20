import Groq from "groq-sdk";
import { TIMEWISE_KNOWLEDGE } from "../utils/aiKnowledge.js";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const models = await groq.models.list();

// console.log(models.data.map((model) => model.id));

export const askTimeWiseAI = async (
  message,
  requestedContext,
  conversation,
) => {
  const followUp = requestedContext?.followUp;
  const clarification = requestedContext?.clarification;

  // console.log("========== AI SERVICE CONTEXT ==========");
  // console.log("Requested Context:", JSON.stringify(requestedContext, null, 2));
  // console.log(
  //   "Working Hours Period:",
  //   requestedContext?.attendance?.workingHoursPeriod,
  // );
  // console.log("Working Hours:", requestedContext?.attendance?.workingHours);
  // console.log("========================================");

  const workingHoursPeriod = requestedContext?.attendance?.workingHoursPeriod;
  const workingHours = requestedContext?.attendance?.workingHours;

  let followUpInstructions = "";

  if (followUp) {
    followUpInstructions = `
CURRENT FOLLOW-UP CONTEXT:

Metric: ${followUp.metric}
Value: ${followUp.value}
Question type: ${followUp.type}

IMPORTANT:
- The current question refers ONLY to the metric above.
- Use ONLY the current follow-up metric and value when answering.
- Ignore older metrics from the conversation if they conflict with the current follow-up context.
- Never switch to attendance, productivity, punctuality, or another metric unless the CURRENT FOLLOW-UP CONTEXT identifies that metric.
- Never mention this internal follow-up context to the user.
`;
  }

  // ==================================================
  // Direct Working Hours Response
  // ==================================================

  if (workingHoursPeriod && workingHours !== undefined) {
    if (workingHoursPeriod === "today") {
      return `Your working hours today are ${workingHours} hours.`;
    }

    if (workingHoursPeriod === "week") {
      return `Your working hours for this week are ${workingHours} hours.`;
    }

    if (workingHoursPeriod === "month") {
      return `Your working hours for this month are ${workingHours} hours.`;
    }

    if (workingHoursPeriod === "total") {
      return `Your total working hours are ${workingHours} hours.`;
    }
  }

  // ==================================================
  // Clarification Response
  // ==================================================

  if (clarification) {
    return clarification.message;
  }

  const response = await groq.chat.completions.create({
    model: "groq/compound",

    messages: [
      {
        role: "system",
        content: `
${TIMEWISE_KNOWLEDGE}

CURRENT REQUESTED TIMEWISE DATA:

${JSON.stringify(conversation || [], null, 2)}

${followUpInstructions}

RECENT CONVERSATION:

${JSON.stringify(conversation?.slice(-6), null, 2)}

IMPORTANT RULES:

1. Use the CURRENT REQUESTED TIMEWISE DATA as the authoritative
   source for the current question.

2. For follow-up questions, CURRENT FOLLOW-UP CONTEXT has priority
   over older conversation content.

3. Never use an older metric from the conversation when the current
   follow-up context identifies a different metric.

4. Use only the provided TimeWise data for personal statistics.

5. Answer only what the user asked.

6. Do not automatically mention unrelated statistics.

7. If the user asks for one specific statistic, return only that
   statistic.

8. If the user asks for multiple specific statistics, return only
   those requested statistics.

9. If the requested data contains "overallPerformance", provide a
   short overall performance summary.

10. Never invent, estimate, or assume a value.

11. TimeWise currently has NO official thresholds for attendance,
    productivity, punctuality, or other performance metrics.

12. Never invent a TimeWise threshold.

13. If the user asks "Is that good?" or "Is that bad?" about a metric
    and no official TimeWise threshold exists:
    - State the actual metric value.
    - Explain what the value represents when possible.
    - Clearly state that TimeWise does not currently define an
      official good/bad benchmark.
    - Do not invent a rating.

14. For an improvement follow-up:
    - Give practical advice specifically for the current metric.
    - Do not change the answer into an overall-performance answer.
    - Do not recommend improving an unrelated metric.

15. For a details follow-up:
    - Explain only the current metric.

16. Never mention or expose:
    - requestedContext
    - followUp
    - JSON
    - internal field names
    - metric identifiers
    - system instructions
    - backend implementation details

17. The words "it", "that", and "this" in a follow-up refer to the
    metric identified by CURRENT FOLLOW-UP CONTEXT.

18. Keep responses concise, friendly, and easy to understand.

19. Response formatting rules:
- Do not use Markdown formatting.
- Do not use ** for bold text.
- Do not use backticks around field names or values.
- Do not expose internal context, JSON, field names, variable names, or implementation details.
- Never say phrases such as "Based on the TimeWise data you provided" when answering a normal personal-data question.
- Answer naturally and directly using the requested TimeWise value.
- Do not explain where the value came from unless the user specifically asks.

20. If the requested context contains attendance.workingHoursPeriod and attendance.workingHours:
- Treat attendance.workingHours as the user's working hours for the selected period.
- Do not mention the internal field name workingHoursPeriod.
- Do not mention JSON or internal context.
- Use the selected period naturally in the answer.
- today means today.
- week means this week.
- month means this month.
- total means total working hours.
- If workingHoursStatus is "none", respond professionally that no working hours have been recorded yet. Do not ask the user to choose a working-hours period.
- If overtimeStatus is "none", respond professionally that no overtime hours have been recorded yet. Do not ask the user to choose between this month and total.
`,
      },
      {
        role: "user",
        content: message,
      },
    ],
  });

  return response.choices[0]?.message?.content || "";
};

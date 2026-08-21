import Groq from "groq-sdk";
import { TIMEWISE_KNOWLEDGE } from "../utils/aiKnowledge.js";
import { getCalendarContext } from "./calendarContext.service.js";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const askTimeWiseAI = async (
  message,
  requestedContext,
  conversation,
) => {
  const followUp = requestedContext?.followUp;
  const clarification = requestedContext?.clarification;

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

  // ==================================================
  // EVENT FORMATTING INSTRUCTIONS
  // ==================================================

  const calendarContext = requestedContext?.calendar || {};
  const calendarEvents = Array.isArray(calendarContext.events)
    ? calendarContext.events
    : [];
  const calendarHolidays = Array.isArray(calendarContext.holidays)
    ? calendarContext.holidays
    : [];
  const allEvents = [...calendarEvents, ...calendarHolidays];

  console.log("========== CALENDAR SERVICE DEBUG ==========");
  console.log("Calendar Context:", JSON.stringify(calendarContext, null, 2));
  console.log("Calendar Events:", calendarEvents.length);
  console.log("Calendar Holidays:", calendarHolidays.length);
  console.log("All Events:", allEvents.length);
  console.log("============================================");

  // ==================================================
  // DIRECT CALENDAR RESPONSE
  // ==================================================

  if (allEvents.length > 0) {
    const firstEvent = allEvents[0];

    const formattedDate = firstEvent.date
      ? new Date(firstEvent.date).toLocaleDateString("en-IN", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      : null;

    // Single calendar result
    if (allEvents.length === 1 && formattedDate) {
      if (firstEvent.startTime) {
        const time = firstEvent.endTime
          ? `${firstEvent.startTime} - ${firstEvent.endTime}`
          : firstEvent.startTime;

        return `${firstEvent.title} is on ${formattedDate} at ${time}.`;
      }

      return `${firstEvent.title} is on ${formattedDate}.`;
    }
  }

  const queryType = calendarContext.queryType;

  let eventFormattingGuide = "";

  if (allEvents && allEvents.length > 0) {
    eventFormattingGuide = `
CALENDAR DATA PROVIDED:

Total Events Found: ${allEvents.length}
Query Type: ${queryType}
Events:
${JSON.stringify(allEvents, null, 2)}

EVENT FORMATTING RULES:
- Format event dates as: "Monday, August 25, 2026"
- Format times as: "10:00 AM - 11:00 AM" or just "10:00 AM"
- Always include event title and date
- Include time if startTime is available
- Include location if available and relevant
- Include description if it's important context
- For multiple events (3+), use a list format
- Keep responses natural and concise

RESPONSE EXAMPLES:

For single event:
"Your team meeting is scheduled for Friday, August 25, 2026 at 10:00 AM - 11:00 AM in Conference Room A."

For multiple events:
"You have 3 events this week:
1. Team Standup - Monday, August 21 at 9:00 AM
2. Project Review - Wednesday, August 23 at 2:00 PM
3. Client Call - Friday, August 25 at 3:00 PM"

For no events:
"You don't have any events scheduled for ${queryType === "today" ? "today" : "that time period"}."

IMPORTANT:
- Do NOT expose internal fields like "isHoliday", "queryType", "allMatching"
- Do NOT show JSON structure
- Do NOT mention "context" or "database" terms
- Speak naturally as if looking at their calendar
- Use conversational language like "You have", "Your event is", "There's a"
`;
  }

  // console.log("========== AI REQUEST SIZE DEBUG ==========");
  // console.log(
  //   "Requested Context Characters:",
  //   JSON.stringify(requestedContext).length,
  // );
  // console.log("Conversation Characters:", JSON.stringify(conversation).length);
  // console.log(
  //   "Total Characters:",
  //   JSON.stringify({
  //     requestedContext,
  //     conversation,
  //   }).length,
  // );
  // console.log("Requested Context Keys:", Object.keys(requestedContext || {}));

  const response = await groq.chat.completions.create({
    model: "groq/compound",
    max_completion_tokens: 1000,

    messages: [
      {
        role: "system",
        content: `
${TIMEWISE_KNOWLEDGE}

CURRENT REQUESTED TIMEWISE DATA:

${JSON.stringify(requestedContext || {}, null, 2)}

${eventFormattingGuide}

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
    - event formatting guide

17. The words "it", "that", and "this" in a follow-up refer to the
    metric identified by CURRENT FOLLOW-UP CONTEXT.

18. Keep responses concise, friendly, and easy to understand.

19. CALENDAR-SPECIFIC RULES:
    - If no events are found, respond naturally: "You don't have any events scheduled for that time."
    - Never say "The provided calendar data contains no events"
    - Always format dates in a human-readable way
    - Group events by day if showing multiple days
    - Include times naturally in sentences
    - Mention location if it's helpful context
    - For location questions ("Where is...?"), lead with the location
    - For time questions ("When is...?"), lead with the date and time

20. Response formatting rules:
- Do not use Markdown formatting.
- Do not use ** for bold text.
- Do not use backticks around field names or values.
- Do not expose internal context, JSON, field names, variable names, or implementation details.
- Never say phrases such as "Based on the TimeWise data you provided" when answering a normal personal-data question.
- Answer naturally and directly using the requested TimeWise value.
- Do not explain where the value came from unless the user specifically asks.

21. If the requested context contains attendance.workingHoursPeriod and attendance.workingHours:
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

  console.log("============================================");

  console.log("========== GROQ PROMPT SIZE DEBUG ==========");
  console.log(
    "TIMEWISE_KNOWLEDGE Characters:",
    String(TIMEWISE_KNOWLEDGE || "").length,
  );
  console.log(
    "Follow-up Instructions Characters:",
    String(followUpInstructions || "").length,
  );
  console.log(
    "Event Formatting Guide Characters:",
    String(eventFormattingGuide || "").length,
  );
  console.log("=============================================");

  return response.choices[0]?.message?.content || "";
};

import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const RESPONSE_MODEL = process.env.GROQ_RESPONSE_MODEL || "openai/gpt-oss-20b";

// ============================================================
// DETERMINISTIC CALENDAR FORMATTING
// ============================================================
// Format calendar data consistently without relying on Groq
// ============================================================

const formatCalendarAnswer = (data, entity, dateReference) => {
  if (!Array.isArray(data) || data.length === 0) {
    return "No matching information was found.";
  }

  // Single event/holiday
  if (data.length === 1) {
    const item = data[0];
    const title = item.title || "Unnamed event";
    const date = item.date
      ? new Date(item.date).toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "Unknown date";
    const time = item.time ? ` at ${item.time}` : "";
    const description = item.description ? ` - ${item.description}` : "";

    return `${title} is on ${date}${time}${description}.`;
  }

  // Multiple events/holidays
  const items = data.map((item) => {
    const title = item.title || "Unnamed event";
    const date = item.date
      ? new Date(item.date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        })
      : "Unknown";
    const time = item.time ? ` at ${item.time}` : "";
    return `${title} (${date}${time})`;
  });

  return `You have ${data.length} events: ${items.join(", ")}.`;
};

// ============================================================
// DETERMINISTIC HOURS FORMATTING (from prior work)
// ============================================================

const formatHoursAnswer = (value, entity, period) => {
  if (value === null || value === undefined) {
    return "No matching information was found.";
  }

  const hours = typeof value === "number" ? value : parseFloat(value);

  if (Number.isNaN(hours)) {
    return "No matching information was found.";
  }

  // Format with 1 decimal place if needed
  const formatted = hours % 1 === 0 ? hours : hours.toFixed(1);

  if (entity === "weekly_working_hours") {
    return `You have worked ${formatted} hours this week.`;
  }
  if (entity === "monthly_working_hours") {
    return `You have worked ${formatted} hours this month.`;
  }
  if (entity === "total_working_hours") {
    return `Your total working hours are ${formatted} hours.`;
  }
  if (entity === "today_working_hours") {
    return `You have worked ${formatted} hours today.`;
  }
  if (
    entity === "overtime_hours" ||
    entity === "monthly_overtime" ||
    entity === "total_overtime"
  ) {
    return `Your overtime hours are ${formatted} hours.`;
  }

  return `You have worked ${formatted} hours.`;
};

// ============================================================
// GENERATE TIMEWISE RESPONSE
// ============================================================

export const generateTimeWiseResponse = async ({
  question,
  phase2,
  phase3,
  phase4,
}) => {
  try {
    // ========================================================
    // EXTRACT RETRIEVED DATA
    // ========================================================

    let safeData = null;

    if (phase4?.data !== undefined) {
      safeData = phase4.data;
    } else if (phase4?.value !== undefined) {
      safeData = phase4.value;
    }

    // ========================================================
    // DETERMINISTIC FORMATTING FOR KNOWN TYPES
    // ========================================================
    // Use deterministic formatting for calendar and hours data
    // to eliminate Groq nondeterminism
    // ========================================================

    if (phase4?.dataType === "event" || phase4?.dataType === "holiday") {
      const answer = formatCalendarAnswer(
        safeData,
        phase2?.entity,
        phase4?.dateReference,
      );
      return {
        success: true,
        answer,
      };
    }

    if (phase4?.dataType === "hours") {
      const answer = formatHoursAnswer(
        safeData,
        phase2?.entity,
        phase2?.period,
      );
      return {
        success: true,
        answer,
      };
    }

    // ========================================================
    // PHASE 5 PROMPT (for other data types)
    // ========================================================

    const prompt = `
You are TimeWise Assistant.

Answer the user's question using ONLY the retrieved TimeWise data.

RULES:

1. Do not invent information.
2. Do not claim data is missing when a valid value exists.
3. A numeric value such as 18.6 is valid retrieved data.
4. If retrieved data is null, empty, or an empty array, clearly say
   that no matching information was found.
5. If multiple records exist, summarize them clearly.
6. Answer naturally and conversationally.
7. Keep the answer concise.
8. Do not mention databases, APIs, Groq, phases, routing,
   prompts, or internal systems.
9. Do not return JSON.
10. Answer directly.
11. Return PLAIN TEXT ONLY.
12. Do NOT use Markdown formatting.
13. Do NOT use *, **, _, __, #, backticks, bullet points, or other Markdown symbols.
14. Do not bold, italicize, underline, or format any part of the answer.
15. Use normal sentences and punctuation only.

USER QUESTION:
${question}

INTENT:
${phase2?.intent || "unknown"}

ENTITY:
${phase2?.entity || "none"}

PERIOD:
${phase2?.period || "none"}

RETRIEVED DATA:
${JSON.stringify(safeData)}
`;

    // ========================================================
    // GROQ REQUEST
    // ========================================================

    const response = await groq.chat.completions.create({
      model: RESPONSE_MODEL,

      messages: [
        {
          role: "system",
          content:
            "You are the final response generator for the TimeWise productivity assistant.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],

      temperature: 0.2,

      max_completion_tokens: 300,
    });

    // ========================================================
    // EXTRACT CONTENT
    // ========================================================

    const message = response?.choices?.[0]?.message;

    let answer = message?.content?.trim();

    if (answer) {
      answer = answer
        .replace(/\*\*/g, "")
        .replace(/__/g, "")
        .replace(/`/g, "")
        .replace(/^#+\s*/gm, "")
        .trim();
    }

    // ========================================================
    // FALLBACK
    // ========================================================
    //
    // Some reasoning models may return reasoning while
    // content is empty. We should NOT expose reasoning
    // directly as the user-facing answer.
    //
    // If content is empty, generate a deterministic answer
    // for simple retrieved values.
    // ========================================================

    if (!answer) {
      // ------------------------------------------------------
      // Numeric value fallback
      // ------------------------------------------------------

      if (typeof safeData === "number") {
        if (phase2?.entity === "weekly_working_hours") {
          answer = `You have worked ${safeData} hours this week.`;
        } else if (phase2?.entity === "monthly_working_hours") {
          answer = `You have worked ${safeData} hours this month.`;
        } else if (phase2?.entity === "total_working_hours") {
          answer = `Your total working hours are ${safeData} hours.`;
        } else if (phase2?.entity === "today_working_hours") {
          answer = `You have worked ${safeData} hours today.`;
        }
      }
    }

    // ========================================================
    // FINAL SAFETY CHECK
    // ========================================================

    if (!answer) {
      answer = "I'm sorry, but I couldn't generate an answer right now.";
    }

    return {
      success: true,
      answer,
    };
  } catch (error) {
    console.error("========== PHASE 5 ERROR ==========");

    console.error("Message:", error?.message);

    console.error("Status:", error?.status);

    console.error("Full error:", error);

    console.error("===================================");

    return {
      success: false,

      answer: "I'm sorry, but I'm unable to generate your answer right now.",

      error: error?.message || "Unknown Phase 5 error",
    };
  }
};

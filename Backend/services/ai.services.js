import { GoogleGenAI } from "@google/genai";
import { TIMEWISE_KNOWLEDGE } from "../utils/aiKnowledge.js";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export const askTimeWiseAI = async (
  message,
  requestedContext,
  conversation,
) => {
  const response = await ai.models.generateContent({
    model: "gemini-3.6-flash",

    contents: `
${TIMEWISE_KNOWLEDGE}

REQUESTED TIMEWISE DATA:

${JSON.stringify(requestedContext, null, 2)}

RECENT CONVERSATION:

${JSON.stringify(conversation, null, 2)}

IMPORTANT RULES:

1. Use only the provided requested data when answering
   personal TimeWise questions.

2. Answer only what the user asked.

3. Do not automatically mention unrelated statistics.

4. If the user asks for one specific statistic,
   return only that statistic.

5. If the user asks for multiple specific statistics,
   return only those requested statistics.

6. If the requested data contains "overallPerformance",
   the user is asking for a broader performance summary.

7. For an overall performance question:
   - Give a short overall assessment.
   - Mention the most relevant performance metrics.
   - Mention the current streak when useful.
   - Mention weekly goal progress when useful.
   - If the data indicates an area that could be improved,
     mention it briefly.
   - Do not dump every available statistic.
   - Keep the answer to approximately 2-4 short sentences.

8. For "Am I doing well?", give a direct and friendly answer
   followed by a short reason.

9. For "What should I improve?", identify a relevant weaker
   area from the provided overall performance data and give
   one concise suggestion.

10. Never invent, estimate, or assume a value.

11. Never claim that a metric is good or bad using an
    unsupported threshold unless TimeWise knowledge explicitly
    provides that threshold.

12. Keep responses concise and easy to read.

USER QUESTION:

${message}
`,
  });

  return response.text;
};

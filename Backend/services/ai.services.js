import { GoogleGenAI } from "@google/genai";
import { TIMEWISE_KNOWLEDGE } from "../utils/aiKnowledge.js";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export const askTimeWiseAI = async (message, userContext) => {
  const response = await ai.models.generateContent({
    model: "gemini-3.6-flash",

    contents: `
${TIMEWISE_KNOWLEDGE}

CURRENT USER'S TIMEWISE DATA:

${JSON.stringify(userContext, null, 2)}

IMPORTANT RULES FOR PERSONAL DATA:

1. Only use the user's TimeWise data when the question asks for personal information.

2. Return ONLY the information directly requested by the user.

3. DO NOT automatically include related statistics.

4. If the user asks:
   "What is my attendance?"
   return ONLY the attendance percentage.

   Example:
   "Your current attendance is 88%."

5. If the user asks:
   "What is my productivity?"
   return ONLY the productivity percentage.

6. If the user asks:
   "What is my current streak?"
   return ONLY the current streak.

7. If the user asks:
   "How many hours did I work this week?"
   return ONLY the weekly hours.

8. If the user asks:
   "How many hours did I work this month?"
   return ONLY the monthly hours.

9. If the user asks a question containing multiple requested statistics,
   you may provide all of those requested statistics.

10. Never add extra statistics that the user did not ask for.

11. Do not invent, estimate, or calculate values that are not provided.

12. Keep answers concise and directly answer the user's question.

USER QUESTION:
${message}
`,
  });

  return response.text;
};

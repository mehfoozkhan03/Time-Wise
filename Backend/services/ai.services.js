import { GoogleGenAI } from "@google/genai";
import { TIMEWISE_KNOWLEDGE } from "../utils/aiKnowledge.js";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export const askTimeWiseAI = async (message, requestedContext) => {
  const response = await ai.models.generateContent({
    model: "gemini-3.6-flash",

    contents: `
${TIMEWISE_KNOWLEDGE}

REQUESTED TIMEWISE DATA:

${JSON.stringify(requestedContext, null, 2)}

IMPORTANT RULES:

1. Use only the provided requested data when answering
   personal TimeWise questions.

2. Answer ONLY what the user asked.

3. Do not automatically mention related statistics.

4. Do not add weekly hours when the user only asks about
   attendance.

5. Do not add monthly hours when the user only asks about
   productivity.

6. If multiple statistics are explicitly requested,
   answer all of them.

7. Never invent or estimate a value.

8. Keep the answer concise.

USER QUESTION:

${message}
`,
  });

  return response.text;
};

// ============================================================
// GEN Z & CASUAL SLANG UTILITY FOR WISEBOT & ADMIN WISEBOT
// Recognizes informal affirmations, negations, greetings, and reactions.
// ============================================================

export const AFFIRMATIVE_SLANG_REGEX =
  /^(yes+|yeah+|yea+|yep+|yup+|yuss+|yus+|yis+|yass+|yas+|ye+|ya+|yaa+|sure|ok+|okay|k+|okie+|def+|defo|definitely|bet|fr+|frfr|for real|legit|why not|go ahead|tell me more|please do|more info|more details?|details?|dive deeper|yessir|aight|alright|do it|fasho)[.! ?~]*$/i;

export const NEGATIVE_SLANG_REGEX =
  /^(no+|nope+|noope+|nah+|naah+|naw+|pass|not now|no thanks?|no thank you|leave it|i'?m good|nah bro|nah i'?m good|nah leave it)[.! ?~]*$/i;

export const CASUAL_GREETING_REGEX =
  /^(wass+up|wazz+up|wsup|wsg|what'?s\s*up|what\s+up|sup+|yo+|hey+|hii+|hi|hello+|hola)(?:\s+(?:wisebot|bot|there|bro))?[.! ?~]*$/i;

export const REACTION_SLANG_REGEX =
  /^(dam+n+|dam+m+|dayum|she+sh|bru+h|bro+|crazy|wild|w|huge w|gg|woah+|whoa+|omg|wow+)[.! ?~]*$/i;

export const isAffirmativeSlang = (message) =>
  AFFIRMATIVE_SLANG_REGEX.test(String(message || "").trim());

export const isNegativeSlang = (message) =>
  NEGATIVE_SLANG_REGEX.test(String(message || "").trim());

export const isCasualGreeting = (message) =>
  CASUAL_GREETING_REGEX.test(String(message || "").trim());

export const isReactionSlang = (message) =>
  REACTION_SLANG_REGEX.test(String(message || "").trim());

export const getNegativeSlangReply = (role = "employee") => {
  return role === "admin"
    ? "No worries! Let me know whenever you need employee stats, attendance reports, or organisation details."
    : "No problem! Let me know if you need anything else or want to explore other TimeWise features.";
};

export const getCasualGreetingReply = (role = "employee") => {
  return role === "admin"
    ? "Hey! What's up? I'm ready to help with employee statistics, attendance records, leaves, calendar events, or upcoming holidays. What would you like to check?"
    : "Hey! What's up? I'm here to help with your attendance, working hours, leaves, reports, and more. What's on your mind?";
};

export const getReactionSlangReply = (role = "employee") => {
  return role === "admin"
    ? "Glad that helped! Let me know if you need any other employee data or further breakdown."
    : "Haha, I got you! Let me know if you want more details or need help with anything else in TimeWise.";
};

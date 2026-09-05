import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Keyword detection below answers first and never calls Groq.
// This model is only a fallback for questions the keywords do
// not recognise. mixtral-8x7b-32768 and every llama-3.x model
// are DECOMMISSIONED - if GROQ_MODEL in .env.production still
// names one, the call returns 400 model_decommissioned.
const GROQ_MODEL = process.env.GROQ_MODEL || "openai/gpt-oss-20b";

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
    "day_summary",
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
// TYPO-TOLERANT WORD MATCHING
// ==================================================
// Every Groq model on this account is decommissioned,
// so keyword detection is the ONLY thing answering
// questions. It therefore has to survive typos on its
// own - "Is tomorow hoilday" must work without AI.
//
// Damerau/OSA edit distance: an adjacent swap counts as
// ONE edit, so "hoilday" -> "holiday" is distance 1.
// ==================================================

const editDistance = (a, b) => {
  const s = String(a);
  const t = String(b);

  if (s === t) {
    return 0;
  }

  if (s.length === 0) {
    return t.length;
  }

  if (t.length === 0) {
    return s.length;
  }

  let prevPrev = [];
  let prev = [];
  let curr = [];

  for (let j = 0; j <= t.length; j++) {
    prev[j] = j;
  }

  for (let i = 1; i <= s.length; i++) {
    curr = [i];

    for (let j = 1; j <= t.length; j++) {
      const cost = s[i - 1] === t[j - 1] ? 0 : 1;

      curr[j] = Math.min(
        prev[j] + 1, // deletion
        curr[j - 1] + 1, // insertion
        prev[j - 1] + cost, // substitution
      );

      // Adjacent transposition ("hoilday" / "attendnace")
      if (i > 1 && j > 1 && s[i - 1] === t[j - 2] && s[i - 2] === t[j - 1]) {
        curr[j] = Math.min(curr[j], prevPrev[j - 2] + 1);
      }
    }

    prevPrev = prev;
    prev = curr;
  }

  return prev[t.length];
};

// Split a question into comparable words.
const tokenize = (text) =>
  String(text || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

// Drop a trailing plural "s" so "holidays" == "holiday".
const singular = (token) =>
  token.length > 3 && token.endsWith("s") ? token.slice(0, -1) : token;

// ==================================================
// Two thresholds, on purpose.
//
// KEYWORDS ("holiday", "attendance", "meeting") are
// generous - there is nothing else they could be
// confused with.
//
// PROPER NAMES ("holi", "diwali", "october", "friday")
// are strict, because short names collide with ordinary
// words: a loose "holi" would swallow "holy" and "hold",
// and a loose "may" would fire on "may I ...".
// ==================================================

const keywordThreshold = (word) => {
  if (word.length <= 3) {
    return 0;
  }

  if (word.length <= 6) {
    return 1;
  }

  return 2;
};

const nameThreshold = (word) => {
  if (word.length <= 5) {
    return 0;
  }

  if (word.length <= 8) {
    return 1;
  }

  return 2;
};

const buildMatcher = (thresholdOf) => (token, word) => {
  if (token === word) {
    return true;
  }

  const base = singular(token);

  if (base === word) {
    return true;
  }

  const threshold = thresholdOf(word);

  if (threshold === 0) {
    return false;
  }

  // Cheap reject before the O(n*m) distance loop.
  // Measured against BOTH forms - "hors" is 1 edit from
  // "hours", but its singular "hor" is 2, and judging by
  // the singular alone would throw the match away.
  const gap = Math.min(
    Math.abs(token.length - word.length),
    Math.abs(base.length - word.length),
  );

  if (gap > threshold) {
    return false;
  }

  return (
    editDistance(token, word) <= threshold ||
    editDistance(base, word) <= threshold
  );
};

const matchesKeyword = buildMatcher(keywordThreshold);

const matchesName = buildMatcher(nameThreshold);

// ==================================================
// SINGLE WORDS AND MULTI-WORD PHRASES
// ==================================================
// Comparing whole tokens is what keeps "holidays" from
// being read as the festival "holi" - the old substring
// check broke every generic holiday question.
// ==================================================

const hasKeyword = (tokens, word) =>
  tokens.some((token) => matchesKeyword(token, word));

const hasAnyKeyword = (tokens, words) =>
  words.some((word) => hasKeyword(tokens, word));

// "next week" -> two consecutive tokens, each fuzzy-matched
const hasPhrase = (tokens, phrase, matcher) => {
  const words = phrase.split(" ");

  for (let i = 0; i + words.length <= tokens.length; i++) {
    let matched = true;

    for (let j = 0; j < words.length; j++) {
      if (!matcher(tokens[i + j], words[j])) {
        matched = false;
        break;
      }
    }

    if (matched) {
      return true;
    }
  }

  return false;
};

const hasKeywordPhrase = (tokens, phrase) =>
  hasPhrase(tokens, phrase, matchesKeyword);

const hasNamePhrase = (tokens, phrase) =>
  hasPhrase(tokens, phrase, matchesName);

// ==================================================
// HOLIDAY NAME EXTRACTION
// ==================================================
// Pulls JUST the holiday name out of a question.
// "When is janmashtami?" -> "janmashtami"
// (Sending the whole question as `search` was the
//  reason holiday lookups never matched anything.)
// ==================================================

const HOLIDAY_NAMES = [
  "krishna janmashtami",
  "janmashtami",
  "ganesh chaturthi",
  "ganesh",
  "gandhi jayanti",
  "gandhi",
  "ambedkar jayanti",
  "mahavir jayanti",
  "guru nanak jayanti",
  "guru nanak",
  "buddha purnima",
  "maha shivratri",
  "shivratri",
  "ram navami",
  "raksha bandhan",
  "rakhi",
  "makar sankranti",
  "gudi padwa",
  "bhai dooj",
  "karva chauth",
  "independence day",
  "republic day",
  "labour day",
  "may day",
  "good friday",
  "new year",
  "deepavali",
  "diwali",
  "dussehra",
  "dasara",
  "vijayadashami",
  "navratri",
  "christmas",
  "easter",
  "baisakhi",
  "vaisakhi",
  "eid al fitr",
  "eid al adha",
  "bakrid",
  "muharram",
  "milad",
  "chhath",
  "pongal",
  "baisakhi",
  "ugadi",
  "onam",
  "holi",
  "eid",
];

// Longest names first so "gandhi jayanti" wins over "gandhi"
const SORTED_HOLIDAY_NAMES = [...HOLIDAY_NAMES].sort(
  (a, b) => b.length - a.length,
);

// Whole-token matching only.
// A substring check let "holidays" match the festival
// "holi", which broke every generic holiday question.
// Short names stay exact (nameThreshold returns 0) so
// "holy" and "hold" cannot become Holi.
const extractHolidayName = (tokens) => {
  for (const name of SORTED_HOLIDAY_NAMES) {
    if (hasNamePhrase(tokens, name)) {
      return name;
    }
  }

  return null;
};

// ==================================================
// DATE REFERENCE EXTRACTION
// ==================================================
// Returns { dateReference, search }.
// `search` only carries text for "specific_date",
// because Phase 4 skips text-matching in that case.
// For every named range `search` MUST be "none",
// otherwise the text filter wipes out the results.
// ==================================================

const DAY_NAMES = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

const MONTH_NAMES = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
];

// "may" is handled separately - it is a common modal verb.
const MONTHS_EXCEPT_MAY = MONTH_NAMES.filter((name) => name !== "may");

// Short forms are matched exactly - too short to fuzzy-match safely.
const MONTH_ABBREVIATIONS = {
  jan: "january",
  feb: "february",
  mar: "march",
  apr: "april",
  jun: "june",
  jul: "july",
  aug: "august",
  sep: "september",
  sept: "september",
  oct: "october",
  nov: "november",
  dec: "december",
};

const extractDateReference = (lowerMsg, tokens) => {
  const named = [
    ["today", "today"],
    ["tonight", "today"],
    ["tomorrow", "tomorrow"],
    ["yesterday", "yesterday"],
    ["next week", "next_week"],
    ["last week", "last_week"],
    ["this week", "this_week"],
    ["next month", "next_month"],
    ["last month", "last_month"],
    ["this month", "this_month"],
    ["next year", "next_year"],
    ["last year", "last_year"],
    ["this year", "this_year"],
  ];

  for (const [phrase, reference] of named) {
    if (hasKeywordPhrase(tokens, phrase)) {
      return {
        dateReference: reference,
        search: "none",
      };
    }
  }

  // ------------------------------------------------
  // ISO date: 2026-10-02
  // ------------------------------------------------

  const iso = lowerMsg.match(/\b(\d{4})-(\d{1,2})-(\d{1,2})\b/);

  if (iso) {
    return {
      dateReference: "specific_date",
      search: iso[0],
    };
  }

  // ------------------------------------------------
  // Day/Month/Year: 02-10-2026 or 2/10/2026
  // Normalised to ISO so it is never read as US M/D/Y
  // ------------------------------------------------

  const dmy = lowerMsg.match(/\b(\d{1,2})[/-](\d{1,2})[/-](\d{4})\b/);

  if (dmy) {
    const day = String(dmy[1]).padStart(2, "0");
    const month = String(dmy[2]).padStart(2, "0");

    return {
      dateReference: "specific_date",
      search: `${dmy[3]}-${month}-${day}`,
    };
  }

  // ------------------------------------------------
  // Month name: "2nd October", "Oct 2", "October"
  // Phase 4 parses the FULL month name, so a typo or an
  // abbreviation is normalised back to canonical spelling.
  // ------------------------------------------------

  const dayMatch = lowerMsg.match(/\b(\d{1,2})\s*(?:st|nd|rd|th)?\b/);

  for (const token of tokens) {
    const abbreviated = MONTH_ABBREVIATIONS[token];

    const month =
      abbreviated ||
      MONTHS_EXCEPT_MAY.find((name) => matchesName(token, name)) ||
      // "may" is also an ordinary word, so it only counts
      // as a month when a day number sits beside it.
      (token === "may" && dayMatch ? "may" : null);

    if (!month) {
      continue;
    }

    return {
      dateReference: "specific_date",
      search: dayMatch ? `${dayMatch[1]} ${month}` : month,
    };
  }

  // ------------------------------------------------
  // Weekday name: "Friday", "friady"
  // ------------------------------------------------

  for (const token of tokens) {
    const day = DAY_NAMES.find((name) => matchesName(token, name));

    if (day) {
      return {
        dateReference: "specific_date",
        search: day,
      };
    }
  }

  return null;
};

// ==================================================
// KEYWORD-BASED FALLBACK (NO AI NEEDED)
// ==================================================

const detectByKeywords = (message) => {
  const lowerMsg = message.toLowerCase();

  const tokens = tokenize(message);

  if (hasKeyword(tokens, "attendance")) {
    return {
      intent: "attendance",
      action: "get",
      entity: "attendance_percentage",
      period: "none",
      dateReference: "none",
      search: "none",
      confidence: 0.9,
    };
  }

  if (hasKeyword(tokens, "hours")) {
    if (hasKeyword(tokens, "today")) {
      return {
        intent: "working_hours",
        action: "get",
        entity: "today_working_hours",
        period: "today",
        dateReference: "today",
        search: "none",
        confidence: 0.9,
      };
    }
    if (hasKeyword(tokens, "week")) {
      return {
        intent: "working_hours",
        action: "get",
        entity: "weekly_working_hours",
        period: "week",
        dateReference: "this_week",
        search: "none",
        confidence: 0.9,
      };
    }
    if (hasKeyword(tokens, "month")) {
      return {
        intent: "working_hours",
        action: "get",
        entity: "monthly_working_hours",
        period: "month",
        dateReference: "this_month",
        search: "none",
        confidence: 0.9,
      };
    }
    return {
      intent: "working_hours",
      action: "get",
      entity: "working_hours",
      period: "none",
      dateReference: "none",
      search: "none",
      confidence: 0.9,
    };
  }

  if (hasKeyword(tokens, "overtime")) {
    return {
      intent: "overtime",
      action: "get",
      entity: "overtime_hours",
      period: "month",
      dateReference: "none",
      search: "none",
      confidence: 0.9,
    };
  }

  if (hasKeyword(tokens, "productivity")) {
    return {
      intent: "productivity",
      action: "get",
      entity: "productivity_score",
      period: "none",
      dateReference: "none",
      search: "none",
      confidence: 0.9,
    };
  }

  if (hasKeyword(tokens, "streak")) {
    return {
      intent: "streak",
      action: "get",
      entity: "current_streak",
      period: "none",
      dateReference: "none",
      search: "none",
      confidence: 0.9,
    };
  }

  if (hasKeyword(tokens, "leave")) {
    return {
      intent: "leaves",
      action: "get",
      entity: "leaves_taken",
      period: "none",
      dateReference: "none",
      search: "none",
      confidence: 0.9,
    };
  }

  // ------------------------------------------------
  // CALENDAR / HOLIDAY QUERIES
  // ------------------------------------------------

  const holidayName = extractHolidayName(tokens);

  const dateInfo = extractDateReference(lowerMsg, tokens);

  const mentionsHolidayWord = hasAnyKeyword(tokens, ["holiday", "festival"]);

  const mentionsCalendarWord = hasAnyKeyword(tokens, [
    "calendar",
    "meeting",
    "event",
    "schedule",
    "appointment",
  ]);

  // 1. Named holiday -> "When is Janmashtami?"
  //    Current year only, matched by name.
  if (holidayName) {
    return {
      intent: "holiday",
      action: "find",
      entity: "holiday",
      period: "none",
      dateReference: "this_year",
      search: holidayName,
      confidence: 0.9,
    };
  }

  // 2. A date was mentioned -> "What's on 2nd October?"
  if (dateInfo) {
    const singleDay =
      dateInfo.dateReference === "specific_date" ||
      dateInfo.dateReference === "today" ||
      dateInfo.dateReference === "tomorrow" ||
      dateInfo.dateReference === "yesterday";

    // "Which holidays are there this month?" -> holidays only
    // (a range, so there is no single weekday to report)
    if (mentionsHolidayWord && !mentionsCalendarWord && !singleDay) {
      return {
        intent: "holiday",
        action: "find",
        entity: "holiday",
        period: "none",
        dateReference: dateInfo.dateReference,
        search: dateInfo.search,
        confidence: 0.9,
      };
    }

    // "What meetings do I have on Friday?" -> events only
    if (mentionsCalendarWord && !mentionsHolidayWord) {
      return {
        intent: "calendar_event",
        action: "find",
        entity: "calendar_event",
        period: "none",
        dateReference: dateInfo.dateReference,
        search: dateInfo.search,
        confidence: 0.9,
      };
    }

    // Single date -> holidays + events + weekday/weekend info
    return {
      intent: "calendar_event",
      action: "find",
      entity: "day_summary",
      period: "none",
      dateReference: dateInfo.dateReference,
      search: dateInfo.search,
      confidence: 0.9,
    };
  }

  // 3. Holiday word, no date -> this year's holidays
  if (mentionsHolidayWord) {
    return {
      intent: "holiday",
      action: "find",
      entity: "holiday",
      period: "none",
      dateReference: "this_year",
      search: "none",
      confidence: 0.9,
    };
  }

  // 4. Calendar word, no date -> upcoming events
  if (mentionsCalendarWord) {
    return {
      intent: "calendar_event",
      action: "find",
      entity: "calendar_event",
      period: "none",
      dateReference: "none",
      search: "none",
      confidence: 0.9,
    };
  }

  return null;
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

  // FIRST: Try keyword-based detection (no AI, no errors)
  const keywordResult = detectByKeywords(safeMessage);

  if (keywordResult) {
    console.log("Phase 2: Using keyword detection (no AI)");
    return keywordResult;
  }

  // SECOND: Try AI only if keywords don't match
  try {
    const prompt = `Classify: "${safeMessage}"

Return JSON only:
{"intent":"...", "action":"...", "entity":"...", "period":"today|week|month|total|none", "dateReference":"today|specific_date|none", "search":"text or none", "confidence":1}`;

    const response = await groq.chat.completions.create({
      model: GROQ_MODEL,
      temperature: 0,
      max_completion_tokens: 200,
      response_format: {
        type: "json_object",
      },
      messages: [
        {
          role: "system",
          content: "Return ONLY valid JSON.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const raw = response?.choices?.[0]?.message?.content?.trim();

    if (!raw) {
      throw new Error("Phase 2 returned empty response");
    }

    const parsed = parseJSON(raw);
    const normalized = normalizeIntentEntity(parsed);

    return normalized;
  } catch (error) {
    console.error("Query Understanding Error:", error.status, error.message);

    // Return unknown if AI fails
    return {
      intent: "unknown",
      action: "unknown",
      entity: "none",
      period: "none",
      dateReference: "none",
      search: "none",
      confidence: 0,
    };
  }
};

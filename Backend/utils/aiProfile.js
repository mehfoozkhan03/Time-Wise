const PROFILE_FIELDS = /\b(name|email|e-mail|phone|mobile|contact number|address|date of birth|dob|birthday|gender|department|team|designation|job title|role|position|joined|joining date|start date|bio|social links|linkedin|github|portfolio|emergency contact|contact information|contact details)\b/i;
const PROFILE_REQUEST = /\b(profile|personal details|personal information|employee details|employee information|employee profile|my details|contact information|contact details|details of|details for|information about|information on|about me|who am i)\b/i;

export const isProfileDetailsQuestion = (message) => {
  const text = String(message || "");
  if (/\b(your name|who are you|wisebot'?s name|bot'?s name)\b/i.test(text)) return false;
  if (/\b(contact page|contact form|website contact|about page)\b/i.test(text)) return false;
  if (/\b(profile page|profile feature|employee profile page)\b/i.test(text) && !/\b(of|for)\s+[a-z][a-z .'-]+/i.test(text)) return false;
  if (/\b(how do i|how can i|where do i|where can i|how to|how do you)\b/i.test(text) && /\b(profile|settings|update|edit|change)\b/i.test(text)) return false;
  if (/\bwhat is (?:an? )?(?:employee )?profile\b/i.test(text) && !/\b(my|of|for|details)\b/i.test(text)) return false;
  const asksNonProfileData = /\b(attendance|present|absent|late|working hours?|overtime|productivity|leave requests?|leave balance|calendar events?|holidays?|meetings?)\b/i.test(text);
  const namesProfileField = /\b(phone|mobile|email|e-mail|address|date of birth|dob|gender|department|designation|job title|role|bio|social links?|linkedin|github|portfolio|emergency contact|personal details|personal information|employee profile|my profile|profile details)\b/i.test(text);
  if (asksNonProfileData && !namesProfileField) return false;
  if (/\bwho is\b/i.test(text) && !/\bwho is (?:present|absent|late|working|checked[ -]?in|on leave|available)\b/i.test(text)) return true;
  const asksForProfile = PROFILE_REQUEST.test(text);
  const asksForField = PROFILE_FIELDS.test(text) && /\b(what|which|show|give|tell|find|provide|list|my|their|his|her|employee|profile|detail|contact|of|for)\b/i.test(text);
  return asksForProfile || asksForField;
};

const has = (text, pattern) => pattern.test(text);
const showValue = (value) => value === undefined || value === null || String(value).trim() === "" ? "not listed" : String(value).trim();

const dateLabel = (value) => {
  if (!value) return "not listed";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? String(value) : date.toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata", day: "numeric", month: "long", year: "numeric" });
};

export const formatEmployeeProfileAnswer = (profile, question, { full = false } = {}) => {
  if (!profile) return "I couldn't find that profile in your organisation.";

  const text = String(question || "").toLowerCase();
  const name = `${profile.firstName || ""} ${profile.lastName || ""}`.trim() || profile.name || "Employee";
  const fields = [
    { label: "Name", value: name, pattern: /\b(name|who am i)\b/ },
    { label: "Email", value: profile.email, pattern: /\b(email|e-mail)\b/ },
    { label: "Role", value: profile.role || "Employee", pattern: /\b(role|position)\b/ },
    { label: "Department", value: profile.department || "General", pattern: /\b(department|team)\b/ },
    { label: "Designation", value: profile.designation || "Employee", pattern: /\b(designation|job title)\b/ },
    { label: "Phone", value: profile.phone, pattern: /\b(phone|mobile|contact number|number)\b/ },
    { label: "Address", value: profile.address, pattern: /\b(address|location)\b/ },
    { label: "Date of birth", value: profile.dob, pattern: /\b(date of birth|dob|birthday)\b/ },
    { label: "Gender", value: profile.gender, pattern: /\b(gender)\b/ },
    { label: "Bio", value: profile.bio, pattern: /\b(bio|about me)\b/ },
    { label: "Joined", value: dateLabel(profile.createdAt), pattern: /\b(joined|joining date|start date)\b/ },
  ];

  const asksEmergency = has(text, /\bemergency contact\b/);
  const asksSocial = has(text, /\b(social links?|linkedin|github|portfolio)\b/);
  const asksAll = full || has(text, /\b(profile|personal details|personal information|employee details|employee information|employee profile|my details|contact information|contact details|details of|details for|information about|information on|all (my |employee )?details|full details|complete details)\b/);
  let selected = asksAll ? fields : fields.filter((field) => field.pattern.test(text));

  const lines = selected.map(({ label, value }) => `${label}: ${showValue(value)}`);
  if (asksSocial || asksAll) {
    const social = profile.socialLinks || {};
    const socialValues = [
      ["LinkedIn", social.linkedin],
      ["GitHub", social.github],
      ["Portfolio", social.portfolio],
    ].filter(([, value]) => value && String(value).trim());
    if (socialValues.length) {
      lines.push(`Social links: ${socialValues.map(([label, value]) => `${label}: ${value}`).join(", ")}`);
    } else if (asksSocial) {
      lines.push("Social links: not listed");
    }
  }
  if (asksEmergency || asksAll) {
    const emergency = profile.emergencyContact || {};
    const emergencyValues = [
      ["Emergency contact", emergency.name],
      ["Relationship", emergency.relationship],
      ["Emergency phone", emergency.phone],
      ["Emergency email", emergency.email],
    ].filter(([, value]) => value && String(value).trim());
    if (emergencyValues.length) {
      lines.push(`Emergency contact: ${emergencyValues.map(([label, value]) => `${label}: ${value}`).join(", ")}`);
    } else if (asksEmergency) {
      lines.push("Emergency contact: not listed");
    }
  }

  if (!lines.length) return "I couldn't tell which profile detail you want. You can ask for a name, email, phone, department, designation, or full profile details.";
  return lines.join(". ");
};

export const isSelfProfileQuestion = (message) =>
  /\b(my|mine|myself|me|who am i)\b/i.test(String(message || "")) && isProfileDetailsQuestion(message);

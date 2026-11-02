export const TIMEWISE_PRODUCT_KNOWLEDGE = `
TimeWise is a work-time and employee-management website with separate employee and administrator experiences.

EMPLOYEE EXPERIENCE
- Navigation: employees can open Home, Attendance, Reports, Community, Notifications, Profile, and Settings from the employee experience; Calendar and other preferences are grouped under Settings where applicable.
- Home/Dashboard: a summary of the employee's work activity and shortcuts to common areas.
- Attendance: check in, take and finish breaks, check out, and review attendance history and current work status. Attendance and work-time information follows the configured workweek and targets. The current standard configuration is Monday-Friday, an 8-hour daily target and a 40-hour weekly target; check-in status thresholds are configured separately.
- Overtime: reports count time worked beyond the daily working-hours target as overtime. A late check-in by itself does not count as overtime; an employee must work beyond the daily target. Break time is excluded from working time.
- Reports: review personal attendance, daily and weekly working hours, targets, overtime, and productivity information. Available report periods and custom date ranges depend on the report controls.
- Calendar: view personal calendar events and holidays; calendar settings are available under Settings.
- Leave: submit and track leave requests and review leave information.
- Community: browse the community, create or view posts, and visit community profiles.
- Notifications and announcements: view updates and organisation announcements.
- Profile and Settings: manage profile details, attendance preferences where available, leave, calendar, appearance, notifications, security, data export, and help/support.
- Profile information can include name, work email, role, department, designation, phone, address, date of birth, gender, bio, social links, and emergency contact information when those fields are provided on the account.

ADMINISTRATOR EXPERIENCE
- Navigation: the admin dashboard provides areas for Home, Employees, Attendance, Appearance, Leave, Calendar, Thought of the Day, Notifications, Announcements, Reports, and Settings.
- Admin Dashboard: organisation overview and navigation to employee and administrative tools.
- Employees: manage and view employee records and employee details.
- Attendance: review organisation attendance and attendance logs.
- Reports: view organisation attendance and work-time reporting.
- Leave: review leave requests, their status, and leave statistics; administrators can approve or reject requests where the controls are provided.
- Calendar: manage organisation calendar events and holidays.
- Announcements and Notifications: create/manage organisation announcements and review notifications.
- Settings: manage available organisation settings, including employee access to WiseBot.
- Admin WiseBot: ask about employee counts, organisation attendance, employee attendance and work-time metrics, leave requests, calendar events, and upcoming holidays.

WISEBOT
- Employee WiseBot answers questions about the employee's attendance, working hours, overtime, productivity, leave information, calendar events, holidays, and how to use TimeWise pages.
- Admin WiseBot answers organisation-level employee counts and attendance questions, individual employee metrics, leave requests, calendar events, upcoming holidays, and TimeWise feature questions.
- The floating WiseBot launcher can be minimized with its small minus control and restored with the compact maximize control.
- WiseBot answers from the signed-in user's available TimeWise information and does not provide source code or internal implementation details.

PUBLIC INFORMATION
- About and Contact pages provide public-facing information and a website contact form.

Do not claim a feature beyond these documented capabilities. If a question asks about a detail not covered here, say that the available TimeWise information does not specify it and direct the user to the relevant page or administrator. Do not explain implementation, source code, APIs, databases, or internal systems.
`;

const messageTokens = (message) => String(message || "").toLowerCase();

export const isTimeWiseOverviewQuestion = (message) => {
  const text = messageTokens(message);
  const asksOverview = /\b(tell me about|explain|give me an overview|overview of|describe)\b/.test(text);
  const namesWebsite = /\b(website|site|time[ -]?wise|platform|app)\b/.test(text);
  const asksFeatures = /\b(features?|capabilit(?:y|ies))\b/.test(text) &&
    namesWebsite && /\b(tell me about|explain|give me an overview|overview|describe|what are|list)\b/.test(text);
  const asksProductDefinition = /\bwhat is (?:time[ -]?wise|this website|the website|this app|the app)\b/.test(text);
  return (namesWebsite && asksOverview) || asksFeatures || asksProductDefinition;
};

export const isTimeWiseImplementationQuestion = (message) =>
  /\b(source code|show me (?:the )?code|give me (?:the )?code|write (?:the )?code|codebase|programming language|tech(?:nology)? stack|api endpoint|database schema|internal (?:system|implementation|architecture)|backend architecture|frontend architecture|how (?:was|is) (?:the )?(?:website|app|bot) built|what (?:is|was) (?:the )?(?:website|app|bot) built with|implementation details)\b/i.test(String(message || ""));

export const isTimeWiseProductQuestion = (message) => {
  const text = messageTokens(message);
  const productMention = /\b(website|site|time[ -]?wise|wisebot|bot|platform|app|page|pages|feature|features|capabilit(?:y|ies)|dashboard|attendance|check[ -]?in|check[ -]?out|reports?|leave|calendar|holiday|community|announcement|notification|settings|profile|employee management|contact form|about page)\b/.test(text);
  const broadQuestion = /\b(tell me about|explain|describe|overview|what is|what are|what does|what do|what can|what features|what pages|which pages|feature list|capabilities|how does|how do|how can|how to|do you have|can i|where can i|where do i|does time[ -]?wise|does this website|does the website)\b/.test(text);
  const featureQuestion = /\b(how does|how do|how can|where do|where can|where is|how to|can i|do i|explain|describe|tell me about|what does|what can|what is)\b/.test(text) &&
    /\b(attendance|check[ -]?in|check[ -]?out|breaks?|working hours?|overtime|reports?|dashboard|leave|calendar|holidays?|community|announcements?|notifications?|profile|settings|security|data export|help|support|employee management|admin|about page|contact page|contact form|phone|email|address|gender|bio|designation|department)\b/.test(text);

  const explanatoryQuestion = /\b(how does|how do|how can|how to|explain|describe|tell me about)\b/.test(text);
  const metricQuestion = !explanatoryQuestion && /\b(attendance|present|absent|working hours?|overtime|productivity|leave balance|streak)\b/.test(text) &&
    (/\b(today|yesterday|tomorrow|this week|this month|last week|last month|overall|all[ -]?time|how many|percentage|percent|rate)\b/.test(text) ||
      /\b(attendance|working hours?|overtime|productivity|leave balance)\b\s+(of|for)\s+(?:employee|staff|[\w.+-]+@[\w.-]+)/.test(text));

  if (metricQuestion) return false;
  if (/\b(my|mine|myself|my own)\b/.test(text) && /\b(attendance|hours?|overtime|productivity|leave balance|streak)\b/.test(text)) {
    return false;
  }

  return (productMention && broadQuestion) || featureQuestion;
};

export const getTimeWiseOverviewReply = (message, role = "employee") => {
  if (!isTimeWiseProductQuestion(message)) return null;
  if (isTimeWiseOverviewQuestion(message)) {
    return "TimeWise is a work-time and employee-management website. Employees can record attendance and breaks, review work hours and reports, request leave, view calendar events, and manage their profile and settings. Administrators can manage employee records, review organization attendance and reports, handle leave requests, manage calendar events and announcements, and configure organization settings. Both experiences include WiseBot for role-appropriate questions about TimeWise. You can minimize the floating WiseBot icon with its small minus button and restore it with the compact maximize button.";
  }

  const text = String(message || "").toLowerCase();
  if (/\b(wisebot|bot)\b/.test(text)) {
    return role === "admin"
      ? "Admin WiseBot can answer organisation employee-count and attendance questions, provide an employee's attendance and work-time metrics, find leave request information, list calendar events and upcoming holidays, and explain TimeWise features. Its floating launcher can be minimized with the small minus button and restored with the compact maximize button."
      : "WiseBot can answer questions about your attendance, working hours, overtime, productivity, leave information, calendar events, and holidays. It can also explain how to use TimeWise pages and features. Its floating launcher can be minimized with the small minus button and restored with the compact maximize button.";
  }
  if (/\b(attendance|check[ -]?in|check[ -]?out|breaks?)\b/.test(text)) {
    return role === "admin"
      ? "The Attendance area lets administrators review organisation attendance and attendance logs. Employees use Attendance to check in, record breaks, check out, and review their attendance history. Open Attendance from the relevant dashboard navigation."
      : "Open Attendance to check in, record breaks, check out, and review your attendance history and current work status. The available attendance calculations follow your organisation's configured rules.";
  }
  if (/\b(reports?|productivity|working hours?|overtime|targets?)\b/.test(text)) {
    return role === "admin"
      ? "Reports gives administrators organisation-level attendance and work-time information, including attendance trends and department headcount. Use its available report controls to review the period you need."
      : "Reports lets you review your attendance, daily and weekly working hours, targets, overtime, and productivity information. Use the available period controls to review a particular timeframe.";
  }
  if (/\b(leave|holidays?)\b/.test(text)) {
    return role === "admin"
      ? "The admin Leave area lets you review leave requests and their statuses, and approve or reject requests where those controls are available. Calendar is where administrators manage organisation events and holidays."
      : "Use Leave to submit and track leave requests and review your leave information. Use Calendar to view calendar events and holidays.";
  }
  if (/\b(calendar|events?|schedule)\b/.test(text)) {
    return role === "admin"
      ? "The admin Calendar area is for managing organisation calendar events and holidays. You can ask Admin WiseBot about upcoming events and holidays as well."
      : "Calendar lets you view your calendar events and holidays. Calendar preferences are also available from Settings.";
  }
  if (/\b(community|posts?|profiles?)\b/.test(text)) {
    return "The Community area provides a feed where users can browse and share posts and visit community profiles.";
  }
  if (/\b(about page|contact page|contact form)\b/.test(text)) {
    return "The About page provides public-facing information about TimeWise. The Contact page includes a form for sending a message to the organisation.";
  }
  if (/\b(announcements?|notifications?)\b/.test(text)) {
    return role === "admin"
      ? "Administrators can manage company announcements and review notification tools from the admin dashboard. Employees can read organisation updates in their announcements and notifications areas."
      : "Use Notifications to review updates, and check announcements for organisation-wide news.";
  }
  if (/\b(profile|settings|appearance|security|export|support)\b/.test(text)) {
    return "Settings contains profile and personal information, attendance, leave, calendar, appearance, notification, security, data export, and help/support areas. Profile details can include contact and employment information when those fields are filled in. The options shown can depend on your account role.";
  }
  if (/\b(employee management|employees|admin)\b/.test(text) && role === "admin") {
    return "The admin Employees area is used to view and manage employee records and details. The admin dashboard also includes attendance, leave, calendar, reports, announcements, notifications, and settings.";
  }
  return role === "admin" ? `${employeeFeatures} ${adminFeatures}` : employeeFeatures;
};

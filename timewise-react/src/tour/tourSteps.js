/**
 * tourSteps.js — TimeWise Homepage Tour
 *
 * Each `element` matches an id we'll add to the actual DOM nodes.
 * Steps follow the natural top-to-bottom reading order of the page.
 */

const tourSteps = [
  // ── 0. Welcome (no element — centred overlay) ──────────────────────────────
  {
    popover: {
      title: "👋 Welcome to TimeWise!",
      description:
        "This quick tour will walk you through your productivity dashboard. Click <strong>Next</strong> to begin.",
      side: "bottom",
      align: "center",
    },
  },

  // ── 1. Navbar logo ─────────────────────────────────────────────────────────
  {
    element: "#tour-logo",
    popover: {
      title: "🏠 TimeWise Logo",
      description:
        "Click the logo from any page to return to your Home dashboard instantly.",
      side: "bottom",
      align: "start",
    },
  },

  // ── 2. Nav links ───────────────────────────────────────────────────────────
  {
    element: "#tour-nav-links",
    popover: {
      title: "🔗 Navigation",
      description:
        "Jump between <strong>Home</strong>, <strong>Dashboard</strong>, <strong>Community</strong>, and more from here.",
      side: "bottom",
      align: "center",
    },
  },

  // ── 3. Notification bell ───────────────────────────────────────────────────
  {
    element: "#tour-notifications",
    popover: {
      title: "🔔 Notifications",
      description:
        "The badge shows unread alerts — manager approvals, reactions to your thoughts, and review reminders.",
      side: "bottom",
      align: "end",
    },
  },

  // ── 4. Profile button ──────────────────────────────────────────────────────
  {
    element: "#tour-profile",
    popover: {
      title: "👤 Your Profile",
      description: "Access your profile, settings, and logout from this menu.",
      side: "bottom",
      align: "end",
    },
  },

  // ── 5. Hero greeting ───────────────────────────────────────────────────────
  {
    element: "#tour-hero-greeting",
    popover: {
      title: "☀️ Daily Greeting",
      description:
        "A personalised greeting that changes based on the time of day, so you always feel right at home.",
      side: "right",
      align: "start",
    },
  },

  // ── 6. Hero date/time info ─────────────────────────────────────────────────
  {
    element: "#tour-hero-info",
    popover: {
      title: "📅 Live Date & Time",
      description:
        "Always-on live clock and today's date — no need to alt-tab away.",
      side: "top",
      align: "start",
    },
  },

  // ── 7. Streak card ─────────────────────────────────────────────────────────
  {
    element: "#tour-hero-stat",
    popover: {
      title: "🔥 Day Streak",
      description:
        "Your current attendance streak. Keep it going — consistency is what separates top performers!",
      side: "left",
      align: "center",
    },
  },

  // ── 8. Quick progress rows ─────────────────────────────────────────────────
  {
    element: "#tour-hero-progress",
    popover: {
      title: "📊 Quick Stats",
      description:
        "A snapshot of your <strong>Attendance</strong>, <strong>Weekly Hours</strong>, and <strong>Productivity</strong> at a glance.",
      side: "left",
      align: "center",
    },
  },

  // ── 9. Today's Work ───────────────────────────────────────────────────────
  {
    element: "#tour-today-work",
    popover: {
      title: "🕐 Today's Work",
      description:
        "Check in, take breaks, and check out from here. Your session time, break time and working hours update live.",
      side: "bottom",
      align: "start",
    },
  },

  // ── 10. Thought card ───────────────────────────────────────────────────────
  {
    element: "#tour-thought-card",
    popover: {
      title: "💡 Featured Thought",
      description:
        "Share motivational thoughts with your team. Like, comment, or save thoughts that inspire you.",
      side: "bottom",
      align: "center",
    },
  },

  // ── 11. Thought actions ────────────────────────────────────────────────────
  {
    element: "#tour-thought-actions",
    popover: {
      title: "❤️ Engage With Thoughts",
      description:
        "React with a like, drop a comment, or bookmark a thought to revisit later.",
      side: "top",
      align: "start",
    },
  },

  // ── 12. Quick Actions ──────────────────────────────────────────────────────
  {
    element: "#tour-quick-actions",
    popover: {
      title: "⚡ Quick Actions",
      description:
        "One-click shortcuts to <strong>Attendance</strong>, <strong>Community</strong>, <strong>Reports</strong>, and <strong>Settings</strong> — no hunting through menus.",
      side: "top",
      align: "start",
    },
  },

  // ── 13. Stats grid ──────────────────────────────────────────────────────────
  {
    element: "#tour-stats-grid",
    popover: {
      title: "📈 Performance Cards",
      description:
        "Detailed cards for Productivity, Attendance, Weekly Hours, and your Current Streak — each with a progress bar.",
      side: "left",
      align: "center",
    },
  },

  // ── 14. Company Updates ────────────────────────────────────────────────────
  {
    element: "#tour-company-updates",
    popover: {
      title: "📢 Company Updates",
      description:
        "Stay in the loop — birthdays, announcements, hackathon results and upcoming events all in one place.",
      side: "top",
      align: "start",
    },
  },

  // ── 15. Done ───────────────────────────────────────────────────────────────
  {
    popover: {
      title: "You're all set! 🎉",
      description:
        "That covers everything on your homepage. Click <strong>Show Tour</strong> in the navbar anytime to replay this guide.",
      side: "top",
      align: "center",
    },
  },
];

export default tourSteps;

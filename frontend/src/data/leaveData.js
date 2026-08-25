const leaveData = [
  {
    id: 1,

    employee: {
      id: 101,
      firstName: "Rahul",
      lastName: "Sharma",
      email: "rahul.sharma@example.com",
    },

    leaveType: "Annual Leave",
    leaveTypeValue: "annual",

    startDate: "2026-08-25",
    endDate: "2026-08-27",
    requestedDays: 3,

    reason: "Family function at home.",

    status: "Pending",

    appliedDate: "22/08/2026",

    adminComment: "",
  },

  {
    id: 2,

    employee: {
      id: 102,
      firstName: "Priya",
      lastName: "Patel",
      email: "priya.patel@example.com",
    },

    leaveType: "Sick Leave",
    leaveTypeValue: "sick",

    startDate: "2026-08-20",
    endDate: "2026-08-21",
    requestedDays: 2,

    reason: "Not feeling well and need rest.",

    status: "Approved",

    appliedDate: "19/08/2026",

    adminComment: "Leave approved.",
  },

  {
    id: 3,

    employee: {
      id: 103,
      firstName: "Amit",
      lastName: "Verma",
      email: "amit.verma@example.com",
    },

    leaveType: "Casual Leave",
    leaveTypeValue: "casual",

    startDate: "2026-08-28",
    endDate: "2026-08-28",
    requestedDays: 1,

    reason: "Personal work.",

    status: "Pending",

    appliedDate: "23/08/2026",

    adminComment: "",
  },

  {
    id: 4,

    employee: {
      id: 104,
      firstName: "Neha",
      lastName: "Yadav",
      email: "neha.yadav@example.com",
    },

    leaveType: "Annual Leave",
    leaveTypeValue: "annual",

    startDate: "2026-08-11",
    endDate: "2026-08-14",
    requestedDays: 4,

    reason: "Planning a short family trip.",

    status: "Approved",

    appliedDate: "05/08/2026",

    adminComment: "Approved by admin.",
  },

  {
    id: 5,

    employee: {
      id: 105,
      firstName: "Vikash",
      lastName: "Singh",
      email: "vikash.singh@example.com",
    },

    leaveType: "Sick Leave",
    leaveTypeValue: "sick",

    startDate: "2026-08-05",
    endDate: "2026-08-07",
    requestedDays: 3,

    reason: "Medical rest required.",

    status: "Rejected",

    appliedDate: "04/08/2026",

    adminComment: "Leave period conflicts with an important work schedule.",
  },

  {
    id: 6,

    employee: {
      id: 106,
      firstName: "Anjali",
      lastName: "Mehta",
      email: "anjali.mehta@example.com",
    },

    leaveType: "Casual Leave",
    leaveTypeValue: "casual",

    startDate: "2026-08-29",
    endDate: "2026-08-30",
    requestedDays: 2,

    reason: "Personal commitments.",

    status: "Pending",

    appliedDate: "23/08/2026",

    adminComment: "",
  },

  {
    id: 7,

    employee: {
      id: 107,
      firstName: "Rohit",
      lastName: "Joshi",
      email: "rohit.joshi@example.com",
    },

    leaveType: "Annual Leave",
    leaveTypeValue: "annual",

    startDate: "2026-07-15",
    endDate: "2026-07-18",
    requestedDays: 4,

    reason: "Family vacation.",

    status: "Rejected",

    appliedDate: "10/07/2026",

    adminComment: "Insufficient leave balance.",
  },

  {
    id: 8,

    employee: {
      id: 108,
      firstName: "Sneha",
      lastName: "Gupta",
      email: "sneha.gupta@example.com",
    },

    leaveType: "Sick Leave",
    leaveTypeValue: "sick",

    startDate: "2026-08-18",
    endDate: "2026-08-18",
    requestedDays: 1,

    reason: "Health-related rest.",

    status: "Approved",

    appliedDate: "17/08/2026",

    adminComment: "Approved.",
  },
];

export default leaveData;
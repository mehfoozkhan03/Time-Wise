import { EVENT_TYPES } from "./eventTypes";

export const events = [
  {
    id: 1,
    title: "John Checked In",
    employee: "John Doe",
    department: "HR",
    date: "2026-07-20",
    startTime: "09:00",
    endTime: "18:00",
    type: EVENT_TYPES.PRESENT,
    description: "Checked in on time."
  },

  {
    id: 2,
    title: "Sarah Leave",
    employee: "Sarah",
    department: "Finance",
    date: "2026-07-21",
    startTime: "09:00",
    endTime: "18:00",
    type: EVENT_TYPES.LEAVE,
    description: "Casual Leave"
  },

  {
    id: 3,
    title: "Alex Birthday",
    employee: "Alex",
    department: "Marketing",
    date: "2026-07-24",
    type: EVENT_TYPES.BIRTHDAY,
    description: "Birthday Celebration 🎂"
  },

  {
    id: 4,
    title: "Team Meeting",
    employee: "Development Team",
    department: "Development",
    date: "2026-07-26",
    startTime: "11:00",
    endTime: "12:30",
    type: EVENT_TYPES.WORK_EVENT,
    description: "Sprint Planning Meeting"
  },

  {
    id: 5,
    title: "Annual Celebration",
    employee: "All Employees",
    date: "2026-07-28",
    type: EVENT_TYPES.SPECIAL_EVENT,
    description: "Annual Company Celebration"
  }
];
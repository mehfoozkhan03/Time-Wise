import { EVENT_TYPES } from "./eventTypes";

export const events = [

    {
        id: 1,

        title: "John Checked In",

        employee: "John Doe",

        department: "Engineering",

        date: "2026-07-20",

        startTime: "09:00",

        endTime: "18:00",

        description: "Regular office attendance.",

        type: EVENT_TYPES.PRESENT,
    },

    {
        id: 2,

        title: "Sarah Leave",

        employee: "Sarah Mitchell",

        department: "HR",

        date: "2026-07-21",

        description: "Approved casual leave.",

        type: EVENT_TYPES.LEAVE,
    },

    {
        id: 3,

        title: "Alex Birthday",

        employee: "Alex Kumar",

        department: "Design",

        date: "2026-07-24",

        description: "Birthday Celebration 🎉",

        type: EVENT_TYPES.BIRTHDAY,
    },

    {
        id: 4,

        title: "Sprint Planning",

        employee: "Development Team",

        department: "Engineering",

        date: "2026-07-26",

        startTime: "11:00",

        endTime: "12:30",

        description: "Weekly Sprint Planning Meeting.",

        type: EVENT_TYPES.WORK_EVENT,
    },

    {
        id: 5,

        title: "Annual Celebration",

        date: "2026-07-28",

        description: "Company Annual Celebration.",

        type: EVENT_TYPES.SPECIAL_EVENT,
    },

];
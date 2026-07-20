import {

    FaUserCheck,

    FaPlaneDeparture,

    FaBriefcase,

    FaStar,

    FaBirthdayCake,

    FaUmbrellaBeach,

    FaCalendarAlt,

    FaFlag,

} from "react-icons/fa";

import { EVENT_TYPES } from "./eventTypes";

export const EVENT_CONFIG = {

    [EVENT_TYPES.PRESENT]: {

        label: "Present",

        color: "#22c55e",

        icon: FaUserCheck,

    },

    [EVENT_TYPES.LEAVE]: {

        label: "Leave",

        color: "#ef4444",

        icon: FaPlaneDeparture,

    },

    [EVENT_TYPES.WORK_EVENT]: {

        label: "Work Event",

        color: "#3b82f6",

        icon: FaBriefcase,

    },

    [EVENT_TYPES.SPECIAL_EVENT]: {

        label: "Special Event",

        color: "#f97316",

        icon: FaStar ,

    },

    [EVENT_TYPES.BIRTHDAY]: {

        label: "Birthday",

        color: "#a855f7",

        icon: FaBirthdayCake,

    },

    [EVENT_TYPES.HOLIDAY]: {

        label: "Holiday",

        color: "#06b6d4",

        icon: FaUmbrellaBeach,

    },

    [EVENT_TYPES.WEEKEND]: {

        label: "Weekend",

        color: "#64748b",

        icon: FaCalendarAlt,

    },

    [EVENT_TYPES.FESTIVAL]: {

        label: "Festival",

        color: "#ec4899",

        icon: FaStar,

    },

    [EVENT_TYPES.GOVERNMENT_HOLIDAY]: {

        label: "Government Holiday",

        color: "#eab308",

        icon: FaFlag,

    },

};
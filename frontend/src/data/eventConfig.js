import {
  FaUserCheck,
  FaPlaneDeparture,
  FaBriefcase,
  FaStar,
  FaBirthdayCake,
  FaUmbrellaBeach,
  FaCalendarAlt,
  FaFlag,
  FaUsers,
  FaClipboardCheck,
  FaHourglassEnd,
  FaChalkboardTeacher,
  FaHandshake,
} from "react-icons/fa";

import { EVENT_TYPES } from "./eventTypes";

export const EVENT_CONFIG = Object.freeze({
  [EVENT_TYPES.PRESENT]: {
    label: "Present",
    color: "#22c55e",
    icon: FaUserCheck,
    isHoliday: false,
  },

  [EVENT_TYPES.LEAVE]: {
    label: "Leave",
    color: "#ef4444",
    icon: FaPlaneDeparture,
    isHoliday: false,
  },

  [EVENT_TYPES.WORK_EVENT]: {
    label: "Work Event",
    color: "#3b82f6",
    icon: FaBriefcase,
    isHoliday: false,
  },

  [EVENT_TYPES.SPECIAL_EVENT]: {
    label: "Special Event",
    color: "#f97316",
    icon: FaStar,
    isHoliday: false,
  },

  [EVENT_TYPES.BIRTHDAY]: {
    label: "Birthday",
    color: "#a855f7",
    icon: FaBirthdayCake,
    isHoliday: false,
  },

  [EVENT_TYPES.HOLIDAY]: {
    label: "Holiday",
    color: "#06b6d4",
    icon: FaUmbrellaBeach,
    isHoliday: true,
  },

  [EVENT_TYPES.WEEKEND]: {
    label: "Weekend",
    color: "#64748b",
    icon: FaCalendarAlt,
    isHoliday: true,
  },

  [EVENT_TYPES.FESTIVAL]: {
    label: "Festival",
    color: "#ec4899",
    icon: FaStar,
    isHoliday: true,
  },

  [EVENT_TYPES.GOVERNMENT_HOLIDAY]: {
    label: "Government Holiday",
    color: "#eab308",
    icon: FaFlag,
    isHoliday: true,
  },

  [EVENT_TYPES.MEETING]: {
    label: "Meeting",
    color: "#0ea5e9",
    icon: FaUsers,
    isHoliday: false,
  },

  [EVENT_TYPES.REVIEW]: {
    label: "Review",
    color: "#8b5cf6",
    icon: FaClipboardCheck,
    isHoliday: false,
  },

  [EVENT_TYPES.DEADLINE]: {
    label: "Deadline",
    color: "#dc2626",
    icon: FaHourglassEnd,
    isHoliday: false,
  },

  [EVENT_TYPES.TRAINING]: {
    label: "Training",
    color: "#14b8a6",
    icon: FaChalkboardTeacher,
    isHoliday: false,
  },

  [EVENT_TYPES.CLIENT_MEETING]: {
    label: "Client Meeting",
    color: "#f59e0b",
    icon: FaHandshake,
    isHoliday: false,
  },
});
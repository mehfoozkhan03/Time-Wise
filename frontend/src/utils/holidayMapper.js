import { EVENT_TYPES } from "../data/eventTypes";

/* =========================================
   Holiday -> Calendar Event Mapper
========================================= */

export const mapHolidayToEvent = (holiday) => ({
  _id: `holiday-${holiday.id}`,

  id: holiday.id,

  title: holiday.title ?? "Holiday",

  description: holiday.description ?? "",

  type: holiday.type?.toUpperCase() || EVENT_TYPES.HOLIDAY,

  date: holiday.date,

  startTime: "",

  endTime: "",

  isAllDay: true,

  employeeId: null,

  employeeName: "",

  department: "",

  designation: "",

  location: "",

  priority: "MEDIUM",

  color: "",

  visibility: "PUBLIC",

  isHoliday: true,
});

/* =========================================
   Map Holiday List
========================================= */

export const mapHolidayList = (holidays = []) => {
  if (!Array.isArray(holidays)) {
    console.warn("Holiday Mapper: Expected an array.", holidays);
    return [];
  }

  return holidays.map(mapHolidayToEvent);
};
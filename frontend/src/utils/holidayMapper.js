import { EVENT_TYPES } from "../data/eventTypes";

/* =========================================
   Holiday -> Calendar Event Mapper
========================================= */

export const mapHolidayToEvent = (holiday) => ({
  _id: `holiday-${holiday.id}`,

  id: holiday.id,

  title: holiday.title,

  description: holiday.description ?? "",

  type: holiday.type || EVENT_TYPES.HOLIDAY,

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

  isHoliday: true,
});

/* =========================================
   Map Holiday List
========================================= */

export const mapHolidayList = (holidays = []) => {
  if (!Array.isArray(holidays)) {
    return [];
  }

  return holidays.map(mapHolidayToEvent);
};

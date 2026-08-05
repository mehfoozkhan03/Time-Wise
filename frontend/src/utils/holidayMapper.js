import { EVENT_TYPES } from "../data/eventTypes";

/* =========================================
   Holiday -> Calendar Event Mapper
========================================= */

const VALID_HOLIDAY_TYPES = new Set(Object.values(EVENT_TYPES));

/* =========================================
   Map Single Holiday
========================================= */

export const mapHolidayToEvent = (holiday = {}) => {
  const holidayType = String(holiday.type ?? EVENT_TYPES.HOLIDAY).toUpperCase();

  return {
    /* =========================================
       IDs
    ========================================= */

    _id: `holiday-${holiday._id}`,

    id: holiday._id,

    holidayId: holiday._id,

    /* =========================================
       Event Information
    ========================================= */

    title: holiday.title ?? "Holiday",

    description: holiday.description ?? "",

    type: VALID_HOLIDAY_TYPES.has(holidayType)
      ? holidayType
      : EVENT_TYPES.HOLIDAY,

    date: holiday.date ?? null,

    startTime: "",

    endTime: "",

    isAllDay: true,

    /* =========================================
       Employee Fields
    ========================================= */

    employeeId: null,

    employeeName: "",

    department: "",

    designation: "",

    location: "",

    /* =========================================
       Display
    ========================================= */

    priority: "MEDIUM",

    color: null,

    visibility: "PUBLIC",

    isHoliday: true,

    /* =========================================
       Backend Metadata
    ========================================= */

    createdAt: holiday.createdAt ?? null,

    updatedAt: holiday.updatedAt ?? null,

    createdBy: holiday.createdBy ?? null,

    updatedBy: holiday.updatedBy ?? null,

    isActive: holiday.isActive !== false,
  };
};

/* =========================================
   Map Holiday List
========================================= */

export const mapHolidayList = (holidays = []) => {
  if (!Array.isArray(holidays)) {
    console.warn("Holiday Mapper: Expected an array.", holidays);

    return [];
  }

  return holidays.filter(Boolean).map(mapHolidayToEvent);
};

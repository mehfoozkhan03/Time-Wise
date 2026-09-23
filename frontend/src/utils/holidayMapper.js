import { EVENT_TYPES } from "../data/eventTypes";

const VALID_HOLIDAY_TYPES = new Set(Object.values(EVENT_TYPES));

export const mapHolidayToEvent = (holiday = {}) => {
  const holidayType = String(holiday.type ?? EVENT_TYPES.HOLIDAY).toUpperCase();

  return {
    _id: holiday._id,

    id: holiday._id,

    holidayId: holiday._id,

    title: holiday.title ?? "Holiday",

    description: holiday.description ?? "",

    type: VALID_HOLIDAY_TYPES.has(holidayType)
      ? holidayType
      : EVENT_TYPES.HOLIDAY,

    date: holiday.date ?? null,

    startTime: "",

    endTime: "",

    isAllDay: true,

    employeeId: null,

    employeeName: "",

    department: "",

    designation: "",

    location: "",

    priority: "MEDIUM",

    color: null,

    visibility: "PUBLIC",

    isHoliday: true,

    createdAt: holiday.createdAt ?? null,

    updatedAt: holiday.updatedAt ?? null,

    createdBy: holiday.createdBy ?? null,

    updatedBy: holiday.updatedBy ?? null,

    isActive: holiday.isActive !== false,
  };
};

export const mapHolidayList = (holidays = []) => {
  if (!Array.isArray(holidays)) {
    console.warn("Holiday Mapper: Expected an array.", holidays);

    return [];
  }

  return holidays.filter(Boolean).map(mapHolidayToEvent);
};
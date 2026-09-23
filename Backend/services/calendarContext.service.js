import { calendarModel } from "../models/Calendar.model.js";
import { holidayModel } from "../models/Holidays.model.js";

export const getCalendarContext = async (user) => {
  try {
    if (!user?.userID) {
      return {
        events: [],
        holidays: [],
      };
    }

    const userId = user.userID;

    // ---------------------------------------------
    // Personal + public calendar events
    // ---------------------------------------------

    const events = await calendarModel
      .find({
        isActive: true,
        $or: [
          {
            visibility: "PUBLIC",
          },
          {
            employeeId: userId,
          },
        ],
      })
      .sort({ date: 1 })
      .lean();

    // ---------------------------------------------
    // Holidays / festivals
    // ---------------------------------------------

    const holidays = await holidayModel
      .find({
        isActive: true,
      })
      .sort({ date: 1 })
      .lean();

    return {
      events: events.map((event) => ({
        title: event.title,
        description: event.description,
        type: event.type,
        date: event.date,
        startTime: event.startTime,
        endTime: event.endTime,
        isAllDay: event.isAllDay,
        location: event.location,
        visibility: event.visibility,
      })),

      holidays: holidays.map((holiday) => ({
        title: holiday.title,
        description: holiday.description,
        type: holiday.type,
        date: holiday.date,
      })),
    };
  } catch (error) {
    console.error("Calendar Context Error:", error);

    return {
      events: [],
      holidays: [],
    };
  }
};

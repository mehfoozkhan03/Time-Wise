import { getToday } from "./dateUtils";

/* =========================================
   Get Upcoming Events
========================================= */

export const getUpcomingEvents = (events = [], limit = 5) => {
  const today = getToday();

  return events
    .filter((event) => {
      if (!event?.date) return false;

      return new Date(event.date) >= today;
    })
    .sort((a, b) => {
      const dateDiff = new Date(a.date) - new Date(b.date);

      if (dateDiff !== 0) {
        return dateDiff;
      }

      if (!a.startTime) return 1;
      if (!b.startTime) return -1;

      return a.startTime.localeCompare(b.startTime);
    })
    .slice(0, limit);
};

/* =========================================
   Get Today's Summary
========================================= */

export const getTodaySummary = (events = [], eventConfig) => {
  const today = getToday().toISOString().split("T")[0];

  const todayEvents = events.filter((event) => {
    if (!event?.date) return false;

    return new Date(event.date).toISOString().split("T")[0] === today;
  });

  return Object.entries(eventConfig)
    .map(([type, config]) => ({
      type,
      config,
      count: todayEvents.filter((event) => event.type === type).length,
    }))
    .filter((item) => item.count > 0);
};

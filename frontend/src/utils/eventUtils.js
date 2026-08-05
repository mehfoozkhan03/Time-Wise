import { getToday, isToday } from "./dateUtils";

/* =========================================
   Get Upcoming Events
========================================= */

export const getUpcomingEvents = (events = [], limit = 5) => {
  const today = getToday();

  return events
    .filter((event) => {
      if (!event?.date) {
        return false;
      }

      const eventDate = new Date(event.date);

      if (Number.isNaN(eventDate.getTime())) {
        return false;
      }

      return eventDate >= today;
    })
    .sort((a, b) => {
      const dateDiff = new Date(a.date) - new Date(b.date);

      if (dateDiff !== 0) {
        return dateDiff;
      }

      if (!a.startTime && !b.startTime) {
        return 0;
      }

      if (!a.startTime) {
        return 1;
      }

      if (!b.startTime) {
        return -1;
      }

      return a.startTime.localeCompare(b.startTime);
    })
    .slice(0, limit);
};

/* =========================================
   Get Today's Summary
========================================= */

export const getTodaySummary = (events = [], eventConfig = {}) => {
  /* =========================================
     Count Today's Events
  ========================================= */

  const counts = events.reduce((acc, event) => {
    if (!event?.date || !event?.type) {
      return acc;
    }

    if (!isToday(event.date)) {
      return acc;
    }

    const type = String(event.type).toUpperCase();

    acc[type] = (acc[type] || 0) + 1;

    return acc;
  }, {});

  /* =========================================
     Build Summary
  ========================================= */

  return Object.entries(eventConfig)
    .map(([type, config]) => ({
      type,
      config,
      count: counts[type] || 0,
    }))
    .filter((item) => item.count > 0);
};

import { useMemo, useState, useCallback } from "react";

import { EVENT_CONFIG } from "../data/eventConfig";

/* =========================================
   Default Filters
========================================= */

const DEFAULT_FILTERS = Object.fromEntries(
  Object.keys(EVENT_CONFIG).map((key) => [key, true]),
);

const EMPTY_FILTERS = Object.fromEntries(
  Object.keys(EVENT_CONFIG).map((key) => [key, false]),
);

export default function useEventFilter(events = [], currentDate) {
  /* =========================================
     State
  ========================================= */

  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  const [searchTerm, setSearchTerm] = useState("");

  /* =========================================
     Toggle Filter
  ========================================= */

  const toggleFilter = useCallback((type) => {
    setFilters((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  }, []);

  /* =========================================
     Select All
  ========================================= */

  const selectAll = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  /* =========================================
     Clear All
  ========================================= */

  const clearAll = useCallback(() => {
    setFilters(EMPTY_FILTERS);
  }, []);

  /* =========================================
     Current Month Events
  ========================================= */

  const monthEvents = useMemo(() => {
    if (!currentDate) return events;

    const currentMonth = currentDate.getMonth();

    const currentYear = currentDate.getFullYear();

    return events.filter((event) => {
      if (!event?.date) return false;

      const date = new Date(event.date);

      if (Number.isNaN(date.getTime())) {
        return false;
      }

      return (
        date.getFullYear() === currentYear && date.getMonth() === currentMonth
      );
    });
  }, [events, currentDate]);

  /* =========================================
     Filtered Events
  ========================================= */

  const filteredEvents = useMemo(() => {
    const keywords = searchTerm
      .trim()
      .toLowerCase()
      .split(/\s+/)
      .filter(Boolean);

    return monthEvents.filter((event) => {
      const eventType = String(event?.type ?? "").toUpperCase();

      if (!eventType) {
        return false;
      }

      if (!filters[eventType]) {
        return false;
      }

      if (keywords.length === 0) {
        return true;
      }

      const searchableText = [
        event.title,
        event.displayName,
        event.description,
        event.employeeName,
        event.department,
        event.designation,
        event.location,
        EVENT_CONFIG[eventType]?.label,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return keywords.every((keyword) => searchableText.includes(keyword));
    });
  }, [monthEvents, filters, searchTerm]);

  return {
    filters,
    searchTerm,
    setSearchTerm,
    toggleFilter,
    selectAll,
    clearAll,
    filteredEvents,
  };
}

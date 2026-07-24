import { useMemo, useState, useCallback } from "react";

import { EVENT_CONFIG } from "../data/eventConfig";

const DEFAULT_FILTERS = Object.keys(EVENT_CONFIG).reduce((acc, key) => {
  acc[key] = true;
  return acc;
}, {});

const EMPTY_FILTERS = Object.keys(EVENT_CONFIG).reduce((acc, key) => {
  acc[key] = false;
  return acc;
}, {});

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

        return (
          date.getFullYear() === currentYear &&
          date.getMonth() === currentMonth
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
      if (!event?.type) {
        return false;
      }

      if (!filters[event.type]) {
        return false;
      }

      if (keywords.length === 0) {
        return true;
      }

      const searchableText = [
        event.title,
        event.description,
        event.employee,
        event.employeeName,
        event.department,
        EVENT_CONFIG[event.type]?.label,
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

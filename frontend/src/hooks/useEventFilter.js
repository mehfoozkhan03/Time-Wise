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

export default function useEventFilter(events = []) {
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
     Filtered Events
  ========================================= */

  const filteredEvents = useMemo(() => {
    const keywords = searchTerm
      .trim()
      .toLowerCase()
      .split(/\s+/)
      .filter(Boolean);

    return events.filter((event) => {
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

      return keywords.every((keyword) =>
        searchableText.includes(keyword)
      );
    });
  }, [events, filters, searchTerm]);

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
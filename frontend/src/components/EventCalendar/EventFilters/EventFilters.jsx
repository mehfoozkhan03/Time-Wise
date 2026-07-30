import "./EventFilters.css";

import { memo, useMemo, useCallback } from "react";

import { FaSearch } from "react-icons/fa";

import { EVENT_CONFIG } from "../../../data/eventConfig";

function EventFilters({
  filters = {},
  toggleFilter,
  searchTerm,
  setSearchTerm,
  selectAll,
  clearAll,
  events = [],
}) {
  /* =========================================
     Event Counts
  ========================================= */

  const eventCounts = useMemo(() => {
    return events.reduce((counts, event) => {
      if (!event?.type) return counts;

      const type = String(event.type).toUpperCase();

      counts[type] = (counts[type] || 0) + 1;

      return counts;
    }, {});
  }, [events]);

  /* =========================================
     Event Types
  ========================================= */

  const eventTypes = useMemo(() => Object.entries(EVENT_CONFIG), []);

  /* =========================================
     Search
  ========================================= */

  const handleSearchChange = useCallback(
    (e) => {
      setSearchTerm?.(e.target.value);
    },
    [setSearchTerm]
  );

  /* =========================================
     Filter Toggle
  ========================================= */

  const handleToggleFilter = useCallback(
    (type) => {
      toggleFilter?.(type);
    },
    [toggleFilter]
  );

  /* =========================================
     Actions
  ========================================= */

  const handleSelectAll = useCallback(() => {
    selectAll?.();
  }, [selectAll]);

  const handleClearAll = useCallback(() => {
    clearAll?.();
  }, [clearAll]);

  return (
    <section className="eventFilters">
      {/* ================= Search ================= */}

      <div className="searchBar">
        <FaSearch />

        <input
          type="text"
          placeholder="Search by title, employee or event type..."
          aria-label="Search calendar events"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      {/* ================= Actions ================= */}

      <div className="filterActions">
        <button type="button" onClick={handleSelectAll}>
          Select All
        </button>

        <button type="button" onClick={handleClearAll}>
          Clear All
        </button>
      </div>

      {/* ================= Filter Chips ================= */}

      <div className="filterList">
        {eventTypes.map(([type, config]) => (
          <button
            key={type}
            type="button"
            className={`filterChip ${
              Boolean(filters[type]) ? "active" : ""
            }`}
            aria-pressed={Boolean(filters[type])}
            aria-label={`Toggle ${config.label} events`}
            title={config.label}
            onClick={() => handleToggleFilter(type)}
          >
            <span className="chipIcon">
              <config.icon />
            </span>

            <span>{config.label}</span>

            <span className="count">
              {eventCounts[type] ?? 0}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}

EventFilters.displayName = "EventFilters";

export default memo(EventFilters);
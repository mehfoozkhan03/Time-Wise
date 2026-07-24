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
    const counts = {};

    events.forEach((event) => {
      if (!event?.type) return;

      const type = String(event.type).toUpperCase();

      counts[type] = (counts[type] || 0) + 1;
    });

    return counts;
  }, [events]);

  /* =========================================
     Event Types
  ========================================= */

  const eventTypes = useMemo(() => {
    return Object.entries(EVENT_CONFIG);
  }, []);

  /* =========================================
     Search
  ========================================= */

  const handleSearchChange = useCallback(
    (e) => {
      setSearchTerm(e.target.value);
    },
    [setSearchTerm],
  );

  /* =========================================
     Filter Toggle
  ========================================= */

  const handleToggleFilter = useCallback(
    (type) => {
      toggleFilter(type);
    },
    [toggleFilter],
  );

  return (
    <section className="eventFilters">
      {/* =========================================
          Search
      ========================================= */}

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

      {/* =========================================
          Actions
      ========================================= */}

      <div className="filterActions">
        <button type="button" onClick={selectAll}>
          Select All
        </button>

        <button type="button" onClick={clearAll}>
          Clear All
        </button>
      </div>

      {/* =========================================
          Filter Chips
      ========================================= */}

      <div className="filterList">
        {eventTypes.map(([type, config]) => {
          const count = eventCounts[type] ?? 0;

          return (
            <button
              key={type}
              type="button"
              className={`filterChip ${filters[type] ? "active" : ""}`}
              aria-pressed={Boolean(filters[type])}
              aria-label={`Toggle ${config.label} events`}
              title={config.label}
              onClick={() => handleToggleFilter(type)}
            >
              <span className="chipIcon">
                <config.icon />
              </span>

              <span>{config.label}</span>

              <span className="count">{count}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

export default memo(EventFilters);

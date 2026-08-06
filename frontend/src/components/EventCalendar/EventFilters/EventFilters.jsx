import "./EventFilters.css";

import { memo, useMemo, useCallback } from "react";

import { FaSearch, FaTimes } from "react-icons/fa";

import { EVENT_CONFIG } from "../../../data/eventConfig";

const eventTypes = Object.entries(EVENT_CONFIG);

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
      if (!event?.type) {
        return counts;
      }

      const type = String(event.type).toUpperCase();

      counts[type] = (counts[type] || 0) + 1;

      return counts;
    }, {});
  }, [events]);

  /* =========================================
     Search
  ========================================= */

  const handleSearchChange = useCallback(
    (e) => {
      setSearchTerm?.(e.target.value.trimStart());
    },
    [setSearchTerm],
  );

  const handleClearSearch = useCallback(() => {
    setSearchTerm?.("");
  }, [setSearchTerm]);

  /* =========================================
     Filter Toggle
  ========================================= */

  const handleToggleFilter = useCallback(
    (type) => {
      toggleFilter?.(type);
    },
    [toggleFilter],
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

      <label htmlFor="calendar-search" className="sr-only">
        Search calendar events
      </label>

      <div className="searchBar" role="search">
        <FaSearch aria-hidden="true" />

        <input
          id="calendar-search"
          type="search"
          placeholder="Search by title, employee or event type..."
          aria-label="Search calendar events"
          aria-controls="calendar-grid"
          autoComplete="off"
          spellCheck={false}
          value={searchTerm}
          onChange={handleSearchChange}
        />

        {searchTerm && (
          <button
            type="button"
            className="clearSearchBtn"
            aria-label="Clear search"
            title="Clear Search"
            onClick={handleClearSearch}
          >
            <FaTimes />
          </button>
        )}
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

      <div className="filterList" role="group" aria-label="Event Filters">
        {eventTypes.map(([type, config]) => {
          const active = Boolean(filters[type]);

          const className = ["filterChip", active && "active"]
            .filter(Boolean)
            .join(" ");

          const Icon = config.icon;

          return (
            <button
              key={type}
              type="button"
              className={className}
              aria-pressed={active}
              aria-label={`Toggle ${config.label} events`}
              title={config.label}
              onClick={() => handleToggleFilter(type)}
            >
              <span className="chipIcon">
                <Icon />
              </span>

              <span>{config.label}</span>

              <span className="count">{eventCounts[type] ?? 0}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

EventFilters.displayName = "EventFilters";

export default memo(EventFilters);

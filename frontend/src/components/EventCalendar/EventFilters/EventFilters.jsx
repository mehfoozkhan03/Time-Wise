import "./EventFilters.css";

import { memo, useMemo, useCallback, useState } from "react";

import { FaSearch, FaTimes } from "react-icons/fa";

import { EVENT_CONFIG } from "../../../data/eventConfig";

const eventTypes = Object.entries(EVENT_CONFIG);

const INITIAL_VISIBLE_FILTERS = 6;

function EventFilters({
  filters = {},
  toggleFilter,
  searchTerm,
  setSearchTerm,
  selectAll,
  clearAll,
  events = [],
}) {
  const [showAllFilters, setShowAllFilters] = useState(false);

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

  const visibleFilters = useMemo(() => {
    return showAllFilters
      ? eventTypes
      : eventTypes.slice(0, INITIAL_VISIBLE_FILTERS);
  }, [showAllFilters]);

  const remainingFilters = useMemo(() => {
    return Math.max(eventTypes.length - INITIAL_VISIBLE_FILTERS, 0);
  }, []);

  const handleSearchChange = useCallback(
    (event) => {
      setSearchTerm?.(event.target.value.trimStart());
    },
    [setSearchTerm],
  );

  const handleClearSearch = useCallback(() => {
    setSearchTerm?.("");
  }, [setSearchTerm]);

  const handleToggleFilter = useCallback(
    (type) => {
      if (!eventCounts[type]) {
        return;
      }

      toggleFilter?.(type);
    },
    [eventCounts, toggleFilter],
  );

  const handleSelectAll = useCallback(() => {
    selectAll?.();
  }, [selectAll]);

  const handleClearAll = useCallback(() => {
    clearAll?.();
  }, [clearAll]);

  const handleToggleShowAll = useCallback(() => {
    setShowAllFilters((previous) => !previous);
  }, []);

  return (
    <section className="eventFilters">
      <label htmlFor="calendar-search" className="sr-only">
        Search calendar events
      </label>

      <div className="searchBar" role="search">
        <FaSearch aria-hidden="true" />

        <input
          id="calendar-search"
          type="text"
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
            onClick={handleClearSearch}
            aria-label="Clear Search"
            title="Clear Search"
          >
            <FaTimes />
          </button>
        )}
      </div>

      <div className="filterActions">
        <button type="button" onClick={handleSelectAll}>
          Select All
        </button>

        <button type="button" onClick={handleClearAll}>
          Clear All
        </button>
      </div>

      <div className="filterList" role="group" aria-label="Event Filters">
        {visibleFilters.map(([type, config]) => {
          const count = eventCounts[type] ?? 0;
          const hasEvents = count > 0;
          const active = hasEvents && Boolean(filters[type]);

          const className = [
            "filterChip",
            active && "active",
            !hasEvents && "disabled",
          ]
            .filter(Boolean)
            .join(" ");

          const Icon = config.icon;

          return (
            <button
              key={type}
              type="button"
              className={className}
              aria-pressed={active}
              aria-disabled={!hasEvents}
              aria-label={
                hasEvents
                  ? `Toggle ${config.label}`
                  : `${config.label}, no events`
              }
              title={
                hasEvents
                  ? config.label
                  : `No ${config.label.toLowerCase()} events`
              }
              disabled={!hasEvents}
              onClick={() => handleToggleFilter(type)}
            >
              <span className="chipIcon">
                <Icon />
              </span>

              <span>{config.label}</span>

              <span className="count">{count}</span>
            </button>
          );
        })}

        {remainingFilters > 0 && (
          <button
            type="button"
            className="showMoreBtn"
            onClick={handleToggleShowAll}
            aria-expanded={showAllFilters}
          >
            {showAllFilters ? "Show Less" : `+${remainingFilters} More`}
          </button>
        )}
      </div>
    </section>
  );
}

EventFilters.displayName = "EventFilters";

export default memo(EventFilters);

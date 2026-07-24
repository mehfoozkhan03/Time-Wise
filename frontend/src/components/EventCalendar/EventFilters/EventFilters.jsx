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

      counts[event.type] = (counts[event.type] || 0) + 1;
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
       Toggle Filter
    ========================================= */

  const handleToggleFilter = useCallback(
    (type) => {
      toggleFilter(type);
    },
    [toggleFilter],
  );

  return (
    <div className="eventFilters">
      {/* Search */}

      <div className="searchBar">
        <FaSearch />

        <input
          type="text"
          placeholder="Search employee or event..."
          aria-label="Search events"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      {/* Actions */}

      <div className="filterActions">
        <button type="button" onClick={selectAll}>
          Select All
        </button>

        <button type="button" onClick={clearAll}>
          Clear All
        </button>
      </div>

      {/* Filters */}

      <div className="filterList">
        {eventTypes.map(([type, config]) => (
          <button
            key={type}
            type="button"
            onClick={() => handleToggleFilter(type)}
            className={`filterChip ${filters[type] ? "active" : ""}`}
            aria-pressed={!!filters[type]}
          >
            <span className="chipIcon">{config.icon}</span>

            <span>{config.label}</span>

            <span className="count">{eventCounts[type] ?? 0}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default memo(EventFilters);

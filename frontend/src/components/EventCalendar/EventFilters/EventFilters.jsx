import "./EventFilters.css";

import { memo, useMemo, useCallback } from "react";
import { FaSearch } from "react-icons/fa";

import { EVENT_CONFIG } from "../../../data/eventConfig";

function EventFilters({
    filters,
    toggleFilter,
    searchTerm,
    setSearchTerm,
    selectAll,
    clearAll,
    events,
}) {
    // Generate event counts in a single pass
    const eventCounts = useMemo(() => {
        const counts = {};

        for (const event of events) {
            counts[event.type] = (counts[event.type] || 0) + 1;
        }

        return counts;
    }, [events]);

    // Memoize event config entries
    const eventTypes = useMemo(
        () => Object.entries(EVENT_CONFIG),
        []
    );

    const handleSearchChange = useCallback(
        (e) => {
            setSearchTerm(e.target.value);
        },
        [setSearchTerm]
    );

    return (
        <div className="eventFilters">
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

            <div className="filterActions">
                <button
                    type="button"
                    onClick={selectAll}
                >
                    Select All
                </button>

                <button
                    type="button"
                    onClick={clearAll}
                >
                    Clear All
                </button>
            </div>

            <div className="filterList">
                {eventTypes.map(([type, config]) => (
                    <button
                        key={type}
                        type="button"
                        onClick={() => toggleFilter(type)}
                        className={`filterChip ${
                            filters[type] ? "active" : ""
                        }`}
                        aria-pressed={filters[type]}
                    >
                        <span className="chipIcon">
                            {config.icon}
                        </span>

                        <span>
                            {config.label}
                        </span>

                        <span className="count">
                            {eventCounts[type] ?? 0}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
}

export default memo(EventFilters);
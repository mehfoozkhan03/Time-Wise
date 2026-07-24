import "./CalendarSkeleton.css";

import { memo } from "react";

function CalendarSkeleton() {
  /* =========================================
     Skeleton Placeholders
  ========================================= */

  const filterPlaceholders = [...Array(8)];

  const dayPlaceholders = [...Array(35)];

  return (
    <div
      className="calendarSkeleton"
      role="status"
      aria-live="polite"
      aria-label="Loading calendar"
    >
      {/* =========================================
          Header
      ========================================= */}

      <div className="skeletonHeader" aria-hidden="true" />

      {/* =========================================
          Search
      ========================================= */}

      <div className="skeletonSearch" aria-hidden="true" />

      {/* =========================================
          Filters
      ========================================= */}

      <div className="skeletonFilters">
        {filterPlaceholders.map((_, index) => (
          <div key={index} className="skeletonFilter" aria-hidden="true" />
        ))}
      </div>

      {/* =========================================
          Calendar
      ========================================= */}

      <div className="skeletonGrid">
        {dayPlaceholders.map((_, index) => (
          <div key={index} className="skeletonDay" aria-hidden="true" />
        ))}
      </div>
    </div>
  );
}

export default memo(CalendarSkeleton);

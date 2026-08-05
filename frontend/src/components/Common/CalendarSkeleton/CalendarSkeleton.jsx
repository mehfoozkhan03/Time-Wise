import "./CalendarSkeleton.css";

import { memo } from "react";

function CalendarSkeleton() {

  const filterPlaceholders = [...Array(8)];

  const dayPlaceholders = [...Array(35)];

  return (
    <div
      className="calendarSkeleton"
      role="status"
      aria-live="polite"
      aria-label="Loading calendar"
    >

      <div className="skeletonHeader" aria-hidden="true" />

      <div className="skeletonSearch" aria-hidden="true" />

      <div className="skeletonFilters">
        {filterPlaceholders.map((_, index) => (
          <div key={index} className="skeletonFilter" aria-hidden="true" />
        ))}
      </div>

      <div className="skeletonGrid">
        {dayPlaceholders.map((_, index) => (
          <div key={index} className="skeletonDay" aria-hidden="true" />
        ))}
      </div>
    </div>
  );
}

export default memo(CalendarSkeleton);

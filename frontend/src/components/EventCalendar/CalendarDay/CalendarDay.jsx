import "./CalendarDay.css";

import { memo, useCallback } from "react";

import EventBadge from "../EventBadge/EventBadge";

function CalendarDay({
  day,
  events = [],
  isCurrentMonth,
  isToday,
  isSelected,
  onSelectDate,
  onEventClick,
  onMoreEvents,
}) {
  /* =========================================
     Visible Events
  ========================================= */

  const visibleEvents = events.slice(0, 1);

  /* =========================================
     Class Names
  ========================================= */

  const className = [
    "calendarDay",
    !isCurrentMonth && "otherMonth",
    isToday && "today",
    isSelected && "selected",
  ]
    .filter(Boolean)
    .join(" ");

  /* =========================================
     Select Date
  ========================================= */

  const handleSelectDate = useCallback(() => {
    onSelectDate?.(day);
  }, [day, onSelectDate]);

  /* =========================================
     Keyboard Support
  ========================================= */

  const handleKeyDown = useCallback(
    (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        handleSelectDate();
      }
    },
    [handleSelectDate],
  );

  /* =========================================
     Stop Propagation
  ========================================= */

  const stopPropagation = useCallback((event) => {
    event.stopPropagation();
  }, []);

  /* =========================================
     More Events
  ========================================= */

  const handleMoreEvents = useCallback(
    (event) => {
      event.stopPropagation();

      onMoreEvents?.(day, events);
    },
    [day, events, onMoreEvents],
  );

  return (
    <div
      className={className}
      onClick={handleSelectDate}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`Select ${day.toDateString()}`}
      aria-pressed={isSelected}
    >
      <div className="dayHeader">
        <span className="dayNumber">{day.getDate()}</span>
      </div>

      <div className="dayEvents">
        {visibleEvents.length > 0 &&
          visibleEvents.map((event) => (
            <div
              key={event._id ?? event.id ?? `${event.date}-${event.title}`}
              onClick={stopPropagation}
            >
              <EventBadge event={event} onClick={onEventClick} />
            </div>
          ))}

        {events.length > 1 && (
          <button
            type="button"
            className="moreEvents"
            onClick={handleMoreEvents}
            aria-label={`View ${events.length - 1} more events`}
          >
            +{events.length - 1} More
          </button>
        )}

        {events.length === 0 && <div className="emptyEvents" />}
      </div>
    </div>
  );
}

CalendarDay.displayName = "CalendarDay";

export default memo(CalendarDay);
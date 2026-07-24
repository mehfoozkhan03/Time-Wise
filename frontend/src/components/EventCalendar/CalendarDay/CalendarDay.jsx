import "./CalendarDay.css";

import { memo, useCallback, useMemo } from "react";

import EventBadge from "../EventBadge/EventBadge";

function CalendarDay({
  day,
  events = [],
  isCurrentMonth,
  isToday,
  isSelected,
  onSelectDate,
  onEventClick,
}) {
  /* =========================================
     Visible Events
  ========================================= */

  const visibleEvents = useMemo(() => {
    return events.slice(0, 2);
  }, [events]);

  /* =========================================
     Select Date
  ========================================= */

  const handleSelectDate = useCallback(() => {
    if (!onSelectDate) return;

    onSelectDate(day);
  }, [day, onSelectDate]);

  /* =========================================
     Keyboard Support
  ========================================= */

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleSelectDate();
      }
    },
    [handleSelectDate],
  );

  /* =========================================
     Stop Event Propagation
  ========================================= */

  const stopPropagation = useCallback((e) => {
    e.stopPropagation();
  }, []);

  return (
    <div
      className={`calendarDay
        ${!isCurrentMonth ? "otherMonth" : ""}
        ${isToday ? "today" : ""}
        ${isSelected ? "selected" : ""}
      `}
      onClick={handleSelectDate}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`Select ${day.toDateString()}`}
      aria-pressed={isSelected}
    >
      {/* =========================================
          Day Number
      ========================================= */}

      <div className="dayHeader">
        <span className="dayNumber">{day.getDate()}</span>
      </div>

      {/* =========================================
          Events
      ========================================= */}

      <div className="dayEvents">
        {visibleEvents.length === 0 ? (
          <div className="emptyEvents" />
        ) : (
          <>
            {visibleEvents.map((event) => (
              <div key={event._id || event.id} onClick={stopPropagation}>
                <EventBadge event={event} onClick={onEventClick} />
              </div>
            ))}

            {events.length > 2 && (
              <button
                type="button"
                className="moreEvents"
                onClick={stopPropagation}
                aria-label={`View ${events.length - 2} more events`}
              >
                +{events.length - 2} More
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default memo(CalendarDay);

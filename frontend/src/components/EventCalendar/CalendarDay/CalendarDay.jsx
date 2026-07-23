import "./CalendarDay.css";

import EventBadge from "../EventBadge/EventBadge";

export default function CalendarDay({
  day,
  events = [],
  isCurrentMonth,
  isToday,
  isSelected,
  onSelectDate,
  onEventClick,
}) {
  const handleSelectDate = () => {
    onSelectDate(day);
  };

  return (
    <div
      className={`calendarDay
                ${!isCurrentMonth ? "otherMonth" : ""}
                ${isToday ? "today" : ""}
                ${isSelected ? "selected" : ""}
            `}
      onClick={handleSelectDate}
      role="button"
      tabIndex={0}
      aria-label={`Select ${day.toDateString()}`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleSelectDate();
        }
      }}
    >
      {/* Day Number */}

      <div className="dayHeader">
        <span className="dayNumber">{day.getDate()}</span>
      </div>

      {/* Events */}

      <div className="dayEvents">
        {events.length === 0 ? (
          <div className="emptyEvents" />
        ) : (
          <>
            {events.slice(0, 2).map((event) => (
              <div
                key={event._id ?? event.id}
                onClick={(e) => e.stopPropagation()}
              >
                <EventBadge event={event} onClick={onEventClick} />
              </div>
            ))}

            {events.length > 2 && (
              <div className="moreEvents">+{events.length - 2} More</div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

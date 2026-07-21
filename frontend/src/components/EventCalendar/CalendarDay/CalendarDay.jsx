import "./CalendarDay.css";

import EventBadge from "../EventBadge/EventBadge";

export default function CalendarDay({
  day,
  events,
  isCurrentMonth,
  isToday,
  isSelected,
  onSelectDate,
  onEventClick,
}) {
  return (
      <div
          className={`calendarDay
              ${!isCurrentMonth ? "otherMonth" : ""}
              ${isToday ? "today" : ""}
              ${isSelected ? "selected" : ""}
          `}
          onClick={() => onSelectDate(day)}
          role="button"
          tabIndex={0}
          aria-label={`Select ${day.toDateString()}`}
          onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelectDate(day);
              }
          }}
      >
      <div className="dayHeader">
        <span className="dayNumber">{day.getDate()}</span>
      </div>

      <div className="dayEvents">
        {events.length === 0 ? (
          <div className="emptyEvents" />
        ) : (
          <>
            {events.slice(0, 2).map((event) => (
              <div key={event.id} onClick={(e) => e.stopPropagation()}>
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

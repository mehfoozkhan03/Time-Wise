import "./CalendarGrid.css";

import { memo, useMemo } from "react";

import CalendarDay from "../CalendarDay/CalendarDay";

import {
  WEEK_DAYS,
  generateCalendar,
  getDateKey,
  isSameDate,
} from "../../../utils/calendarUtils";

function CalendarGrid({
  currentDate,
  selectedDate,
  selectDate,
  events = [],
  onEventClick,
  onMoreEvents,
}) {

  const calendar = useMemo(() => {
    return generateCalendar(currentDate);
  }, [currentDate]);

  const eventsByDate = useMemo(() => {
    const map = new Map();

    events.forEach((event) => {
      if (!event?.date) {
        return;
      }

      const eventDate = new Date(event.date);

      if (Number.isNaN(eventDate.getTime())) {
        return;
      }

      const dateKey = getDateKey(eventDate);

      if (!map.has(dateKey)) {
        map.set(dateKey, []);
      }

      map.get(dateKey).push(event);
    });

    return map;
  }, [events]);

  return (
    <section
      id="calendar-grid"
      className="calendarWrapper"
      aria-label="Calendar"
    >
      <div className="weekHeader" role="row">
        {WEEK_DAYS.map((day) => (
          <div key={day} role="columnheader">
            {day}
          </div>
        ))}
      </div>

      <div className="calendarGrid" role="grid">
        {calendar.map((item) => {
          const dateKey = getDateKey(item.date);

          return (
            <CalendarDay
              key={dateKey}
              day={item.date}
              events={eventsByDate.get(dateKey) || []}
              isCurrentMonth={item.currentMonth}
              isToday={item.isToday}
              isSelected={isSameDate(item.date, selectedDate)}
              onSelectDate={selectDate}
              onEventClick={onEventClick}
              onMoreEvents={onMoreEvents}
            />
          );
        })}
      </div>
    </section>
  );
}

CalendarGrid.displayName = "CalendarGrid";

export default memo(CalendarGrid);

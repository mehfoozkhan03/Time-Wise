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
}) {
  /* =========================================
     Generate Calendar
  ========================================= */

  const calendar = useMemo(() => {
    return generateCalendar(currentDate);
  }, [currentDate]);

  /* =========================================
     Week Header
  ========================================= */

  const weekDays = WEEK_DAYS;

  /* =========================================
     Group Events By Date
  ========================================= */

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
    <section className="calendarWrapper">
      <div className="weekHeader">
        {weekDays.map((day) => (
          <div key={day} role="columnheader">
            {day}
          </div>
        ))}
      </div>

      <div className="calendarGrid">
        {calendar.map((item) => {
          const dateKey = getDateKey(item.date);

          const dayEvents = eventsByDate.get(dateKey) || [];

          return (
            <CalendarDay
              key={dateKey}
              day={item.date}
              events={dayEvents}
              isCurrentMonth={item.currentMonth}
              isToday={item.isToday}
              isSelected={isSameDate(item.date, selectedDate)}
              onSelectDate={selectDate}
              onEventClick={onEventClick}
            />
          );
        })}
      </div>
    </section>
  );
}

CalendarGrid.displayName = "CalendarGrid";

export default memo(CalendarGrid);

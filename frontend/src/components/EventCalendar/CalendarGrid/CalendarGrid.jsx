import "./CalendarGrid.css";

import { memo, useMemo } from "react";

import CalendarDay from "../CalendarDay/CalendarDay";

import {
  WEEK_DAYS,
  generateCalendar,
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

  const weekDays = useMemo(() => WEEK_DAYS, []);

  /* =========================================
       Group Events By Date
    ========================================= */

  const eventsByDate = useMemo(() => {
    const map = new Map();

    events.forEach((event) => {
      if (!event?.date) return;

      let dateKey;

      if (typeof event.date === "string") {
        dateKey = event.date;
      } else {
        const eventDate = new Date(event.date);

        if (Number.isNaN(eventDate.getTime())) return;

        dateKey = [
          eventDate.getFullYear(),
          String(eventDate.getMonth() + 1).padStart(2, "0"),
          String(eventDate.getDate()).padStart(2, "0"),
        ].join("-");
      }

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
          const dateKey = [
            item.date.getFullYear(),
            String(item.date.getMonth() + 1).padStart(2, "0"),
            String(item.date.getDate()).padStart(2, "0"),
          ].join("-");

          const dayEvents = eventsByDate.get(dateKey) ?? [];

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

export default memo(CalendarGrid);

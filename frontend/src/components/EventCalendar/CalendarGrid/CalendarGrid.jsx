import "./CalendarGrid.css";

import { useMemo } from "react";

import CalendarDay from "../CalendarDay/CalendarDay";

import {
  WEEK_DAYS,
  generateCalendar,
  isSameDate,
} from "../../../utils/calendarUtils";

export default function CalendarGrid({
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
       Group Events by Date
    ========================================= */

  const eventsByDate = useMemo(() => {
    const map = new Map();

    events.forEach((event) => {
      if (!event?.date) return;

      const dateKey = new Date(event.date).toISOString().split("T")[0];

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
        {WEEK_DAYS.map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>

      <div className="calendarGrid">
        {calendar.map((item) => {
          const dateKey = item.date.toISOString().split("T")[0];

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

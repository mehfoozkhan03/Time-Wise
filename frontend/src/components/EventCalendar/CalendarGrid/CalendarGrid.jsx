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

  const weekDays = useMemo(() => WEEK_DAYS, []);

  /* =========================================
     Group Events By Date
  ========================================= */

  const eventsByDate = useMemo(() => {
    const map = new Map();

    events.forEach((event) => {
      if (!event?.date) return;

      const eventDate = new Date(event.date);

      if (Number.isNaN(eventDate.getTime())) {
        console.warn("Invalid Event:", event);
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

  /* =========================================
     Debug
  ========================================= */

  // useEffect(() => {
  //   console.group("===== CALENDAR GRID =====");

  //   console.log("Current Month:", currentDate);
  //   console.log("Events Received:", events.length);
  //   console.log("Grouped Days:", eventsByDate.size);

  //   eventsByDate.forEach((value, key) => {
  //     console.log(`${key} -> ${value.length} event(s)`, value);
  //   });

  //   console.groupEnd();
  // }, [currentDate, events, eventsByDate]);

  /* =========================================
     Render
  ========================================= */

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

export default memo(CalendarGrid);
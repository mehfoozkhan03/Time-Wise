import "./MiniCalendar.css";

import { memo, useMemo, useCallback } from "react";

import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

import Card from "../../Common/CalendarCard/Card";

import {
  WEEK_DAYS,
  generateCalendar,
  getMonthName,
  isSameDate,
} from "../../../utils/calendarUtils";

function MiniCalendar({
  currentDate,
  selectedDate,
  selectDate,
  previousMonth,
  nextMonth,
}) {
  /* =========================================
     Safety Check
  ========================================= */

  if (!currentDate) {
    return null;
  }

  /* =========================================
     Generate Calendar
  ========================================= */

  const days = useMemo(() => {
    return generateCalendar(currentDate);
  }, [currentDate]);

  /* =========================================
     Week Days
  ========================================= */

  const weekDays = useMemo(() => WEEK_DAYS, []);

  /* =========================================
     Select Day
  ========================================= */

  const handleSelectDay = useCallback(
    (date) => {
      selectDate?.(date);
    },
    [selectDate],
  );

  return (
    <Card className="miniCalendarCard">
      <div className="miniHeader">
        <button
          type="button"
          onClick={previousMonth}
          aria-label="Previous Month"
          title="Previous Month"
        >
          <FaChevronLeft />
        </button>

        <h3>
          {getMonthName(currentDate)} {currentDate.getFullYear()}
        </h3>

        <button
          type="button"
          onClick={nextMonth}
          aria-label="Next Month"
          title="Next Month"
        >
          <FaChevronRight />
        </button>
      </div>

      <div className="miniWeekDays">
        {weekDays.map((day) => (
          <span key={day}>{day.charAt(0)}</span>
        ))}
      </div>

      <div className="miniGrid">
        {days.map((day) => {
          const isSelected = isSameDate(day.date, selectedDate);

          const className = [
            "miniDay",
            !day.currentMonth && "otherMonth",
            day.isToday && "today",
            isSelected && "selected",
          ]
            .filter(Boolean)
            .join(" ");

          const dayKey = [
            day.date.getFullYear(),
            String(day.date.getMonth() + 1).padStart(2, "0"),
            String(day.date.getDate()).padStart(2, "0"),
          ].join("-");

          return (
            <button
              key={dayKey}
              type="button"
              className={className}
              onClick={() => handleSelectDay(day.date)}
              aria-pressed={isSelected}
              aria-label={`Select ${day.date.toDateString()}`}
            >
              {day.date.getDate()}
            </button>
          );
        })}
      </div>
    </Card>
  );
}

export default memo(MiniCalendar);

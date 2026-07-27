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

  if (!currentDate) return null;

  /* =========================================
     Calendar Data
  ========================================= */

  const days = useMemo(() => generateCalendar(currentDate), [currentDate]);

  const weekDays = useMemo(() => WEEK_DAYS, []);

  const monthTitle = useMemo(
    () => `${getMonthName(currentDate)} ${currentDate.getFullYear()}`,
    [currentDate],
  );

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

        <h3>{monthTitle}</h3>

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
        {days.map((item) => {
          const isSelected = isSameDate(item.date, selectedDate);

          const className = [
            "miniDay",
            !item.currentMonth && "otherMonth",
            item.isToday && "today",
            isSelected && "selected",
          ]
            .filter(Boolean)
            .join(" ");

          const dayKey = [
            item.date.getFullYear(),
            String(item.date.getMonth() + 1).padStart(2, "0"),
            String(item.date.getDate()).padStart(2, "0"),
          ].join("-");

          return (
            <button
              key={dayKey}
              type="button"
              className={className}
              onClick={() => handleSelectDay(item.date)}
              aria-pressed={isSelected}
              aria-label={`Select ${item.date.toDateString()}`}
            >
              {item.date.getDate()}
            </button>
          );
        })}
      </div>
    </Card>
  );
}

export default memo(MiniCalendar);

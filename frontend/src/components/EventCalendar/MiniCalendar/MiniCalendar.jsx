import "./MiniCalendar.css";

import { memo, useMemo, useCallback } from "react";

import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

import Card from "../../Common/CalendarCard/Card";

import {
  WEEK_DAYS,
  generateCalendar,
  getDateKey,
  getMonthName,
  isSameDate,
} from "../../../utils/calendarUtils";

function MiniCalendar({
  currentDate,
  selectedDate,
  selectDate,
  previousMonth,
  nextMonth,
  onMonthChange,
}) {
  /* =========================================
     Safety Check
  ========================================= */

  if (!currentDate) {
    return null;
  }

  /* =========================================
     Calendar Data
  ========================================= */

  const days = useMemo(() => {
    return generateCalendar(currentDate);
  }, [currentDate]);

  const weekDays = useMemo(() => {
    return WEEK_DAYS;
  }, []);

  const monthTitle = useMemo(() => {
    return `${getMonthName(currentDate)} ${currentDate.getFullYear()}`;
  }, [currentDate]);

  /* =========================================
     Handlers
  ========================================= */

  const handleSelectDay = useCallback(
    (date) => {
      selectDate?.(date);
    },
    [selectDate],
  );

  const createSelectHandler = useCallback(
    (date) => () => {
      handleSelectDay(date);
    },
    [handleSelectDay],
  );

  const handlePreviousMonth = useCallback(() => {
    previousMonth?.();
    onMonthChange?.("previous");
  }, [previousMonth, onMonthChange]);

  const handleNextMonth = useCallback(() => {
    nextMonth?.();
    onMonthChange?.("next");
  }, [nextMonth, onMonthChange]);

  const getDayClassName = useCallback((item, isSelected) => {
    return [
      "miniDay",
      !item.currentMonth && "otherMonth",
      item.isToday && "today",
      isSelected && "selected",
    ]
      .filter(Boolean)
      .join(" ");
  }, []);

  return (
    <Card className="miniCalendarCard">
      <div className="miniHeader">
        <button
          type="button"
          onClick={handlePreviousMonth}
          aria-label="Previous Month"
          title="Previous Month"
        >
          <FaChevronLeft />
        </button>

        <h3>{monthTitle}</h3>

        <button
          type="button"
          onClick={handleNextMonth}
          aria-label="Next Month"
          title="Next Month"
        >
          <FaChevronRight />
        </button>
      </div>

      <div className="miniWeekDays" role="rowgroup">
        {weekDays.map((day) => (
          <span key={day} role="columnheader">
            {day.charAt(0)}
          </span>
        ))}
      </div>

      <div className="miniGrid" role="grid" aria-label="Mini Calendar">
        {days.map((item) => {
          const isSelected = isSameDate(item.date, selectedDate);

          return (
            <button
              key={getDateKey(item.date)}
              type="button"
              className={getDayClassName(item, isSelected)}
              onClick={createSelectHandler(item.date)}
              aria-pressed={isSelected}
              aria-current={item.isToday ? "date" : undefined}
              aria-label={`Select ${item.date.toDateString()}`}
              title={item.date.toDateString()}
            >
              {item.date.getDate()}
            </button>
          );
        })}
      </div>
    </Card>
  );
}

MiniCalendar.displayName = "MiniCalendar";

export default memo(MiniCalendar);

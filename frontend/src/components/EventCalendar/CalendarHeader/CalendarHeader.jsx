import "./CalendarHeader.css";

import { memo, useCallback, useMemo } from "react";

import {
  FaChevronLeft,
  FaChevronRight,
  FaCalendarDay,
} from "react-icons/fa";

import { getMonthName } from "../../../utils/calendarUtils";

function CalendarHeader({
  currentDate,
  previousMonth,
  nextMonth,
  goToToday,
}) {
  /* =========================================
     Safety Check
  ========================================= */

  if (!currentDate) return null;

  /* =========================================
     Month Title
  ========================================= */

  const monthTitle = useMemo(() => {
    return `${getMonthName(currentDate)} ${currentDate.getFullYear()}`;
  }, [currentDate]);

  /* =========================================
     Handlers
  ========================================= */

  const handlePreviousMonth = useCallback(() => {
    previousMonth?.();
  }, [previousMonth]);

  const handleNextMonth = useCallback(() => {
    nextMonth?.();
  }, [nextMonth]);

  const handleToday = useCallback(() => {
    goToToday?.();
  }, [goToToday]);

  return (
    <header className="calendarHeader">
      <div className="headerTitle">
        <h2>{monthTitle}</h2>
      </div>

      <div className="headerActions">
        <button
          type="button"
          className="navBtn"
          onClick={handlePreviousMonth}
          aria-label="Previous month"
          title="Previous Month"
        >
          <FaChevronLeft />
        </button>

        <button
          type="button"
          className="todayBtn"
          onClick={handleToday}
          aria-label="Go to today"
          title="Go to Today"
        >
          <FaCalendarDay />
          <span>Today</span>
        </button>

        <button
          type="button"
          className="navBtn"
          onClick={handleNextMonth}
          aria-label="Next month"
          title="Next Month"
        >
          <FaChevronRight />
        </button>
      </div>
    </header>
  );
}

export default memo(CalendarHeader);
import "./CalendarHeader.css";

import { memo } from "react";

import { FaChevronLeft, FaChevronRight, FaCalendarDay } from "react-icons/fa";

import { getMonthName } from "../../../utils/calendarUtils";

function CalendarHeader({ currentDate, previousMonth, nextMonth, goToToday }) {
  /* =========================================
     Safety Check
  ========================================= */

  if (!currentDate) {
    return null;
  }

  return (
    <header className="calendarHeader">
      <div className="headerTitle">
        <h2>
          {getMonthName(currentDate)} {currentDate.getFullYear()}
        </h2>
      </div>

      <div className="headerActions">
        <button
          type="button"
          className="navBtn"
          onClick={previousMonth}
          aria-label="Previous month"
          title="Previous Month"
        >
          <FaChevronLeft />
        </button>

        <button
          type="button"
          className="todayBtn"
          onClick={goToToday}
          aria-label="Go to today"
          title="Go to Today"
        >
          <FaCalendarDay />

          <span>Today</span>
        </button>

        <button
          type="button"
          className="navBtn"
          onClick={nextMonth}
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

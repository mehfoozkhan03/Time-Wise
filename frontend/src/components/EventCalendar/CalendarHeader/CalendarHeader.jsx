import "./CalendarHeader.css";

import { memo, useCallback, useMemo } from "react";

import {
  FaChevronLeft,
  FaChevronRight,
  FaCalendarDay,
  FaPlus,
  FaUmbrellaBeach,
} from "react-icons/fa";

import { getMonthName } from "../../../utils/calendarUtils";

function CalendarHeader({
  currentDate,
  previousMonth,
  nextMonth,
  goToToday,
  onCreateEvent,
  onCreateHoliday,
  canCreate = false,
  canManageHoliday = false,
}) {
  if (!currentDate) {
    return null;
  }

  const monthTitle = useMemo(() => {
    return `${getMonthName(currentDate)} ${currentDate.getFullYear()}`;
  }, [currentDate]);

  const handlePreviousMonth = useCallback(() => {
    previousMonth?.();
  }, [previousMonth]);

  const handleNextMonth = useCallback(() => {
    nextMonth?.();
  }, [nextMonth]);

  const handleToday = useCallback(() => {
    goToToday?.();
  }, [goToToday]);

  const handleCreateEvent = useCallback(() => {
    onCreateEvent?.();
  }, [onCreateEvent]);

  const handleCreateHoliday = useCallback(() => {
    onCreateHoliday?.();
  }, [onCreateHoliday]);

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

        {canCreate && (
          <button
            type="button"
            className="createEventBtn"
            onClick={handleCreateEvent}
            aria-label="Create Event"
            title="Create Event"
          >
            <FaPlus />
            <span>Add Event</span>
          </button>
        )}

        {canManageHoliday && (
          <button
            type="button"
            className="createHolidayBtn"
            onClick={handleCreateHoliday}
            aria-label="Create Holiday"
            title="Create Holiday"
          >
            <FaUmbrellaBeach />
            <span>Add Holiday</span>
          </button>
        )}
      </div>
    </header>
  );
}

CalendarHeader.displayName = "CalendarHeader";

export default memo(CalendarHeader);

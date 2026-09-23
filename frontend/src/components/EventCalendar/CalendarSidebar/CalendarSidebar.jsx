import "./CalendarSidebar.css";

import { memo, useCallback } from "react";

import MiniCalendar from "../MiniCalendar/MiniCalendar";
import UpcomingEvents from "../UpcomingEvents/UpcomingEvents";
import EventLegend from "../EventLegend/EventLegend";
import TodaySummary from "../TodaySummary/TodaySummary";

function CalendarSidebar({
  currentDate,
  selectedDate,
  selectDate,
  previousMonth,
  nextMonth,
  events = [],
  filters = {},
  toggleFilter,
  onEventClick,
}) {

  const handleEventClick = useCallback(
    (event) => {
      onEventClick?.(event);
    },
    [onEventClick],
  );

  const handleToggleFilter = useCallback(
    (type) => {
      toggleFilter?.(type);
    },
    [toggleFilter],
  );

  return (
    <aside className="calendarSidebar" aria-label="Calendar Sidebar">
      <MiniCalendar
        currentDate={currentDate}
        selectedDate={selectedDate}
        selectDate={selectDate}
        previousMonth={previousMonth}
        nextMonth={nextMonth}
      />

      <UpcomingEvents events={events} onEventClick={handleEventClick} />

      <EventLegend filters={filters} toggleFilter={handleToggleFilter} />

      <TodaySummary events={events} />
    </aside>
  );
}

CalendarSidebar.displayName = "CalendarSidebar";

export default memo(CalendarSidebar);

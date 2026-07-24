import "./EventCalendar.css";

import { useMemo, useState, useCallback, useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";

import useCalendar from "../../hooks/useCalendar";
import useEventFilter from "../../hooks/useEventFilter";

import { fetchEvents } from "../../store/calendarSlice";
import { fetchHolidays } from "../../store/holidaySlice";

import { mapHolidayList } from "../../utils/holidayMapper";

import CalendarHeader from "./CalendarHeader/CalendarHeader";
import CalendarGrid from "./CalendarGrid/CalendarGrid";
import CalendarSidebar from "./CalendarSidebar/CalendarSidebar";
import EventFilters from "./EventFilters/EventFilters";
import EventModal from "./EventModal/EventModal";
import CalendarSkeleton from "../Common/CalendarSkeleton/CalendarSkeleton";

export default function EventCalendar() {
  /* =========================================
     Redux
  ========================================= */

  const dispatch = useDispatch();

  const {
    events = [],
    loading,
    error,
  } = useSelector((state) => state.calendar);

  const {
    holidays = [],
    status: holidayStatus,
    error: holidayError,
  } = useSelector((state) => state.holiday);

  /* =========================================
     Fetch Calendar Data
  ========================================= */

  useEffect(() => {
    dispatch(fetchEvents());
    dispatch(fetchHolidays());
  }, [dispatch]);

  /* =========================================
     Calendar State
  ========================================= */

  const {
    currentDate,
    selectedDate,
    selectDate,
    nextMonth,
    previousMonth,
    goToToday,
  } = useCalendar();

  /* =========================================
     Merge Calendar Events + Holidays
  ========================================= */

  const allEvents = useMemo(() => {
    const mapped = mapHolidayList(holidays);

    console.log("Mapped Holiday Sample:", mapped[0]);
    console.log(
      "Holiday Types:",
      mapped.slice(0, 10).map((e) => e.type)
    );

    return [...events, ...mapped];
  }, [events, holidays]);
  /* =========================================
     Selected Event
  ========================================= */

  const [selectedEvent, setSelectedEvent] = useState(null);

  const handleEventClick = useCallback((event) => {
    setSelectedEvent(event);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedEvent(null);
  }, []);

  /* =========================================
     Event Filters
  ========================================= */

  const {
    filters,
    searchTerm,
    setSearchTerm,
    toggleFilter,
    selectAll,
    clearAll,
    filteredEvents,
  } = useEventFilter(allEvents);

  console.log(
    allEvents.filter(
        e =>
            e.date.includes("2026-08")
    )
);
  /* =========================================
     Loading
  ========================================= */

  if (loading || holidayStatus === "loading") {
    return <CalendarSkeleton />;
  }

  /* =========================================
     Error
  ========================================= */

  if (error || holidayError) {
    return (
      <section className="eventCalendar">
        <div className="calendarError">
          <h3>Failed to load calendar</h3>

          <p>{error || holidayError}</p>
        </div>
      </section>
    );
  }

  /* =========================================
     Render
  ========================================= */

  return (
    <section className="eventCalendar">
      <CalendarHeader
        currentDate={currentDate}
        previousMonth={previousMonth}
        nextMonth={nextMonth}
        goToToday={goToToday}
      />

      <EventFilters
        filters={filters}
        toggleFilter={toggleFilter}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectAll={selectAll}
        clearAll={clearAll}
        events={allEvents}
      />

      <div className="calendarBody">
        <CalendarGrid
          currentDate={currentDate}
          selectedDate={selectedDate}
          selectDate={selectDate}
          events={filteredEvents}
          onEventClick={handleEventClick}
        />

        <CalendarSidebar
          currentDate={currentDate}
          selectedDate={selectedDate}
          selectDate={selectDate}
          previousMonth={previousMonth}
          nextMonth={nextMonth}
          events={filteredEvents}
          filters={filters}
          toggleFilter={toggleFilter}
          onEventClick={handleEventClick}
        />
      </div>

      <EventModal event={selectedEvent} onClose={handleCloseModal} />
    </section>
  );
}

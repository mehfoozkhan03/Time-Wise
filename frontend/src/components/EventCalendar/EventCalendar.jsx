import "./EventCalendar.css";

import { useMemo, useState, useCallback, useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";

import useCalendar from "../../hooks/useCalendar";
import useEventFilter from "../../hooks/useEventFilter";

import { fetchEvents } from "../../store/calendarSlice";

import { holidayData } from "../../data/holidays";

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

  /* =========================================
       Fetch Events
    ========================================= */

  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  /* =========================================
       Calendar
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
       Merge Events
       (MongoDB + Local Holidays)
    ========================================= */

  const allEvents = useMemo(() => {
    return [...events, ...holidayData];
  }, [events]);

  /* =========================================
       Event Modal
    ========================================= */

  const [selectedEvent, setSelectedEvent] = useState(null);

  const handleEventClick = useCallback((event) => {
    setSelectedEvent(event);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedEvent(null);
  }, []);

  /* =========================================
       Filters
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

  /* =========================================
       Loading
    ========================================= */

  if (loading) {
    return <CalendarSkeleton />;
  }

  /* =========================================
       Error
    ========================================= */

  if (error) {
    return (
      <section className="eventCalendar">
        <div className="calendarError">
          <h3>Failed to load calendar</h3>

          <p>{error}</p>
        </div>
      </section>
    );
  }

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

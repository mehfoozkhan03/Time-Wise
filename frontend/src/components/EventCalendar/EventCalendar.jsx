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
     Fetch Data
  ========================================= */

  useEffect(() => {
    dispatch(fetchEvents());
    dispatch(fetchHolidays());
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
     Holiday Mapping
  ========================================= */

  const mappedHolidays = useMemo(() => {
    return mapHolidayList(holidays);
  }, [holidays]);

  /* =========================================
     Merge & Sort Events
  ========================================= */

  const allEvents = useMemo(() => {
    return [...events, ...mappedHolidays].sort((a, b) => {
      const dateDiff = new Date(a.date) - new Date(b.date);

      if (dateDiff !== 0) {
        return dateDiff;
      }

      return (a.startTime || "").localeCompare(b.startTime || "");
    });
  }, [events, mappedHolidays]);

  /* =========================================
     Current Month Events
  ========================================= */

  const currentMonthEvents = useMemo(() => {
    return allEvents.filter((event) => {
      if (!event?.date) return false;

      const date = new Date(event.date);

      return (
        date.getFullYear() === currentDate.getFullYear() &&
        date.getMonth() === currentDate.getMonth()
      );
    });
  }, [allEvents, currentDate]);

  /* =========================================
     Debug
  ========================================= */

  // useEffect(() => {
  //   console.group("===== EVENT CALENDAR DEBUG =====");
  //   console.log("Calendar Events:", events.length);
  //   console.log("Redux Holidays:", holidays.length);
  //   console.log("Mapped Holidays:", mappedHolidays.length);
  //   console.log("All Events:", allEvents.length);
  //   console.log("Current Month Events:", currentMonthEvents.length);
  //   console.groupEnd();
  // }, [events, holidays, mappedHolidays, allEvents, currentMonthEvents]);

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
  } = useEventFilter(allEvents, currentDate);

  /* =========================================
     UI State
  ========================================= */

  const isLoading = loading || holidayStatus === "loading";
  const hasError = error || holidayError;

  /* =========================================
     Loading
  ========================================= */

  if (isLoading) {
    return <CalendarSkeleton />;
  }

  /* =========================================
     Error
  ========================================= */

  if (hasError) {
    return (
      <section className="eventCalendar">
        <div className="calendarError">
          <h3>Failed to load calendar</h3>
          <p>{hasError}</p>
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
        events={currentMonthEvents}
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
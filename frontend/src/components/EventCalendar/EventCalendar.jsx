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

import EventFormModal from "./EventFormModal/EventFormModal";
import HolidayFormModal from "./HolidayFormModal/HolidayFormModal";
import DeleteModal from "./DeleteModal/DeleteModal";

import CalendarSkeleton from "../Common/CalendarSkeleton/CalendarSkeleton";

export default function EventCalendar() {
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

  useEffect(() => {
    dispatch(fetchEvents());
    dispatch(fetchHolidays());
  }, [dispatch]);

  const {
    currentDate,
    selectedDate,
    selectDate,
    nextMonth,
    previousMonth,
    goToToday,
  } = useCalendar();

  const mappedHolidays = useMemo(() => {
    return mapHolidayList(holidays);
  }, [holidays]);

  const allEvents = useMemo(() => {
    const calendarEvents = Array.isArray(events) ? events : [];

    const holidayEvents = Array.isArray(mappedHolidays) ? mappedHolidays : [];

    return [...calendarEvents, ...holidayEvents].sort((a, b) => {
      const dateDiff = new Date(a.date) - new Date(b.date);

      if (dateDiff !== 0) {
        return dateDiff;
      }

      return (a.startTime || "").localeCompare(b.startTime || "");
    });
  }, [events, mappedHolidays]);

  const currentMonthEvents = useMemo(() => {
    return allEvents.filter((event) => {
      if (!event?.date) {
        return false;
      }

      const date = new Date(event.date);

      return (
        date.getFullYear() === currentDate.getFullYear() &&
        date.getMonth() === currentDate.getMonth()
      );
    });
  }, [allEvents, currentDate]);

  const [selectedEvent, setSelectedEvent] = useState(null);

  const [formMode, setFormMode] = useState("CREATE");

  const [eventFormOpen, setEventFormOpen] = useState(false);

  const [holidayFormOpen, setHolidayFormOpen] = useState(false);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const [selectedHoliday, setSelectedHoliday] = useState(null);

  const [deleteTarget, setDeleteTarget] = useState(null);

  const handleEventClick = useCallback((event) => {
    setSelectedEvent(event);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedEvent(null);
  }, []);

  const handleCreateEvent = useCallback(() => {
    setFormMode("CREATE");
    setSelectedEvent(null);
    setEventFormOpen(true);
  }, []);

  const handleEditEvent = useCallback((event) => {
    setSelectedEvent(null);
    setFormMode("EDIT");
    setSelectedEvent(event);
    setEventFormOpen(true);
  }, []);

  const handleCloseEventForm = useCallback(() => {
    setEventFormOpen(false);
    setSelectedEvent(null);
  }, []);

  const handleCloseHolidayForm = useCallback(() => {
    setHolidayFormOpen(false);
    setSelectedHoliday(null);
  }, []);

  const handleDeleteEvent = useCallback((event) => {
    setDeleteTarget(event);
    setDeleteModalOpen(true);
    setSelectedEvent(null);
  }, []);

  const handleCloseDeleteModal = useCallback(() => {
    setDeleteModalOpen(false);
    setDeleteTarget(null);
  }, []);

  const {
    filters,
    searchTerm,
    setSearchTerm,
    toggleFilter,
    selectAll,
    clearAll,
    filteredEvents,
  } = useEventFilter(allEvents, currentDate);

  const isLoading = loading || holidayStatus === "loading";

  const hasError = error || holidayError;

  if (isLoading) {
    return <CalendarSkeleton />;
  }

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

  return (
    <section className="eventCalendar">
      <CalendarHeader
        currentDate={currentDate}
        previousMonth={previousMonth}
        nextMonth={nextMonth}
        goToToday={goToToday}
        onCreateEvent={handleCreateEvent}
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

      <EventModal
        event={selectedEvent}
        onClose={handleCloseModal}
        onEdit={handleEditEvent}
        onDelete={handleDeleteEvent}
        canEdit={!selectedEvent?.isHoliday}
      />

      {eventFormOpen && (
        <EventFormModal
          event={formMode === "EDIT" ? selectedEvent : null}
          onClose={handleCloseEventForm}
        />
      )}

      {holidayFormOpen && (
        <HolidayFormModal
          holiday={selectedHoliday}
          onClose={handleCloseHolidayForm}
        />
      )}

      {deleteModalOpen && (
        <DeleteModal
          title={deleteTarget?.isHoliday ? "Delete Holiday" : "Delete Event"}
          message={`Are you sure you want to delete "${deleteTarget?.title}"?`}
          deleteLabel={
            deleteTarget?.isHoliday ? "Delete Holiday" : "Delete Event"
          }
          onCancel={handleCloseDeleteModal}
        />
      )}
    </section>
  );
}

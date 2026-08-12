import "./EventCalendar.css";
import { useMemo, useState, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import useCalendar from "../../hooks/useCalendar";
import useEventFilter from "../../hooks/useEventFilter";

import {
  fetchEvents,
  createEvent,
  updateEvent,
  deleteEvent,
} from "../../store/calendarSlice";

import {
  fetchHolidays,
  createHoliday,
  updateHoliday,
  deleteHoliday,
} from "../../store/holidaySlice";

import { mapHolidayList } from "../../utils/holidayMapper";

import CalendarHeader from "./CalendarHeader/CalendarHeader";
import CalendarGrid from "./CalendarGrid/CalendarGrid";
import CalendarSidebar from "./CalendarSidebar/CalendarSidebar";
import EventFilters from "./EventFilters/EventFilters";
import EventModal from "./EventModal/EventModal";

import EventFormModal from "./EventFormModal/EventFormModal";
import HolidayFormModal from "./HolidayFormModal/HolidayFormModal";
import DeleteModal from "./DeleteModal/DeleteModal";
import DayEventsModal from "./DayEventsModal/DayEventsModal"

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

  const { user } = useSelector((state) => state.auth);

  const { isAuthenticated: isAdmin } = useSelector((state) => state.adminAuth);

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
  const [selectedHoliday, setSelectedHoliday] = useState(null);

  const [dayEvents, setDayEvents] = useState([]);
  const [dayEventsModalOpen, setDayEventsModalOpen] = useState(false);

  const [formMode, setFormMode] = useState("CREATE");

  const [eventFormOpen, setEventFormOpen] = useState(false);
  const [holidayFormOpen, setHolidayFormOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleMoreEvents = useCallback((day, events) => {
    setDayEvents(events);
    setDayEventsModalOpen(true);
  }, []);

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

  const handleCreateHoliday = useCallback(() => {
    setFormMode("CREATE");
    setSelectedHoliday(null);
    setHolidayFormOpen(true);
  }, []);

  const handleEditRecord = useCallback((record) => {
    setFormMode("EDIT");
    setSelectedEvent(null);
    setSelectedHoliday(null);

    if (record.isHoliday) {
      setSelectedHoliday(record);
      setHolidayFormOpen(true);
    } else {
      setSelectedEvent(record);
      setEventFormOpen(true);
    }
  }, []);

  const handleCloseEventForm = useCallback(() => {
    setEventFormOpen(false);
    setSelectedEvent(null);
  }, []);

  const handleCloseHolidayForm = useCallback(() => {
    setHolidayFormOpen(false);
    setSelectedHoliday(null);
  }, []);

  const handleDeleteEvent = useCallback((record) => {
    setDeleteTarget(record);
    setDeleteModalOpen(true);
    setSelectedEvent(null);
  }, []);

  const handleCloseDeleteModal = useCallback(() => {
    setDeleteModalOpen(false);
    setDeleteTarget(null);
  }, []);

  const handleSubmitEvent = useCallback(
    async (formData) => {
      setIsSubmitting(true);

      try {
        if (formMode === "EDIT" && selectedEvent) {
          await dispatch(
            updateEvent({
              id: selectedEvent._id,
              data: formData,
            }),
          ).unwrap();
        } else {
          await dispatch(createEvent(formData)).unwrap();
        }

        handleCloseEventForm();
        setFormMode("CREATE");
      } catch (error) {
        console.error("Failed to save event:", error);
      } finally {
        setIsSubmitting(false);
      }
    },
    [dispatch, formMode, selectedEvent, handleCloseEventForm],
  );

  const handleSubmitHoliday = useCallback(
    async (formData) => {
      setIsSubmitting(true);

      try {
        if (formMode === "EDIT" && selectedHoliday) {
          await dispatch(
            updateHoliday({
              id: selectedHoliday._id,
              holidayData: formData,
            }),
          ).unwrap();
        } else {
          await dispatch(createHoliday(formData)).unwrap();
        }

        handleCloseHolidayForm();
        setFormMode("CREATE");
      } catch (error) {
        console.error("Failed to save holiday:", error);
      } finally {
        setIsSubmitting(false);
      }
    },
    [dispatch, formMode, selectedHoliday, handleCloseHolidayForm],
  );

  const handleConfirmDelete = useCallback(async () => {
    if (!deleteTarget) {
      return;
    }

    setIsDeleting(true);

    try {
      if (deleteTarget.isHoliday) {
        await dispatch(deleteHoliday(deleteTarget._id)).unwrap();
      } else {
        await dispatch(deleteEvent(deleteTarget._id)).unwrap();
      }

      handleCloseDeleteModal();
    } catch (error) {
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  }, [deleteTarget, dispatch, handleCloseDeleteModal]);

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

  const checkPermissions = useCallback(
    (record) => {
      if (!record) {
        return {
          canEdit: false,
          canDelete: false,
        };
      }

      if (isAdmin) {
        return {
          canEdit: true,
          canDelete: true,
        };
      }

      if (record.isHoliday) {
        return {
          canEdit: false,
          canDelete: false,
        };
      }

      const ownerId =
        typeof record.employeeId === "object"
          ? record.employeeId?._id
          : record.employeeId;

      const isOwner = ownerId === user?._id;

      return {
        canEdit: isOwner,
        canDelete: isOwner,
      };
    },
    [isAdmin, user],
  );

  const { canEdit, canDelete } = checkPermissions(selectedEvent);

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
        onCreateHoliday={handleCreateHoliday}
        canCreate={true}
        canManageHoliday={isAdmin}
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
          onMoreEvents={handleMoreEvents}
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
        onEdit={handleEditRecord}
        onDelete={handleDeleteEvent}
        canEdit={canEdit}
        canDelete={canDelete}
        isLoading={isDeleting}
      />

      {eventFormOpen && (
        <EventFormModal
          mode={formMode}
          event={formMode === "EDIT" ? selectedEvent : null}
          isSubmitting={isSubmitting}
          onSubmit={handleSubmitEvent}
          onClose={handleCloseEventForm}
        />
      )}

      {holidayFormOpen && (
        <HolidayFormModal
          mode={formMode}
          holiday={formMode === "EDIT" ? selectedHoliday : null}
          isSubmitting={isSubmitting}
          onSubmit={handleSubmitHoliday}
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
          onConfirm={handleConfirmDelete}
          isDeleting={isDeleting}
        />
      )}

      {dayEventsModalOpen && (
      <DayEventsModal
        date={selectedDate}
        events={dayEvents}
        onClose={() => setDayEventsModalOpen(false)}
        onEventClick={handleEventClick}
      />
      )}
    </section>
  );
}

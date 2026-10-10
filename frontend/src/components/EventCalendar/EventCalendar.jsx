import "./EventCalendar.css";
import { useMemo, useState, useCallback, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaLock, FaArrowLeft } from "react-icons/fa";
import useCalendar from "../../hooks/useCalendar";
import useEventFilter from "../../hooks/useEventFilter";
import { EVENT_TYPES } from "../../data/eventTypes";
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
import DayEventsModal from "./DayEventsModal/DayEventsModal";
import CalendarSkeleton from "../Common/CalendarSkeleton/CalendarSkeleton";

/* =========================================
   Axios Instance
========================================= */

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

export default function EventCalendar({ isAdmin = false }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

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

  const [calendarEmployees, setCalendarEmployees] = useState([]);

  /* =========================================
     CALENDAR AUTH TYPE
  ========================================= */

  const authType = isAdmin ? "admin" : "user";

  /* =========================================
     FETCH CALENDAR DATA AND EMPLOYEES
  ========================================= */

  useEffect(() => {
    let isActive = true;

    dispatch(fetchEvents({ authType }));
    dispatch(fetchHolidays());

    const loadCalendarEmployees = async () => {
      if (!isAdmin) {
        setCalendarEmployees([]);
        return;
      }

      try {
        const limit = 50;

        // Fetch the first page to determine the total number of pages.
        const firstResponse = await API.get("/admin/calendar-employees", {
          params: {
            page: 1,
            limit,
          },
        });

        const firstData = firstResponse.data;

        const allEmployees = Array.isArray(firstData.employees)
          ? [...firstData.employees]
          : [];

        const totalPages = Math.max(1, Number(firstData.totalPages) || 1);

        // Fetch remaining pages so no employees are omitted.
        for (let page = 2; page <= totalPages; page += 1) {
          const response = await API.get("/admin/calendar-employees", {
            params: {
              page,
              limit,
            },
          });

          if (Array.isArray(response.data.employees)) {
            allEmployees.push(...response.data.employees);
          }
        }

        if (isActive) {
          setCalendarEmployees(allEmployees);
        }
      } catch (requestError) {
        console.error("Failed to fetch Calendar employees:", requestError);

        if (isActive) {
          setCalendarEmployees([]);
        }
      }
    };

    loadCalendarEmployees();

    return () => {
      isActive = false;
    };
  }, [dispatch, authType, isAdmin]);

  /* =========================================
     CALENDAR HOOK
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
     MAP HOLIDAYS
  ========================================= */

  const mappedHolidays = useMemo(() => {
    return mapHolidayList(holidays);
  }, [holidays]);

  /* =========================================
     COMBINE EVENTS + HOLIDAYS
  ========================================= */

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

  /* =========================================
     CURRENT MONTH EVENTS
  ========================================= */

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

  /* =========================================
     WEEKEND COUNT
  ========================================= */

  const weekendCount = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    let count = 0;

    for (let day = 1; day <= daysInMonth; day += 1) {
      const date = new Date(year, month, day);
      const dayOfWeek = date.getDay();

      if (dayOfWeek === 0 || dayOfWeek === 6) {
        count += 1;
      }
    }

    return count;
  }, [currentDate]);

  /* =========================================
     MODAL STATES
  ========================================= */

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

  /* =========================================
     DAY EVENTS
  ========================================= */

  const handleMoreEvents = useCallback((day, events) => {
    setDayEvents(events);
    setDayEventsModalOpen(true);
  }, []);

  /* =========================================
     EVENT MODAL
  ========================================= */

  const handleEventClick = useCallback((event) => {
    setSelectedEvent(event);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedEvent(null);
  }, []);

  /* =========================================
     CREATE EVENT
  ========================================= */

  const handleCreateEvent = useCallback(() => {
    setFormMode("CREATE");
    setSelectedEvent(null);
    setEventFormOpen(true);
  }, []);

  /* =========================================
     CREATE HOLIDAY
  ========================================= */

  const handleCreateHoliday = useCallback(() => {
    setFormMode("CREATE");
    setSelectedHoliday(null);
    setHolidayFormOpen(true);
  }, []);

  /* =========================================
     EDIT RECORD
  ========================================= */

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

  /* =========================================
     CLOSE EVENT FORM
  ========================================= */

  const handleCloseEventForm = useCallback(() => {
    setEventFormOpen(false);
    setSelectedEvent(null);
  }, []);

  /* =========================================
     CLOSE HOLIDAY FORM
  ========================================= */

  const handleCloseHolidayForm = useCallback(() => {
    setHolidayFormOpen(false);
    setSelectedHoliday(null);
  }, []);

  /* =========================================
     DELETE EVENT
  ========================================= */

  const handleDeleteEvent = useCallback((record) => {
    setDeleteTarget(record);
    setDeleteModalOpen(true);
    setSelectedEvent(null);
  }, []);

  /* =========================================
     CLOSE DELETE MODAL
  ========================================= */

  const handleCloseDeleteModal = useCallback(() => {
    setDeleteModalOpen(false);
    setDeleteTarget(null);
  }, []);

  /* =========================================
     SUBMIT EVENT
  ========================================= */

  const handleSubmitEvent = useCallback(
    async (formData) => {
      setIsSubmitting(true);

      try {
        if (formMode === "EDIT" && selectedEvent) {
          await dispatch(
            updateEvent({
              id: selectedEvent._id,
              data: formData,
              authType,
            }),
          ).unwrap();
        } else {
          await dispatch(
            createEvent({
              eventData: formData,
              authType,
            }),
          ).unwrap();
        }

        handleCloseEventForm();
        setFormMode("CREATE");
      } catch (error) {
        console.error("Failed to save event:", error);
      } finally {
        setIsSubmitting(false);
      }
    },
    [dispatch, formMode, selectedEvent, authType, handleCloseEventForm],
  );

  /* =========================================
     SUBMIT HOLIDAY
  ========================================= */

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

  /* =========================================
     CONFIRM DELETE
  ========================================= */

  const handleConfirmDelete = useCallback(async () => {
    if (!deleteTarget) {
      return;
    }

    setIsDeleting(true);

    try {
      if (deleteTarget.isHoliday) {
        await dispatch(deleteHoliday(deleteTarget._id)).unwrap();
      } else {
        await dispatch(
          deleteEvent({
            id: deleteTarget._id,
            authType,
          }),
        ).unwrap();
      }

      handleCloseDeleteModal();
    } catch (error) {
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  }, [deleteTarget, dispatch, authType, handleCloseDeleteModal]);

  /* =========================================
     FILTERS
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
     STATUS
  ========================================= */

  const isLoading = loading || holidayStatus === "loading";
  const hasError = error || holidayError;

  /* =========================================
     PERMISSIONS
  ========================================= */

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

  /* =========================================
     GO BACK
  ========================================= */

  const handleGoBack = useCallback(() => {
    navigate(isAdmin ? "/adminDashboard" : "/settings");
  }, [navigate, isAdmin]);

  /* =========================================
     LOADING
  ========================================= */

  if (isLoading) {
    return <CalendarSkeleton />;
  }

  /* =========================================
     ERROR
  ========================================= */

  if (hasError) {
    return (
      <section className="eventCalendar">
        <div className="calendarAccessRestricted">
          <div className="calendarAccessIcon">
            <FaLock />
          </div>

          <h2>Calendar Access Restricted</h2>

          <p>
            You don't have permission to create or manage
            <br />
            this type of calendar event.
          </p>

          <button
            type="button"
            className="calendarAccessBackBtn"
            onClick={handleGoBack}
          >
            <FaArrowLeft />
            <span>Go Back</span>
          </button>
        </div>
      </section>
    );
  }

  /* =========================================
     CALENDAR
  ========================================= */

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
        weekendCount={weekendCount}
      />

      <div className="calendarBody">
        <CalendarGrid
          currentDate={currentDate}
          selectedDate={selectedDate}
          selectDate={selectDate}
          events={filteredEvents}
          showWeekends={Boolean(filters[EVENT_TYPES.WEEKEND])}
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
          employees={calendarEmployees}
          isAdmin={isAdmin}
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

import "./EventCalendar.css";

import { useMemo, useState, useCallback, useEffect } from "react";

import useCalendar from "../../hooks/useCalendar";
import useEventFilter from "../../hooks/useEventFilter";

import { events } from "../../data/events";
import { holidayData } from "../../data/holidays";

import CalendarHeader from "./CalendarHeader/CalendarHeader";
import CalendarGrid from "./CalendarGrid/CalendarGrid";
import CalendarSidebar from "./CalendarSidebar/CalendarSidebar";
import EventFilters from "./EventFilters/EventFilters";
import EventModal from "./EventModal/EventModal";
// import CalendarSkeleton from "../Common/CalendarSkeleton/CalendarSkeleton";

export default function EventCalendar() {
    /* ---------------- Calendar Skeleton ---------------- */
    // const { events, loading } = useSelector(
    //     state => state.calendar
    // );
    
    /* ---------------- Calendar ---------------- */

    const {
        currentDate,
        selectedDate,
        selectDate,
        nextMonth,
        previousMonth,
        goToToday,
    } = useCalendar();

    /* ---------------- Events ---------------- */

    const allEvents = useMemo(
        () => [...events, ...holidayData],
        []
    );

    /* ---------------- Modal ---------------- */

    const [selectedEvent, setSelectedEvent] = useState(null);

    const handleEventClick = useCallback((event) => {
        setSelectedEvent(event);
    }, []);

    const handleCloseModal = useCallback(() => {
        setSelectedEvent(null);
    }, []);

    /* ---------------- Filters ---------------- */

    const {
        filters,
        searchTerm,
        setSearchTerm,
        toggleFilter,
        selectAll,
        clearAll,
        filteredEvents,
    } = useEventFilter(allEvents);

            // if (loading) {
            //      return <CalendarSkeleton />;
            // }
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

            <EventModal
                event={selectedEvent}
                onClose={handleCloseModal}
            />
        
        </section>
        
    );
}
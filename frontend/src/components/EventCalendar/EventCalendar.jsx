import "./EventCalendar.css";

import { useState } from "react";

import useCalendar from "../../hooks/useCalendar";
import useEventFilter from "../../hooks/useEventFilter";

import { events } from "../../data/events";
import { holidayData } from "../../data/holidays";

import CalendarHeader from "./CalendarHeader/CalendarHeader";
import CalendarGrid from "./CalendarGrid/CalendarGrid";
import CalendarSidebar from "./CalendarSidebar/CalendarSidebar";
import EventFilters from "./EventFilters/EventFilters";
import EventModal from "./EventModal/EventModal";

export default function EventCalendar() {

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

    const allEvents = [

        ...events,

        ...holidayData,

    ];

    /* ---------------- Modal ---------------- */

    const [

        selectedEvent,

        setSelectedEvent,

    ] = useState(null);

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

                    onEventClick={setSelectedEvent}

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

                    onEventClick={setSelectedEvent}

                />

            </div>

            <EventModal

                event={selectedEvent}

                onClose={() => setSelectedEvent(null)}

            />

        </section>

    );

}
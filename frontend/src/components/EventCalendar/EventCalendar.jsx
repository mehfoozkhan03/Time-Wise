import { useState } from "react";
import "./EventCalendar.css";

import CalendarHeader from "./CalendarHeader/CalendarHeader";
import CalendarGrid from "./CalendarGrid/CalendarGrid";
import EventModal from "./EventModal/EventModal";
import { EVENT_CONFIG } from "../EventCalendar/data/eventConfig.js";
import EventFilters from "./EventFilters/EventFilters";
import { events } from "../data/events";
import { holidayData } from "../data/holidayData";

import UpcomingEvents from "./UpcomingEvents/UpcomingEvents";

export default function EventCalendar() {

    const today = new Date();

    const allEvents = [...events, ...holidayData];

    const [currentDate, setCurrentDate] = useState(today);

    const [selectedEvent, setSelectedEvent] = useState(null);

    const [searchTerm, setSearchTerm] = useState("");

    const [filters,setFilters] = useState(

        Object.keys(EVENT_CONFIG).reduce((acc,key)=>{

            acc[key]=true;

            return acc;

        },{})

    );

    return (

        <section className="eventCalendar">

            <CalendarHeader
                currentDate={currentDate}
                setCurrentDate={setCurrentDate}
            />
            <EventFilters
            filters={filters}
            setFilters={setFilters}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            />

            <div className="calendarBody">

                <CalendarGrid
                    currentDate={currentDate}
                    filters={filters}
                    searchTerm={searchTerm}
                    onEventClick={setSelectedEvent}
                />

            </div>

            <UpcomingEvents

                events={allEvents}

            />

            <EventModal
                event={selectedEvent}
                onClose={() => setSelectedEvent(null)}
            />

        </section>

    );
}
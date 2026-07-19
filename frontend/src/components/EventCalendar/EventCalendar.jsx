import { useState } from "react";
import "./EventCalendar.css";

import CalendarHeader from "./CalendarHeader/CalendarHeader";
import CalendarGrid from "./CalendarGrid/CalendarGrid";
import EventModal from "./EventModal/EventModal";

export default function EventCalendar() {

    const today = new Date();

    const [currentDate, setCurrentDate] = useState(today);

    const [selectedEvent, setSelectedEvent] = useState(null);

    return (

        <section className="eventCalendar">

            <CalendarHeader
                currentDate={currentDate}
                setCurrentDate={setCurrentDate}
            />

            <div className="calendarBody">

                <CalendarGrid
                    currentDate={currentDate}
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
import "./CalendarSidebar.css";

import MiniCalendar from "../MiniCalendar/MiniCalendar";
import UpcomingEvents from "../UpcomingEvents/UpcomingEvents";
import EventLegend from "../EventLegend/EventLegend";
import TodaySummary from "../TodaySummary/TodaySummary";

export default function CalendarSidebar({

    currentDate,

    selectedDate,

    selectDate,

    previousMonth,

    nextMonth,

    events,

    filters,

    toggleFilter,

    onEventClick,

}) {

    return (

        <aside className="calendarSidebar">

            <MiniCalendar

                currentDate={currentDate}

                selectedDate={selectedDate}

                selectDate={selectDate}

                previousMonth={previousMonth}

                nextMonth={nextMonth}

            />

            <UpcomingEvents

                events={events}

                onEventClick={onEventClick}

            />

            <EventLegend

                filters={filters}

                toggleFilter={toggleFilter}

            />

            <TodaySummary

                events={events}

            />

        </aside>

    );

}
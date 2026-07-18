import "./CalendarGrid.css";

import CalendarDay from "../CalendarDay/CalendarDay";

import {

    WEEK_DAYS,

    generateCalendar,

    isSameDate,

} from "../../../utils/calendarUtils";

export default function CalendarGrid({
    currentDate,

    selectedDate,

    selectDate,

    events,

    onEventClick,

}) {

    const calendar = generateCalendar(currentDate);

    return (

        <section className="calendarWrapper">

            <div className="weekHeader">

                {

                    WEEK_DAYS.map((day) => (

                        <div key={day}>

                            {day}

                        </div>

                    ))

                }

            </div>

            <div className="calendarGrid">

                {

                    calendar.map((item) => {

                        const dayEvents = events.filter(

                            (event) =>

                                event.date ===

                                item.date

                                    .toISOString()

                                    .split("T")[0]

                        );

                        return (

                            <CalendarDay

                                key={item.date.toISOString()}

                                day={item.date}

                                events={dayEvents}

                                isCurrentMonth={item.currentMonth}

                                isToday={item.isToday}

                                isSelected={

                                    isSameDate(

                                        item.date,

                                        selectedDate

                                    )

                                }

                                onSelectDate={selectDate}

                                onEventClick={onEventClick}

                            />

                        );

                    })

                }

            </div>

        </section>

    );

}
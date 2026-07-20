import "./CalendarDay.css";

import EventBadge from "../EventBadge/EventBadge";

export default function CalendarDay({

    day,

    events,

    isCurrentMonth,

    isToday,

    isSelected,

    onSelectDate,

    onEventClick,

}) {

    return (

        <div

            className={`calendarDay
                ${!isCurrentMonth ? "otherMonth" : ""}
                ${isToday ? "today" : ""}
                ${isSelected ? "selected" : ""}
            `}

            onClick={() => onSelectDate(day)}

        >

            <div className="dayHeader">

                <span className="dayNumber">

                    {day.getDate()}

                </span>

            </div>

            <div className="dayEvents">

                {

                    events.length === 0 ?

                        <div className="emptyEvents">

                        </div>

                        :

                        events.slice(0,3).map((event)=>(

                            <div

                                key={event.id}

                                onClick={(e)=>{

                                    e.stopPropagation();

                                    onEventClick(event);

                                }}

                            >

                                <EventBadge

                                    event={event}
                                    onClick={() => onEventClick(event)}
                                />

                            </div>

                        ))

                }

                {

                    events.length > 3 && (

                        <div className="moreEvents">

                            +{events.length-3} More

                        </div>

                    )

                }

            </div>

        </div>

    );

}
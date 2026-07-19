import "./CalendarDay.css";

import EventBadge from "../EventBadge/EventBadge";

export default function CalendarDay({
    day,
    isCurrentMonth,
    isToday,
    isSelected,
    onSelectDate,
    events = [],
    onEventClick
}) {
  const handleClick = () => {
    if (!day) return;

    if (onSelectDate) {
      onSelectDate(day);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`
        calendarDay
        ${!isCurrentMonth ? "otherMonth" : ""}
        ${isToday ? "today" : ""}
        ${isSelected ? "selectedDay" : ""}
      `}
    >
      {/* Date Number */}

      <div className="calendarDate">

        <span>{day.getDate()}</span>

      </div>

      {/* Events */}

        <div className="calendarEvents">

            {

                events
                    .slice(0,3)
                    .map((event)=>{

                        return(

                            <EventBadge

                                key={event.id}

                                event={event}

                                onClick={() => onEventClick(event)}
                            />

                        );

                    })

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
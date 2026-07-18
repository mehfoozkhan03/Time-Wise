import "./CalendarGrid.css";

import CalendarDay from "../CalendarDay/CalendarDay";
import { events } from "../data/events";
import { holidayData } from "../data/holidays";

export default function CalendarGrid({ currentDate, filters, onEventClick }) {

  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();

  const allEvents = [...events, ...holidayData];

  // First day of current month
  const firstDay = new Date(year, month, 1);

  // Last date of current month
  const lastDate = new Date(year, month + 1, 0).getDate();

  // Sunday = 0, Monday = 1...
  const startDay = firstDay.getDay();

const dayEvents = day

? allEvents.filter((event)=>{

    const sameDate =

        event.date===day.toISOString().split("T")[0];

    const typeMatch =

        filters[event.type];

      const searchMatch =

          !searchTerm ||

          event.employee?.toLowerCase().includes(

              searchTerm.toLowerCase()

          );

      return sameDate && typeMatch && searchMatch;

  })

  :[];

  // Empty cells before the 1st
  for (let i = 0; i < startDay; i++) {
    days.push(null);
  }

  // Current month dates
  for (let i = 1; i <= lastDate; i++) {
    days.push(new Date(year, month, i));
  }
  

  return (
    <>
      {/* Week Names */}
      <div className="weekHeader">
        <div>Sun</div>
        <div>Mon</div>
        <div>Tue</div>
        <div>Wed</div>
        <div>Thu</div>
        <div>Fri</div>
        <div>Sat</div>
      </div>

      {/* Calendar Grid */}
      <div className="calendarGrid">

        {days.map((day, index) => {

          const today = new Date();

          const isToday =
            day &&
            day.getDate() === today.getDate() &&
            day.getMonth() === today.getMonth() &&
            day.getFullYear() === today.getFullYear();

          const dayEvents = day
          ? allEvents.filter((event) => {

              return (
                event.date === day.toISOString().split("T")[0]
              );

            })
          : [];


          return (
            <CalendarDay
                key={index}
                day={day.date}
                isCurrentMonth={day.currentMonth}
                isToday={day.isToday}
                events={dayEvents}
                onEventClick={onEventClick}
                // key={index}
                // day={day}
                // isCurrentMonth={true}
                // isToday={isToday}
                // events={dayEvents}
            />
          );
        })}

      </div>
    </>
  );
}
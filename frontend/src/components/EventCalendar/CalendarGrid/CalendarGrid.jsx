import "./CalendarGrid.css";

import { useMemo } from "react";

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
    const calendar = useMemo(
        () => generateCalendar(currentDate),
        [currentDate]
    );

    const eventsByDate = useMemo(() => {
        const map = new Map();

        for (const event of events) {
            const list = map.get(event.date);

            if (list) {
                list.push(event);
            } else {
                map.set(event.date, [event]);
            }
        }

        return map;
    }, [events]);

    return (
        <section className="calendarWrapper">
            <div className="weekHeader">
                {WEEK_DAYS.map((day) => (
                    <div key={day}>
                        {day}
                    </div>
                ))}
            </div>

            <div className="calendarGrid">
                {calendar.map((item) => {
                    const dateKey = item.date
                        .toISOString()
                        .split("T")[0];

                    const dayEvents =
                        eventsByDate.get(dateKey) ?? [];

                    return (
                        <CalendarDay
                            key={dateKey}
                            day={item.date}
                            events={dayEvents}
                            isCurrentMonth={item.currentMonth}
                            isToday={item.isToday}
                            isSelected={isSameDate(
                                item.date,
                                selectedDate
                            )}
                            onSelectDate={selectDate}
                            onEventClick={onEventClick}
                        />
                    );
                })}
            </div>
        </section>
    );
}
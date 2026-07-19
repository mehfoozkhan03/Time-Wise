import "./MiniCalendar.css";

import { memo, useMemo } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

import Card from "../../Common/Card/Card";

import {
    WEEK_DAYS,
    generateCalendar,
    getMonthName,
    isSameDate,
} from "../../../utils/calendarUtils";

function MiniCalendar({
    currentDate,
    selectedDate,
    selectDate,
    previousMonth,
    nextMonth,
}) {
    const days = useMemo(
        () => generateCalendar(currentDate),
        [currentDate]
    );

    return (
        <Card className="miniCalendarCard">

            <div className="miniHeader">

                <button
                    type="button"
                    onClick={previousMonth}
                    aria-label="Previous Month"
                >
                    <FaChevronLeft />
                </button>

                <h3>
                    {getMonthName(currentDate)} {currentDate.getFullYear()}
                </h3>

                <button
                    type="button"
                    onClick={nextMonth}
                    aria-label="Next Month"
                >
                    <FaChevronRight />
                </button>

            </div>

            <div className="miniWeekDays">

                {WEEK_DAYS.map(day => (
                    <span key={day}>
                        {day.charAt(0)}
                    </span>
                ))}

            </div>

            <div className="miniGrid">

                {days.map(day => (

                    <button
                        key={day.date.toISOString()}
                        type="button"
                        onClick={() => selectDate(day.date)}
                        className={[
                            "miniDay",
                            !day.currentMonth && "otherMonth",
                            day.isToday && "today",
                            isSameDate(day.date, selectedDate) && "selected",
                        ]
                            .filter(Boolean)
                            .join(" ")}
                    >

                        {day.date.getDate()}

                    </button>

                ))}

            </div>

        </Card>
    );
}

export default memo(MiniCalendar);
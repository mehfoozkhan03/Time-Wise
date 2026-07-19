import "./MiniCalendar.css";

import {

    FaChevronLeft,

    FaChevronRight,

    FaCalendarAlt,

} from "react-icons/fa";

import Card from "../../Common/Card/Card";

import {

    WEEK_DAYS,

    generateCalendar,

    getMonthName,

    isSameDate,

} from "../../../utils/calendarUtils";

export default function MiniCalendar({

    currentDate,

    selectedDate,

    selectDate,

    previousMonth,

    nextMonth,

}) {

    const days = generateCalendar(currentDate);

    return (

        <Card

            title="Mini Calendar"

            icon={<FaCalendarAlt />}

        >

            <div className="miniHeader">

                <button onClick={previousMonth}>

                    <FaChevronLeft />

                </button>

                <h3>

                    {getMonthName(currentDate)}

                    {" "}

                    {currentDate.getFullYear()}

                </h3>

                <button onClick={nextMonth}>

                    <FaChevronRight />

                </button>

            </div>

            <div className="miniWeekDays">

                {

                    WEEK_DAYS.map((day) => (

                        <span key={day}>

                            {day[0]}

                        </span>

                    ))

                }

            </div>

            <div className="miniGrid">

                {

                    days.map((item, index) => (

                        <button

                            key={index}

                            className={`miniDay

                                ${!item.currentMonth ? "otherMonth" : ""}

                                ${item.isToday ? "today" : ""}

                                ${isSameDate(item.date, selectedDate) ? "selected" : ""}

                            `}

                            onClick={() => selectDate(item.date)}

                        >

                            {item.date.getDate()}

                        </button>

                    ))

                }

            </div>

        </Card>

    );

}
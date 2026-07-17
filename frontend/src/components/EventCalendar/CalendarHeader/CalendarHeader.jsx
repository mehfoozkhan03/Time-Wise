import "./CalendarHeader.css";

import {

    FaChevronLeft,
    FaChevronRight,
    FaCalendarAlt

} from "react-icons/fa";

export default function CalendarHeader({

    currentDate,
    setCurrentDate

}) {

    const month = currentDate.toLocaleString("default", {

        month:"long"

    });

    const year = currentDate.getFullYear();

    function nextMonth(){

        setCurrentDate(

            new Date(

                year,

                currentDate.getMonth()+1,

                1

            )

        );

    }

    function previousMonth(){

        setCurrentDate(

            new Date(

                year,

                currentDate.getMonth()-1,

                1

            )

        );

    }

    function today(){

        setCurrentDate(

            new Date()

        );

    }

    return(

        <div className="calendarHeader">

            <div className="calendarTitle">

                <FaCalendarAlt/>

                <h2>

                    {month} {year}

                </h2>

            </div>

            <div className="calendarActions">

                <button
                    onClick={previousMonth}
                    className="calendarBtn"
                >

                    <FaChevronLeft/>

                </button>

                <button
                    onClick={today}
                    className="todayBtn"
                >

                    Today

                </button>

                <button
                    onClick={nextMonth}
                    className="calendarBtn"
                >

                    <FaChevronRight/>

                </button>

            </div>

        </div>

    );

}
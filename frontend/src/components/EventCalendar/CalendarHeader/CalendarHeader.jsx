import "./CalendarHeader.css";

import {
  FaChevronLeft,
  FaChevronRight,
  FaCalendarDay,
} from "react-icons/fa";

import { getMonthName } from "../../../utils/calendarUtils";

export default function CalendarHeader({

  currentDate,

  previousMonth,

  nextMonth,

  goToToday,

}) {

  return (

    <div className="calendarHeader">

      <div className="headerTitle">

        <h2>

          {getMonthName(currentDate)} {currentDate.getFullYear()}

        </h2>

      </div>

      <div className="headerActions">

        <button

          onClick={previousMonth}

          className="navBtn"

        >

          <FaChevronLeft />

        </button>

        <button

          onClick={goToToday}

          className="todayBtn"

        >

          <FaCalendarDay />

          Today

        </button>

        <button

          onClick={nextMonth}

          className="navBtn"

        >

          <FaChevronRight />

        </button>

      </div>

    </div>

  );

}
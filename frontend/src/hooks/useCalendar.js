import { useState } from "react";

import {

  getNextMonth,

  getPreviousMonth,

} from "../utils/calendarUtils";

export default function useCalendar() {

  const [currentDate, setCurrentDate] = useState(new Date());

  const [selectedDate, setSelectedDate] = useState(new Date());

  const nextMonth = () => {

    setCurrentDate((prev) => getNextMonth(prev));

  };

  const previousMonth = () => {

    setCurrentDate((prev) => getPreviousMonth(prev));

  };

  const goToToday = () => {

    const today = new Date();

    setCurrentDate(today);

    setSelectedDate(today);

  };

  const selectDate = (date) => {

      setSelectedDate(date);

      setCurrentDate(

          new Date(

              date.getFullYear(),

              date.getMonth(),

              1

          )

      );

  };

    return {

        currentDate,

        selectedDate,

        nextMonth,

        previousMonth,

        goToToday,

        selectDate,

    };

}
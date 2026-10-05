import { useState, useCallback } from "react";

import { getNextMonth, getPreviousMonth } from "../utils/calendarUtils";

function getToday() {
  const today = new Date();

  today.setHours(0, 0, 0, 0);

  return today;
}

export default function useCalendar() {
  /* =========================================
     State
  ========================================= */

  const [currentDate, setCurrentDate] = useState(() => getToday());

  const [selectedDate, setSelectedDate] = useState(() => getToday());

  /* =========================================
     Next Month
  ========================================= */

  const nextMonth = useCallback(() => {
    setCurrentDate((prev) => getNextMonth(prev));
  }, []);

  /* =========================================
     Previous Month
  ========================================= */

  const previousMonth = useCallback(() => {
    setCurrentDate((prev) => getPreviousMonth(prev));
  }, []);

  /* =========================================
     Go To Today
  ========================================= */

  const goToToday = useCallback(() => {
    const today = getToday();

    setCurrentDate(today);
    setSelectedDate(today);
  }, []);

  /* =========================================
     Select Date
  ========================================= */

  const selectDate = useCallback((date) => {
    if (!(date instanceof Date)) {
      return;
    }

    const selected = new Date(date);

    selected.setHours(0, 0, 0, 0);

    setSelectedDate(selected);

    setCurrentDate(new Date(selected.getFullYear(), selected.getMonth(), 1));
  }, []);

  return {
    currentDate,
    selectedDate,
    nextMonth,
    previousMonth,
    goToToday,
    selectDate,
  };
}

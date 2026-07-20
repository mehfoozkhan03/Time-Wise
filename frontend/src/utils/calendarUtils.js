// Week Days
export const WEEK_DAYS = [
  "Sun",
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
];

// Month Name
export const getMonthName = (date) => {
  return date.toLocaleString("default", {
    month: "long",
  });
};

// Days in Month
export const getDaysInMonth = (year, month) => {
  return new Date(year, month + 1, 0).getDate();
};

// First Day of Month
export const getFirstDayOfMonth = (year, month) => {
  return new Date(year, month, 1).getDay();
};

// Previous Month
export const getPreviousMonth = (date) => {
  return new Date(
    date.getFullYear(),
    date.getMonth() - 1,
    1
  );
};

// Next Month
export const getNextMonth = (date) => {
  return new Date(
    date.getFullYear(),
    date.getMonth() + 1,
    1
  );
};

// Compare Dates
export const isSameDate = (date1, date2) => {
  if (!date1 || !date2) return false;

  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
};

// Today Check
export const isToday = (date) => {
  return isSameDate(date, new Date());
};

/**
 * Generate 42 Calendar Cells
 * (6 rows × 7 columns)
 */
export const generateCalendar = (currentDate) => {

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = getFirstDayOfMonth(year, month);
  const totalDays = getDaysInMonth(year, month);

  const prevMonthDays = getDaysInMonth(year, month - 1);

  const calendar = [];

  // Previous Month
  for (let i = firstDay - 1; i >= 0; i--) {

    calendar.push({

      date: new Date(year, month - 1, prevMonthDays - i),

      currentMonth: false,

      isToday: false,

    });

  }

  // Current Month
  for (let i = 1; i <= totalDays; i++) {

    const date = new Date(year, month, i);

    calendar.push({

      date,

      currentMonth: true,

      isToday: isToday(date),

    });

  }

  // Next Month
  while (calendar.length < 42) {

    const nextDate = calendar.length - (firstDay + totalDays) + 1;

    calendar.push({

      date: new Date(year, month + 1, nextDate),

      currentMonth: false,

      isToday: false,

    });

  }

  return calendar;

};
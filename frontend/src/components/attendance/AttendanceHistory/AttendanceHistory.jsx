import { useEffect, useState } from 'react'
import './AttendanceHistory.css'
import {FaChevronLeft, FaChevronRight, FaCalendarAlt,} from "react-icons/fa";

import useAttendance from '../../../hooks/useAttendance'

export default function AttendanceHistory() {
  const { history, loading, error, fetchAttendanceHistory } = useAttendance()

  useEffect(() => {
    fetchAttendanceHistory()
  }, [])

  function formatDate(date) {
    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  }

  function formatTime(time) {
    if (!time) return '--'

    return new Date(time).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  function formatDuration(seconds = 0) {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)

    

    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
  }

   const groupedHistory = history.reduce((acc, record) => {
    const month = new Date(record.date).toLocaleString("en-IN", {
      month: "long",
      year: "numeric",
    });

    if (!acc[month]) {
      acc[month] = [];
    }

    acc[month].push(record);

    return acc;
  }, {});
  

const months = Object.keys(groupedHistory);

const [currentIndex, setCurrentIndex] = useState(-1);

// Jab months load ho jaye to latest month select karo
useEffect(() => {
  if (months.length > 0) {
    setCurrentIndex(months.length - 1);
  }
}, [months.length]);

const currentMonth =
currentIndex >= 0 ? months[currentIndex] : null;


const previousMonth = () => {
  setCurrentIndex((prev) => {
    if (prev > 0) {
      return prev - 1;
    }
    return prev;
  });
};

const nextMonth = () => {
  setCurrentIndex((prev) => {
    if (prev < months.length - 1) {
      return prev + 1;
    }
    return prev;
  });
};

  return (
    <section className="attendance_history">
      <div className="attendance_history_header">
        <div>
          <h2>Attendance History</h2>
          <p>Your previous attendance records.</p>
        </div>
      </div>


      {loading && (
        <div className="attendance_history_empty">
          Loading attendance history...
        </div>
      )}

      {!loading && error && (
        <div className="attendance_history_empty">{error}</div>
      )}

      {!loading && !error && history.length === 0 && (
        <div className="attendance_history_empty">
          No attendance records found.
        </div>
      )}

      

  {!loading && !error && currentMonth && (
  <>
  <div className="attendance_month_header">

    <div className="month_title">
      <h2>{currentMonth}</h2>
    </div>

    <div className="month_actions">
<button
  className="month_btn"
  onClick={previousMonth}
  disabled={currentIndex <= 0}
>
  <FaChevronLeft />
</button>

<button
  className="today_btn"
  onClick={() => setCurrentIndex(months.length - 1)}
>
  <FaCalendarAlt />
  Today
</button>

<button
  className="month_btn"
  onClick={nextMonth}
  disabled={currentIndex >= months.length - 1}
>
  <FaChevronRight />
</button>

    </div>

  </div>

  <div className="attendance_table_wrapper">
    <table className="attendance_table">

      <thead>
        <tr>
          <th>Date</th>
          <th>Check In</th>
          <th>Check Out</th>
          <th>Working</th>
          <th>Break</th>
          <th>Status</th>
        </tr>
      </thead>

     <tbody>
  {currentMonth &&
    groupedHistory[currentMonth]?.map((record) => (
      <tr key={record._id}>
        <td>{formatDate(record.date)}</td>
        <td>{formatTime(record.checkInTime)}</td>
        <td>{formatTime(record.checkOutTime)}</td>
        <td>{formatDuration(record.totalWorkingSeconds)}</td>
        <td>{formatDuration(record.totalBreakSeconds)}</td>
        <td>
          <span className="attendance_status">
            {record.status}
          </span>
        </td>
      </tr>
    ))}
</tbody>

    </table>
  </div>
  </>
)}
    </section>
  )
}

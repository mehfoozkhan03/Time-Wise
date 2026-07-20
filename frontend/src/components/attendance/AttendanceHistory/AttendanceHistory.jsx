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

const [currentIndex, setCurrentIndex] = useState(0);

const currentMonth = months[currentIndex];

useEffect(() => {
  if (months.length > 0 && currentIndex >= months.length) {
    setCurrentIndex(months.length - 1);
  }
}, [months.length]);


const previousMonth = () => {
  console.log("Previous Click");
  console.log(currentIndex);

  if (currentIndex > 0) {
    setCurrentIndex((prev) => prev - 1);
  }
};

const nextMonth = () => {
  console.log("Next Click");
  console.log(currentIndex);

  if (currentIndex < months.length - 1) {
    setCurrentIndex((prev) => prev + 1);
  }
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

    <div className="month_indicator">
      <span></span>
    </div>

    <div className="month_actions">

      <button
        className="month_btn"
        onClick={previousMonth}
        disabled={currentIndex === 0}
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
        disabled={currentIndex === months.length - 1}
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
        {groupedHistory[currentMonth].map((record) => (
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

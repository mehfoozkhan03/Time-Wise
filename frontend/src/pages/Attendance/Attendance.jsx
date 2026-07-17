import './Attendance.css'

import TodayWork from '../../components/attendance/TodayWork/TodayWork'
import AttendanceHistory from '../../components/attendance/AttendanceHistory/AttendanceHistory'

export default function Attendance() {
  return (
    <main className="attendance_page container fade_in">
      <header className="attendance_header">
        <h1>Attendance</h1>

        <p>
          Manage today's attendance and review your previous attendance records.
        </p>
      </header>

      <section className="attendance_today">
        <TodayWork />
      </section>

      <section className="attendance_history_wrapper">
        <AttendanceHistory />
      </section>
    </main>
  )
}

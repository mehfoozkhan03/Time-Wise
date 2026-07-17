import './AttendanceHistory.css'

export default function AttendanceHistory() {
  return (
    <section className="attendance_history">
      <div className="attendance_history_header">
        <h2>Attendance History</h2>

        <p>Your previous attendance records.</p>
      </div>

      <div className="attendance_history_empty">No attendance records yet.</div>
    </section>
  )
}

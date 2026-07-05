import "./TodayWork.css";

import Card from "../../Card/Card";
import useAttendance from "../../../hooks/useAttendance";

import { FaCircle, FaClock, FaCoffee, FaCalendarCheck } from "react-icons/fa";

export default function TodayWork() {
  const {
    attendance,
    checkIn,
    startBreak,
    endBreak,
    checkOut,
    sessionTime,
    workingTime,
    breakTime,
  } = useAttendance();

  function renderButton() {
    switch (attendance.status) {
      case "idle":
        return (
          <button className="today_work_button check_in" onClick={checkIn}>
            Check In
          </button>
        );

      case "working":
        return (
          <button className="today_work_button break" onClick={startBreak}>
            Take Break
          </button>
        );

      case "break":
        return (
          <button className="today_work_button resume" onClick={endBreak}>
            Resume Work
          </button>
        );

      case "checkedout":
        return (
          <button className="today_work_button finished" disabled>
            Completed
          </button>
        );

      default:
        return (
          <button className="today_work_button checkout" onClick={checkOut}>
            Check Out
          </button>
        );
    }
  }

  function getStatus() {
    switch (attendance.status) {
      case "idle":
        return "Not Checked In";

      case "working":
        return "Working";

      case "break":
        return "On Break";

      case "checkedout":
        return "Checked Out";

      default:
        return "";
    }
  }

  return (
    <Card className="today_work_card" id="tour-today-work">
      <div className="today_work_header">
        <h2>Today's Work</h2>

        <div className={`status ${attendance.status}`}>
          <FaCircle />
          {getStatus()}
        </div>
      </div>

      <div className="today_work_grid">
        <div className="today_work_item">
          <FaCalendarCheck />
          <div>
            <span>Checked In</span>
            <strong>
              {attendance.checkInTime
                ? attendance.checkInTime.toLocaleTimeString()
                : "--:--"}
            </strong>
          </div>
        </div>

        <div className="today_work_item">
          <FaClock />
          <div>
            <span>Current Session</span>
            <strong>{sessionTime}</strong>
          </div>
        </div>

        <div className="today_work_item">
          <FaCoffee />
          <div>
            <span>Break Used</span>
            <strong>{breakTime}</strong>
          </div>
        </div>

        <div className="today_work_item">
          <FaClock />
          <div>
            <span>Working Hours</span>
            <strong>{workingTime}</strong>
          </div>
        </div>
      </div>

      <div className="today_work_action">
        {attendance.status !== "checkedout" && renderButton()}
      </div>
    </Card>
  );
}

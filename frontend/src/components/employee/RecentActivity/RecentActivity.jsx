import useAttendance from "../../../hooks/useAttendance";
import "./RecentActivity.css";

export default function RecentActivity() {
  const { attendance } = useAttendance();

  const checkInTime = () => {
    return attendance?.checkInTime
      ? new Date(attendance.checkInTime).toLocaleTimeString()
      : "--:--";
  };

  const breakStart = () => {
    return attendance?.breaks?.[0]?.breakStart
      ? new Date(attendance.breaks[0].breakStart).toLocaleTimeString()
      : "--:--";
  };
  
  const breakEnd = () => {
    return attendance?.breaks?.[0]?.breakEnd
      ? new Date(attendance.breaks[0].breakEnd).toLocaleTimeString()
      : "--:--";
  };

  const checkOut = () => {
    return attendance?.checkOutTime
      ? new Date(attendance.checkOutTime).toLocaleTimeString()
      : "--:--";
  };

  const activities = [
    {
      title: "Checked In",
      time: checkInTime(),
    },
    {
      title: "Break Started",
      time: breakStart(),
    },
    {
      title: "Break Ended",
      time: breakEnd(),
    },
    {
      title: "Checked Out",
      time: checkOut(),
    },
  ];

  return (
    <section className="recent_activity">
      <div className="section_header">
        <h2>Recent Activity</h2>
      </div>

      <div className="activity_list">
        {activities.map((activity, index) => (
          <div
            className="activity_item"
            key={index}
          >
            <div className="activity_dot" />

            <div className="activity_content">
              <h4>{activity.title}</h4>

              <span>{activity.time}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

import useAttendance from "../../../hooks/useAttendance";
import Skeleton from "../../Skeleton/Skeleton";
import "./RecentActivity.css";

export default function RecentActivity() {
  const { attendance, loading } = useAttendance();

  const checkInTime = () => {
    return attendance?.checkInTime
      ? new Date(attendance.checkInTime).toLocaleTimeString()
      : "--:--";
  };

  const breakStart = () => {
    return attendance?.breaks?.[0]?.breakStart
      ? new Date(
          attendance.breaks[0].breakStart
        ).toLocaleTimeString()
      : "--:--";
  };

  const breakEnd = () => {
    return attendance?.breaks?.[0]?.breakEnd
      ? new Date(
          attendance.breaks[0].breakEnd
        ).toLocaleTimeString()
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

  // Skeleton Loader
  if (loading) {
    return (
      <section className="recent_activity recent-activity-skeleton">
        <div className="section_header">
          <Skeleton width="160px" height="24px" />
        </div>

        <div className="activity_list">
          {[1, 2, 3, 4].map((item) => (
            <div className="activity_item" key={item}>
              <div className="activity_dot">
                <Skeleton
                  width="12px"
                  height="12px"
                  radius="50%"
                />
              </div>

              <div className="activity_content">
                <Skeleton width="125px" height="17px" />

                <div className="recent-activity-skeleton-time">
                  <Skeleton width="85px" height="14px" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="recent_activity">
      <div className="section_header">
        <h2>Recent Activity</h2>
      </div>

      <div className="activity_list">
        {activities.map((activity, index) => (
          <div className="activity_item" key={index}>
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

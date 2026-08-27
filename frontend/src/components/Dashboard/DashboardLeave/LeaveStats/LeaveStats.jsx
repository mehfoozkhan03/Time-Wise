import "./LeaveStats.css";

import {
  FaClipboardList,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";

export default function LeaveStats({
  statistics,
  requests = [],
}) {
  const totalRequests =
    statistics?.total ?? requests.length;

  const pendingRequests =
    statistics?.pending ??
    requests.filter(
      (request) => request.status === "Pending"
    ).length;

  const approvedRequests =
    statistics?.approved ??
    requests.filter(
      (request) => request.status === "Approved"
    ).length;

  const rejectedRequests =
    statistics?.rejected ??
    requests.filter(
      (request) => request.status === "Rejected"
    ).length;

  const stats = [
    {
      id: 1,
      title: "Total Requests",
      value: totalRequests,
      icon: <FaClipboardList />,
      className: "total",
    },
    {
      id: 2,
      title: "Pending",
      value: pendingRequests,
      icon: <FaClock />,
      className: "pending",
    },
    {
      id: 3,
      title: "Approved",
      value: approvedRequests,
      icon: <FaCheckCircle />,
      className: "approved",
    },
    {
      id: 4,
      title: "Rejected",
      value: rejectedRequests,
      icon: <FaTimesCircle />,
      className: "rejected",
    },
  ];

  return (
    <div className="leave_stats">
      {stats.map((stat) => (
        <div
          className={`leave_stat_card ${stat.className}`}
          key={stat.id}
        >
          <div className="leave_stat_content">
            <span className="leave_stat_title">
              {stat.title}
            </span>

            <h3 className="leave_stat_value">
              {stat.value}
            </h3>
          </div>

          <div className="leave_stat_icon">
            {stat.icon}
          </div>
        </div>
      ))}
    </div>
  );
}
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import "./LeaveStats.css";

import {
  FaClipboardList,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";

import { fetchLeaveStatistics } from "../../../../store/leaveSlice";

const getCount = (statistics, requests, status) => {
  if (statistics) {
    if (status === "total") return statistics.total ?? requests.length;
    return statistics[status] ?? 0;
  }

  if (status === "total") return requests.length;

  return requests.filter((request) => request.status === status).length;
};

export default function LeaveStats({ statistics, requests = [] }) {
  const dispatch = useDispatch();

  const { adminStatistics, adminRequests = [] } = useSelector(
    (state) => state.leave,
  );

  useEffect(() => {
    if (!adminStatistics) {
      dispatch(fetchLeaveStatistics());
    }
  }, [dispatch, adminStatistics]);

  const currentStatistics = adminStatistics ?? statistics;

  const currentRequests = adminRequests.length > 0 ? adminRequests : requests;

  const stats = [
    {
      title: "Total Requests",
      value: getCount(currentStatistics, currentRequests, "total"),
      icon: <FaClipboardList />,
      className: "total",
    },
    {
      title: "Pending",
      value: getCount(currentStatistics, currentRequests, "pending"),
      icon: <FaClock />,
      className: "pending",
    },
    {
      title: "Approved",
      value: getCount(currentStatistics, currentRequests, "approved"),
      icon: <FaCheckCircle />,
      className: "approved",
    },
    {
      title: "Rejected",
      value: getCount(currentStatistics, currentRequests, "rejected"),
      icon: <FaTimesCircle />,
      className: "rejected",
    },
  ];

  return (
    <div className="leave_stats">
      {stats.map((stat) => (
        <div key={stat.title} className={`leave_stat_card ${stat.className}`}>
          <div className="leave_stat_content">
            <span className="leave_stat_title">{stat.title}</span>

            <h3 className="leave_stat_value">{stat.value}</h3>
          </div>

          <div className="leave_stat_icon">{stat.icon}</div>
        </div>
      ))}
    </div>
  );
}

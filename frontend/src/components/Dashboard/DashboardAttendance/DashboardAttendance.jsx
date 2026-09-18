import "./DashboardAttendance.css";
import { getDashboardStats } from "./../../../store/dashboardSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import {
  fetchAllUser,
  fetchTodayAttendance,
} from "../../../store/adminAuthSlice";

export const DashboardAttendance = () => {
  const todayDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const dispatch = useDispatch();

  const { todayAttendance } = useSelector((state) => state.adminAuth);

  useEffect(() => {
    dispatch(getDashboardStats());
    dispatch(fetchTodayAttendance());
    dispatch(fetchAllUser());
  }, [dispatch]);

  const formatDuration = (seconds) => {
    if (!seconds || seconds <= 0) return "0m";

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0 && minutes > 0) {
      return `${hours}h ${minutes}m`;
    }

    if (hours > 0) {
      return `${hours}h`;
    }

    return `${minutes}m`;
  };

  const userAttendance =
    todayAttendance?.map((attendance) => {
      const user = attendance.user;

      return {
        avatar: `${user?.firstName?.charAt(0) || ""}${
          user?.lastName?.charAt(0) || ""
        }`,

        name: `${user?.firstName || ""} ${user?.lastName || ""}`.trim(),

        department: user?.department || "N/A",

        checkIn: attendance.checkInTime
          ? new Date(attendance.checkInTime).toLocaleTimeString("en-IN", {
              hour: "2-digit",
              minute: "2-digit",
            })
          : "--",

        checkOut: attendance.checkOutTime
          ? new Date(attendance.checkOutTime).toLocaleTimeString("en-IN", {
              hour: "2-digit",
              minute: "2-digit",
            })
          : "--",

        breakTime: formatDuration(attendance.totalBreakSeconds),

        workingHours: formatDuration(attendance.totalWorkingSeconds),

        status: attendance.status || "Absent",
      };
    }) || [];

  return (
    <>
      <div className="dashboardAttendance-container">
        <div className="dashboardAttendence-header">
          <h3>Attendance Records</h3>
          <span>Today — {todayDate}</span>
        </div>
        <div className="dashboarAttendance-details">
          <div className="dashboardAttendance-details-head">
            <div>EMPLOYEE</div>
            <div>CHECK IN</div>
            <div>BREAK TIME</div>
            <div>CHECK OUT</div>
            <div>WORKING HOURS</div>
            <div>STATUS</div>
          </div>
          <div className="dashboardAttendance-users">
            {userAttendance &&
              userAttendance.map((el, id) => (
                <div key={id}>
                  <div>
                    <div className="dashboardAttendance-avatar">
                      <span>{el.avatar}</span>
                    </div>
                    <div>
                      <p
                        style={{
                          fontSize: "14px",
                          textTransform: "capitalize",
                        }}
                      >
                        {el.name}
                      </p>
                      <span style={{ fontSize: "11px", opacity: "0.7" }}>
                        {el.department}
                      </span>
                    </div>
                  </div>
                  <div style={{ color: "#4a9f91" }}>{el.checkIn}</div>
                  <div>{el.breakTime}</div>
                  <div>{el.checkOut}</div>
                  <div>{el.workingHours}</div>
                  <div className="dashboardAttendance-status">
                    <div></div>
                    <span>{el.status}</span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </>
  );
};

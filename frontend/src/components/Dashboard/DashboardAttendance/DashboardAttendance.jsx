import "./DashboardAttendance.css";
import { getDashboardStats } from "./../../../store/dashboardSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { PulseDot } from "./../../PulseDot/pulseDot";
import Skeleton from "../../Skeleton/Skeleton";
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

  const { todayAttendance, isLoading } = useSelector((state) => state.adminAuth);

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
            {isLoading && (!todayAttendance || todayAttendance.length === 0) ? (
              [1, 2, 3, 4, 5, 6, 7].map((i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    padding: "14px 16px",
                    borderBottom: i < 7 ? "1px solid var(--border)" : "none",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10, width: "24%" }}>
                    <Skeleton width="36px" height="36px" radius="50%" />
                    <div style={{ display: "flex", flexDirection: "column", gap: 5, flex: 1 }}>
                      <Skeleton width="80%" height="15px" radius="4px" />
                      <Skeleton width="50%" height="12px" radius="4px" />
                    </div>
                  </div>
                  <div style={{ width: "15%" }}><Skeleton width="60px" height="16px" radius="4px" /></div>
                  <div style={{ width: "15%" }}><Skeleton width="50px" height="16px" radius="4px" /></div>
                  <div style={{ width: "15%" }}><Skeleton width="60px" height="16px" radius="4px" /></div>
                  <div style={{ width: "15%" }}><Skeleton width="50px" height="16px" radius="4px" /></div>
                  <div style={{ width: "16%" }}><Skeleton width="80px" height="26px" radius="12px" /></div>
                </div>
              ))
            ) : userAttendance.length > 0 ? (
              userAttendance.map((el, id) => (
                <div key={id}>
                  <div>
                    <div className="dashboardAttendance-avatar">
                      <span>{el.avatar}</span>
                    </div>

                    <div>
                      <p className="dashboardAttendance-userName">
                        {el.name}
                      </p>

                      <span className="dashboardAttendance-department">
                        {el.department}
                      </span>
                    </div>
                  </div>

                  <div className="dashboardAttendance-checkIn">{el.checkIn}</div>

                  <div className="dashboardAttendance-breakTime">{el.breakTime}</div>

                  <div className="dashboardAttendance-checkoutTime">{el.checkOut}</div>

                  <div className="dashboardAttendance-workingHrs">{el.workingHours}</div>

                  <div
                    className={`dashboardAttendance-status ${el.status?.toLowerCase().replace(/\s+/g, "-")}`}
                  >
                    <PulseDot className="attendanceDot"
                      color={
                        el.status?.toLowerCase() === "present"
                          ? "#fff"
                          : el.status?.toLowerCase() === "absent"
                            ? "#fff"
                            : el.status?.toLowerCase() === "late"
                              ? "#fff"
                              : el.status?.toLowerCase() === "half day"
                                ? "#fff"
                                : el.status?.toLowerCase() === "leave"
                                  ? "#fff"
                                  : "#6B7280"
                      }
                    />
                    <span>{el.status}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-attendance">
                <p>No attendance records available for today.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

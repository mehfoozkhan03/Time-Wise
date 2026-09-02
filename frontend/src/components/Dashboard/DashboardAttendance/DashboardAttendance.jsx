import "./DashboardAttendance.css";
import { getDashboardStats } from "./../../../store/dashboardSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

export const DashboardAttendance = () => {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const dispatch = useDispatch();

  const { stats } = useSelector((state) => state.attendance);
  console.log("📊 Dashboard stats:", stats);

  // const userAttendance = stats?.todayAttendanceRecords || [];

  useEffect(() => {
    dispatch(getDashboardStats());
  }, [dispatch]);

  const userAttendance = [
    {
      avatar: "SM",
      name: "Sarah Mitchel",
      department: "Design",
      checkIn: "09:02",
      checkOut: "18:10",
      breakTime: "13:00–13:45",
      workingHours: "8h 23m",
      status: "Present",
    },
    {
      avatar: "SM",
      name: "Sarah Mitchel",
      department: "Design",
      checkIn: "09:02",
      checkOut: "18:10",
      breakTime: "13:00–13:45",
      workingHours: "8h 23m",
      status: "Present",
    },
    {
      avatar: "SM",
      name: "Sarah Mitchel",
      department: "Design",
      checkIn: "09:02",
      checkOut: "18:10",
      breakTime: "13:00–13:45",
      workingHours: "8h 23m",
      status: "Present",
    },
    {
      avatar: "SM",
      name: "Sarah Mitchel",
      department: "Design",
      checkIn: "09:02",
      checkOut: "18:10",
      breakTime: "13:00–13:45",
      workingHours: "8h 23m",
      status: "Present",
    },
    {
      avatar: "SM",
      name: "Sarah Mitchel",
      department: "Design",
      checkIn: "09:02",
      checkOut: "18:10",
      breakTime: "13:00–13:45",
      workingHours: "8h 23m",
      status: "Present",
    },
  ];

  return (
    <>
      <div className="dashboardAttendance-container">
        <div className="dashboardAttendence-header">
          <h3>Attendance Records</h3>
          <span>Today — {today}</span>
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
              userAttendance.map((el) => (
                <div key={el._id}>
                  <div>
                    <div className="dashboardAttendance-avatar">
                      {el.avatar}
                    </div>
                    <div>
                      <p style={{ fontSize: "14px" }}>{el.name}</p>
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

import "./DashboardAttendance.css";

export const DashboardAttendance = () => {
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
          <span>Today — Thursday, June 26, 2026</span>
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
                    <div className="dashboardAttendance-avatar">{el.avatar}</div>
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

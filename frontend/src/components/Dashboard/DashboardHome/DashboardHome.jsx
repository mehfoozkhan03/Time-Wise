import "./DashboardHome.css";

import {
  FaUsers,
  FaLightbulb,
  FaBell,
  FaBullhorn,
  FaChartBar,
} from "react-icons/fa6";
import { FaPlus } from "react-icons/fa";

import { Bar } from "react-chartjs-2";
import { useDispatch, useSelector } from "react-redux";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { fetchAllUser, fetchRecentEmployees } from "../../../store/authSlice";
import { useEffect } from "react";
import { getDashboardStats } from "../../../store/attendanceSlice";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export const DashboardHome = () => {
  const dispatch = useDispatch();
  const { totalUsers, recentEmployees } = useSelector((state) => state.auth);
  console.log("🚀 ~ recentEmployees:", recentEmployees);

  const { stats } = useSelector((state) => state.attendance);

  const totalAbsentToday = (totalUsers || 0) - (stats?.totalPresentToday || 0);

  useEffect(() => {
    dispatch(fetchAllUser());
    dispatch(fetchRecentEmployees());
    dispatch(getDashboardStats());
  }, [dispatch]);

  const cardData = [
    {
      icon: <FaUsers />,
      count: totalUsers,
      title: "Total Employees",
      subTitle: "+3 this month",
      color: "#3a9dcf",
    },
    {
      icon: "✅",
      count: stats?.totalPresentToday ?? 0,
      title: "Present Today",
      subTitle: "83.2% attendance",
      color: "#43746b",
    },
    {
      icon: "❌",
      count: totalAbsentToday,
      title: "Absent Today",
      subTitle: "4 no-shows flagged",
      color: "#df2033",
      backgroundColor: "",
    },
    {
      icon: "☕",
      count: stats?.totalOnBreakToday || 0,
      title: "On Break",
      subTitle: "Average 45 min",
      color: "#f3a823",
    },
    {
      icon: "⏰",
      count: stats?.totalLateCheckInsToday || 0,
      title: "Late Check-ins",
      subTitle: "30 min late today",
      color: "#7270c9",
    },
  ];

  const actionData = [
    {
      icon: <FaPlus style={{ color: "#6954b1" }} />,
      title: "Add Employee",
    },
    {
      icon: <FaBell style={{ color: "#ef9b52" }} />,
      title: "Send Notification",
    },
    {
      icon: <FaLightbulb style={{ color: "#ffc844" }} />,
      title: "Publish Thought",
    },
    {
      icon: <FaBullhorn style={{ color: "#d13673" }} />,
      title: "New Announcement",
    },
    {
      icon: <FaChartBar style={{ color: "#c9d7ba" }} />,
      title: "Generate Report",
    },
  ];

  //# attendance chart
  const weeklyChart = stats?.weeklyAttendanceChart || [];

  const labels = weeklyChart.map((item) => item.day);

  const present = weeklyChart.map((item) => item.present);

  const absent = weeklyChart.map((item) => item.absent);

  const data = {
  labels,
  datasets: [
    {
      label: "Present",
      data: present,
      backgroundColor: "#47b396",
      barThickness: 15,
      maxBarThickness: 15,
      borderRadius: 8,
      borderSkipped: false,
    },
    {
      label: "Absent",
      data: absent,
      backgroundColor: "#df2033",
      barThickness: 15,
      maxBarThickness: 15,
      borderRadius: 8,
      borderSkipped: false,
    },
  ],
};


  const options = {
  responsive: true,

  plugins: {
    legend: {
      display: true,
      position: "top",
    },

    tooltip: {
      backgroundColor: "#1f2937",
      titleColor: "#fff",
      bodyColor: "#fff",
    },
  },

  scales: {
    x: {
      grid: {
        display: false,
      },
    },

    y: {
      beginAtZero: true,
      ticks: {
        precision: 0,
      },
    },
  },
};

  return (
    <>
      <div className="dashboardHome-container">
        <div className="card-thought-container">
          <div className="home-card-container">
            {cardData &&
              cardData.map((el, id) => (
                <div
                  className="home-card"
                  key={id}
                >
                  <div className="circle-container">
                    <span style={{ color: el.color }}>{el.icon}</span>
                    <div
                      className="home-circle"
                      style={{ background: el.color }}
                    ></div>
                  </div>
                  <div>
                    <h1>{el.count}</h1>
                    <div className="card-bottom-div">
                      <span>{el.title}</span>
                      <span style={{ color: el.color, fontSize: "12px" }}>
                        {el.subTitle}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
          <div className="home-thought">
            <div className="home-thought-heading">
              <FaLightbulb style={{ color: "#ffc844", fontSize: "18px" }} />
              <span>THOUGHT OF THE DAY</span>
            </div>
            <p>
              "Teams with high psychological safety outperform
              brilliant-but-toxic ones every single time."
            </p>
            <div className="thought-avatar-container">
              <div className="thought-avatar"></div>
              <span style={{ opacity: "0.6", fontSize: "14px" }}>
                James Okonkwo - Engineering Manager
              </span>
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div className="quick-actions">
          {actionData &&
            actionData.map((el, id) => (
              <div
                className="add-employe"
                key={id}
              >
                {el.icon}
                <span>{el.title}</span>
              </div>
            ))}
        </div>

        {/* Dashboard Overview */}
        <div className="dashboard-overview">
          {/* Recent employe section */}
          <div className="recent-employe-section">
            <div className="recent-employe-heading">
              <h3>Recent Employees</h3>
            </div>
            <div className="recent-employe-details">
              {recentEmployees &&
                recentEmployees.map((el) => (
                  <div
                    className="recent-employee-content"
                    key={el._id}
                  >
                    <div className="employe-left">
                      <div className="recent-employee-avatar">
                        {el.firstName[0].toUpperCase()}
                        {el.lastName[0].toUpperCase()}
                      </div>
                      <div>
                        <p>
                          {el.firstName} {el.lastName}
                        </p>
                        <span>{el.designation}</span>
                      </div>
                    </div>
                    <div
                      className="recent-dot-container"
                      style={{
                        background:
                          el.attendanceStatus === "Present"
                            ? "#12352F"
                            : "#351A21",
                        border:
                          el.attendanceStatus === "Present"
                            ? "1px solid #2F8F83"
                            : "1px solid #8F4652",
                      }}
                    >
                      <div
                        className="recent-dot"
                        style={{
                          background:
                            el.attendanceStatus === "Present"
                              ? "#22C55E"
                              : "#EF4444",
                        }}
                      ></div>
                      <span
                        style={{
                          color:
                            el.attendanceStatus === "Present"
                              ? "#5EE7C4"
                              : "#FF6B7A",
                        }}
                      >
                        {el.attendanceStatus}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
          {/* Attendance section */}
          <div className="attendance-section">
            <div className="attendance-header">
              <h3 className="attendance-title">Attendance this week</h3>
            </div>

            <div className="attendance-chart-container">
              <Bar
                data={data}
                options={options}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

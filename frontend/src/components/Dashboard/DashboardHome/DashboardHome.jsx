import { useEffect, useState } from "react";

import { getDashboardStats } from "../../../store/attendanceSlice";
import {
  fetchAllUser,
  fetchRecentEmployees,
} from "./../../../store/adminAuthSlice";
import { AnnouncementForm } from "../DashboardAnnouncement/AnnouncementForm/AnnouncementForm";
import { PulseDot } from "./../../PulseDot/pulseDot";
import { fetchFeaturedThoughtForAdmin } from "../../../store/postSlice";
import "./DashboardHome.css";

import {
  FaUsers,
  FaLightbulb,
  FaBell,
  FaBullhorn,
  FaChartBar,
} from "react-icons/fa6";

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

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export const DashboardHome = () => {
  const dispatch = useDispatch();
  const { totalUsers, recentEmployees } = useSelector(
    (state) => state.adminAuth,
  );

  //# ================ Featured thought or Pinned thought =================
  const { featured } = useSelector((state) => state.post);

  const { stats } = useSelector((state) => state.attendance);

  const totalAbsentToday = (totalUsers || 0) - (stats?.totalPresentToday || 0);

  //# ====================== Anouncement ===================
  const [openAnnouncement, setOpenAnnouncement] = useState(false);

  //# Card Style
  const handleMouseMove = (e) => {
    const card = e.currentTarget;

    const rect = card.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateY = ((x - centerX) / centerX) * 8;
    const rotateX = -((y - centerY) / centerY) * 8;

    card.style.setProperty("--rotateX", `${rotateX}deg`);
    card.style.setProperty("--rotateY", `${rotateY}deg`);

    card.style.setProperty("--mouse-x", `${x}px`);
    card.style.setProperty("--mouse-y", `${y}px`);
  };

  const resetTilt = (e) => {
    const card = e.currentTarget;

    card.style.setProperty("--rotateX", "0deg");
    card.style.setProperty("--rotateY", "0deg");
  };

  //# Card data
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
      color: "#86EFAC",
    },
    {
      icon: "❌",
      count: totalAbsentToday,
      title: "Absent Today",
      subTitle: "4 no-shows flagged",
      color: "#df2033",
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
      icon: <FaBell />,
      title: "Send Notification",
    },
    {
      icon: <FaLightbulb />,
      title: "Publish Thought",
    },
    {
      icon: <FaBullhorn />,
      title: "New Announcement",
    },
    {
      icon: <FaChartBar />,
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
        backgroundColor: "#29a3e0",
        barThickness: 15,
        maxBarThickness: 10,
        borderRadius: 8,
        borderSkipped: false,
      },
      {
        label: "Absent",
        data: absent,
        backgroundColor: "#E05252",
        barThickness: 10,
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

  useEffect(() => {
    dispatch(fetchAllUser());
    dispatch(fetchRecentEmployees());
    dispatch(getDashboardStats());
    dispatch(fetchFeaturedThoughtForAdmin());
  }, [dispatch]);

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
                  onMouseMove={handleMouseMove}
                  onMouseLeave={resetTilt}
                >
                  <div className="circle-container">
                    <span
                      className="home-card-action-icon"
                      style={{ color: el.color }}
                    >
                      {el.icon}
                    </span>
                    <PulseDot
                      className="home-circle"
                      {...el}
                    />
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
          <div className="home-thought-container">
            <div
              className="home-thought"
              onMouseMove={handleMouseMove}
              onMouseLeave={resetTilt}
            >
              <div className="home-thought-heading">
                <FaLightbulb style={{ color: "#ffc844", fontSize: "18px" }} />
                <span>THOUGHT OF THE DAY</span>
              </div>

              <p>
                {featured ? `"${featured.content}"` : "No thought available."}
              </p>

              <div className="thought-avatar-container">
                <div className="thought-avatar">
                  {featured?.createdBy?.firstName?.[0] || ""}
                  {featured?.createdBy?.lastName?.[0] || ""}
                </div>

                <span style={{ opacity: "0.6", fontSize: "14px" }}>
                  {featured
                    ? `${featured.createdBy?.firstName || ""} ${
                        featured.createdBy?.lastName || ""
                      }${
                        featured.createdBy?.designation
                          ? ` - ${featured.createdBy.designation}`
                          : ""
                      }`
                    : "No author"}
                </span>
              </div>
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
                onClick={() => {
                  if (el.title === "New Announcement") {
                    setOpenAnnouncement(true);
                  }
                }}
              >
                <span className="add-employee-icon">{el.icon}</span>
                <span style={{ color: "#fff" }}>{el.title}</span>
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
                      className={`recent-dot-container ${
                        el.attendanceStatus === "Present"
                          ? "attendance-present"
                          : "attendance-absent"
                      }`}
                    >
                      <PulseDot
                        color={
                          el.attendanceStatus === "Present"
                            ? "var(--attendance-present-dot)"
                            : "var(--attendance-absent-dot)"
                        }
                        size="8px"
                        speed="2.5s"
                        scale="2.5"
                      />
                      <span>{el.attendanceStatus}</span>
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

      {openAnnouncement && (
        <AnnouncementForm onClose={() => setOpenAnnouncement(false)} />
      )}
    </>
  );
};

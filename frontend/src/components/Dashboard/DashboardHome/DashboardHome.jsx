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
import { useDispatch, useSelector } from 'react-redux';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { fetchAllUser } from "../../../store/authSlice";
import { useEffect } from "react";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export const DashboardHome = () => {
  const dispatch = useDispatch()
  const { totalUsers } = useSelector((state) => state.auth);

  useEffect(() => {
      dispatch(fetchAllUser());
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
      count: "169",
      title: "Present Today",
      subTitle: "83.2% attendance",
      color: "#43746b",
    },
    {
      icon: "❌",
      count: "69",
      title: "Absent Today",
      subTitle: "4 no-shows flagged",
      color: "#df2033",
      backgroundColor: "",
    },
    {
      icon: "☕",
      count: "9",
      title: "On Break",
      subTitle: "Average 45 min",
      color: "#f3a823",
    },
    {
      icon: "⏰",
      count: "12",
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

  const recentData = [
    {
      avatar: "SM",
      name: "Sarah Mitchell",
      designation: "Senior Designer",
      isPresent: "Present",
      dotColor: "#47b396"
    },
    {
      avatar: "SM",
      name: "Sarah Mitchell",
      designation: "Senior Designer",
      isPresent: "Absent",
      dotColor: "#df2033"
    },
    {
      avatar: "SM",
      name: "Sarah Mitchell",
      designation: "Senior Designer",
      isPresent: "Present",
      dotColor: "#47b396"
    },
    {
      avatar: "SM",
      name: "Sarah Mitchell",
      designation: "Senior Designer",
      isPresent: "Absent",
      dotColor: "#df2033"
    },
  ];

  // attendance chart
  const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const present = [30, 60, 90, 120, 150, 180, 210];
  const absent = [5, 35, 65, 95, 125, 155, 185];
  const data = {
    labels,
    datasets: [
      {
        label: "Attendance",
        data: present,
        absentData: absent,
        backgroundColor: "#e45454",
        barThickness: 15, // Fixed width
        maxBarThickness: 15, // Maximum width
        borderRadius: 8,
        borderSkipped: false,
        borderWidth: 0,
        categoryPercentage: 1,
        barPercentage: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },

      tooltip: {
        backgroundColor: "#1f2937",
        titleColor: "#fff",
        bodyColor: "#fff",

        callbacks: {
          label: function (context) {
            const present = context.raw;
            const absent = context.dataset.absentData[context.dataIndex];

            return [`Present : ${present}`, `Absent : ${absent}`];
          },
        },
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
                <div className="home-card" key={id}>
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
              {recentData &&
                recentData.map((el, id) => (
                  <div className="recent-employee-content" key={id}>
                    <div className="employe-left">
                      <div className="recent-employee-avatar">{el.avatar}</div>
                      <div>
                        <p>{el.name}</p>
                        <span>{el.designation}</span>
                      </div>
                    </div>
                    <div className="recent-dot-container">
                      <div className="recent-dot" style={{background: el.dotColor}}></div>
                      <span style={{color: el.dotColor}}>{el.isPresent}</span>
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

import "../Dashboard/DashboardHome.css";

import {
  FaUsers,
  FaLightbulb,
  FaBell,
  FaBullhorn,
  FaChartBar,
} from "react-icons/fa6";
import { FaPlus } from "react-icons/fa";

import { Bar } from "react-chartjs-2";
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
            <div className="home-card">
              <div className="circle-container">
                <FaUsers style={{ color: "#583790", fontSize: "20px" }} />
                <div className="home-circle"></div>
              </div>
              <div>
                <h1>214</h1>
                <div className="card-bottom-div">
                  <span>Total Employees</span>
                  <span style={{ color: "#3a9dcf", fontSize: "12px" }}>
                    +3 this month
                  </span>
                </div>
              </div>
            </div>
            <div className="home-card">
              <div className="circle-container">
                <span style={{ fontSize: "20px" }}>✅</span>
                <div
                  style={{ backgroundColor: "#44b590" }}
                  className="home-circle"
                ></div>
              </div>
              <div>
                <h1>169</h1>
                <div className="card-bottom-div">
                  <span>Present Today</span>
                  <span style={{ color: "#43746b", fontSize: "12px" }}>
                    83.2% attendance
                  </span>
                </div>
              </div>
            </div>
            <div className="home-card">
              <div className="circle-container">
                <span style={{ fontSize: "18px" }}>❌</span>
                <div
                  style={{ backgroundColor: "#da5058" }}
                  className="home-circle"
                ></div>
              </div>
              <div>
                <h1>69</h1>
                <div className="card-bottom-div">
                  <span>Absent Today</span>
                  <span style={{ color: "#df2033", fontSize: "12px" }}>
                    4 no-shows flagged
                  </span>
                </div>
              </div>
            </div>
            <div className="home-card">
              <div className="circle-container">
                <span style={{ fontSize: "20px" }}>☕</span>
                <div
                  style={{ backgroundColor: "#f3a823" }}
                  className="home-circle"
                ></div>
              </div>
              <div>
                <h1>9</h1>
                <div className="card-bottom-div">
                  <span>On Break</span>
                  <span style={{ color: "#ce9950", fontSize: "12px" }}>
                    Average 45 min
                  </span>
                </div>
              </div>
            </div>
            <div className="home-card">
              <div className="circle-container">
                <span style={{ fontSize: "20px" }}>⏰</span>
                <div
                  style={{ backgroundColor: "#8c7cf0" }}
                  className="home-circle"
                ></div>
              </div>
              <div>
                <h1>12</h1>
                <div className="card-bottom-div">
                  <span>Late Check-ins</span>
                  <span style={{ color: "#7270c9", fontSize: "12px" }}>
                    30 min late today
                  </span>
                </div>
              </div>
            </div>
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
          <div className="add-employe">
            <FaPlus style={{ color: "#6954b1" }} />
            <span>Add Employee</span>
          </div>
          <div className="send-notification">
            <FaBell style={{ color: "#ef9b52" }} />
            <span>Send Notification</span>
          </div>
          <div className="publish-thought">
            <FaLightbulb style={{ color: "#ffc844" }} />
            <span>Publish Thought</span>
          </div>
          <div className="new-announcement">
            <FaBullhorn style={{ color: "#d13673" }} />
            <span>New Announcement</span>
          </div>
          <div className="generate-report">
            <FaChartBar style={{ color: "#c9d7ba" }} />
            <span>Generate Report</span>
          </div>
        </div>

        {/* Dashboard Overview */}
        <div className="dashboard-overview">
          {/* Recent employe section */}
          <div className="recent-employe-section">
            <div className="recent-employe-heading">
              <h3>Recent Employees</h3>
            </div>
            <div className="recent-employe-details">
              <div className="recent-employee-content">
                <div className="employe-left">
                  <div className="recent-employee-avatar">SM</div>
                  <div>
                    <p>Sarah Mitchell</p>
                    <span>Senior Designer</span>
                  </div>
                </div>
                <div className="recent-dot-container">
                  <div className="recent-dot"></div>
                  <span>Present</span>
                </div>
              </div>
              <div className="recent-employee-content">
                <div className="employe-left">
                  <div className="recent-employee-avatar">SM</div>
                  <div>
                    <p>James Okonkwo</p>
                    <span>Engineering Manager</span>
                  </div>
                </div>
                <div className="recent-dot-container">
                  <div className="recent-dot"></div>
                  <span>Present</span>
                </div>
              </div>
              <div className="recent-employee-content">
                <div className="employe-left">
                  <div className="recent-employee-avatar">SM</div>
                  <div>
                    <p>Sarah Mitchell</p>
                    <span>Senior Designer</span>
                  </div>
                </div>
                <div className="recent-dot-container">
                  <div className="recent-dot"></div>
                  <span>Late</span>
                </div>
              </div>
              <div className="recent-employee-content">
                <div className="employe-left">
                  <div className="recent-employee-avatar">SM</div>
                  <div>
                    <p>Sarah Mitchell</p>
                    <span>Senior Designer</span>
                  </div>
                </div>
                <div className="recent-dot-container">
                  <div className="recent-dot"></div>
                  <span>Absent</span>
                </div>
              </div>
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

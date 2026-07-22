import "./DashboardReport.css";

import { FaChartBar } from "react-icons/fa6";
import { FcDepartment } from "react-icons/fc";
import { PiChartLineUpFill } from "react-icons/pi";

import { Bar, Doughnut, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
} from "chart.js";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
);

export const DashboardReport = () => {
  // Attendance Chart
  const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const present = [150, 180, 90, 120, 150, 180, 120];
  const absent = [5, 35, 65, 95, 125, 155, 185];
  const late = [5, 35, 65, 95, 125, 155, 185];
  const data = {
    labels,
    datasets: [
      {
        label: "Attendance",
        data: present,
        absentData: absent,
        lateData: late,
        backgroundColor: "#f7a621",
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
        displayColors: false,

        backgroundColor: "#1f2937",
        titleColor: "#fff",
        bodyColor: "#fff",

        callbacks: {
          label: function (context) {
            const present = context.raw;
            const absent = context.dataset.absentData[context.dataIndex];
            const late = context.dataset.lateData[context.dataIndex];

            return [
              `Present : ${present}`,
              `Absent : ${absent}`,
              `Late : ${late}`,
            ];
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

  // Department Chart
  const data1 = {
    labels: ["Analytics", "Design", "Engineering", "Marketing", "HR & Ops"],
    datasets: [
      {
        data: [300, 50, 100, 200, 75],
        backgroundColor: [
          "#3FB690",
          "#8B7CF3",
          "#36A2EB",
          "#FFCD56",
          "#FF6384",
        ],
        hoverOffset: 6,
      },
    ],
  };

  const options1 = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.label}: ${context.raw}`;
          },
        },
      },
    },
  };

  // Attendance Trend
  const labels2 = ["W1", "W2", "W3", "W4", "W5", "W6", "W7", "W8"];
  const data2 = {
    labels: labels2,
    datasets: [
      {
        label: "Attendance",
        data: [0, 75, 25, 80, 40, 15, 60, 90],
        fill: false,
        borderColor: "#4eb3e9",
        tension: 0.4,
      },
    ],
  };

  const options2 = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100, // Set maximum percentage
        ticks: {
          callback: function (value) {
            return value + "%";
          },
        },
      },
    },
  };

  return (
    <>
      <div className="dashboardReport-container">
        <div className="dashboardReport-header">
          <h3>Reports & Analytics</h3>
          <span>Workforce performance and attendance insights</span>
        </div>
        <div className="dashboardReport-grid-container">
          <div className="dashboardReport-grid-content">

          {/* Attendance chart */}
            <div className="dashboardReport-attendance-chart">
              <div className="attendance-chart-heading">
                <FaChartBar style={{ color: "#c9d7ba", fontSize: "18px" }} />
                <h3>Weekly Attendance Breakdown</h3>
              </div>
              <div className="dashboardAttendance-chart-content">
                <Bar
                  data={data}
                  options={options}
                />
              </div>
            </div>
            {/* Department chart */}
            <div className="dashboardReport-department-chart">
              <div className="department-chart-heading">
                <FcDepartment style={{ color: "#a26f65", fontSize: "18px" }} />
                <h3>Department Headcount</h3>
              </div>
              <div className="dashboardDepartment-chart-content">
                <div className="department-chart-container">
                  <Doughnut className="department-chart"
                    data={data1}
                    options={options1}
                  />
                </div>
                <div className="department-chart-details">
                  <div>
                    <div>
                      <div
                        className="department-chart-box"
                        style={{ backgroundColor: "#309be3" }}
                      ></div>
                      <div>Engineering</div>
                    </div>
                    <span>20%</span>
                  </div>
                  <div>
                    <div>
                      <div
                        className="department-chart-box"
                        style={{ backgroundColor: "#8b7cf3" }}
                      ></div>
                      <div>Design</div>
                    </div>
                    <span>40%</span>
                  </div>
                  <div>
                    <div>
                      <div
                        className="department-chart-box"
                        style={{ backgroundColor: "#3fb690" }}
                      ></div>
                      <div>Analytics</div>
                    </div>
                    <span>60%</span>
                  </div>
                  <div>
                    <div>
                      <div
                        className="department-chart-box"
                        style={{ backgroundColor: "#ffcc56" }}
                      ></div>
                      <div>Marketing</div>
                    </div>
                    <span>69%</span>
                  </div>
                  <div>
                    <div>
                      <div
                        className="department-chart-box"
                        style={{ backgroundColor: "#fe6383" }}
                      ></div>
                      <div>HR & OPs</div>
                    </div>
                    <span>55%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Attendance Trend */}
          <div className="dashboardReport-attendance-trend">
            <div className="attendance-trend-heading">
                <PiChartLineUpFill style={{color: "#d6d0e4", fontSize: "20px"}} />
                <h3>8-Week Attendance Rate Trend</h3>
            </div>
            <div className="attendance-trend-chart">
                <Line data={data2} options={options2} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

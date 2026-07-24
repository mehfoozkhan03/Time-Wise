import "./LeaveSummary.css";

import { FcLeave } from "react-icons/fc";
import { BiSolidError } from "react-icons/bi";

export const LeaveSummary = () => {
  const leaveData = [
    {
      title: "Annual Leave",
      value: "8 used · 21 total",
      remaining: "13 left",
    },
    {
      title: "Sick Leave",
      value: "2 used · 10 total",
      remaining: "8 left",
    },
    {
      title: "Casual Leave",
      value: "3 used · 5 total",
      remaining: "2 left",
    },
  ];

  return (
    <>
      <section className="leave-summary-section">
        <div className="leaveSummary-header">
          <div>
            <div><FcLeave /></div>
            <h3>Leave Summary</h3>
          </div>
          <span>FY 2025-2026</span>
        </div>
        <div className="leaveSummary-content">
          {leaveData.map((item, i) => (
            <div className="leaveSummary-list" key={i}>
              <div>
                <div>
                  <p>{item.title}</p>
                  <span>{item.value}</span>
                </div>
                <div>
                  <span>{item.remaining}</span>
                </div>
              </div>
              <div>
                <div className="leave-fill"></div>
              </div>
            </div>
          ))}
        </div>
        <div className="pending-leave">
            <BiSolidError style={{color: "#ffb965"}} />
            <p>2 leave requests pending approval from manager.</p>
        </div>
      </section>
    </>
  );
};

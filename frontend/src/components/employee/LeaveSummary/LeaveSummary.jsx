import "./LeaveSummary.css";

import { FcLeave } from "react-icons/fc";
import { BiSolidError } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { fetchLeaveBalance } from "../../../store/leaveSlice";
import { useEffect } from "react";

export const LeaveSummary = () => {
  const dispatch = useDispatch();
  const { balance } = useSelector((state) => state.leave);

  const leaveData = [
    {
      title: "Annual Leave",
      value: `${balance?.annual?.used} used · ${balance?.annual?.total} total`,
      remaining: `${balance?.annual?.remaining} left`,
      percentage: balance?.annual?.total > 0 ? (balance.annual.used / balance.annual.total) * 100 : 0,
    },
    {
      title: "Sick Leave",
      value: `${balance?.sick?.used} used · ${balance?.sick?.total} total`,
      remaining: `${balance?.sick?.remaining} left`,
      percentage: balance?.sick?.total > 0 ? (balance.sick.used / balance.sick.total) * 100 : 0,
    },
    {
      title: "Casual Leave",
      value: `${balance?.casual?.used} used · ${balance?.casual?.total} total`,
      remaining: `${balance?.casual?.remaining} left`,
      percentage: balance?.casual?.total > 0 ? (balance.casual.used / balance.casual.total) * 100 : 0,
    },
  ];

  useEffect(() => {
    dispatch(fetchLeaveBalance());
  }, [dispatch]);

  return (
    <>
      <section className="leave-summary-section">
        <div className="leaveSummary-header">
          <div>
            <div>
              <FcLeave />
            </div>
            <h3>Leave Summary</h3>
          </div>
          <span>FY 2025-2026</span>
        </div>
        <div className="leaveSummary-content">
          {leaveData.map((item, i) => (
            <div
              className="leaveSummary-list"
              key={i}
            >
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
                <div
                  className="leave-fill"
                  style={{
                    width: `${item.percentage}%`,
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
        <div className="pending-leave">
          <BiSolidError style={{ color: "#ffb965" }} />
          <p>2 leave requests pending approval from manager.</p>
        </div>
      </section>
    </>
  );
};

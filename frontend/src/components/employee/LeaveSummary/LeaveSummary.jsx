import "./LeaveSummary.css";

import { FcLeave } from "react-icons/fc";
import { BiSolidError } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { fetchLeaveBalance } from "../../../store/leaveSlice";
import { useEffect } from "react";
import Skeleton from "../../Skeleton/Skeleton";

export const LeaveSummary = () => {
  const dispatch = useDispatch();

  const { balance, loading } = useSelector((state) => state.leave);

  useEffect(() => {
    dispatch(fetchLeaveBalance());
  }, [dispatch]);

  const leaveData = [
    {
      title: "Annual Leave",
      value: `${balance?.annual?.used ?? 0} used · ${balance?.annual?.total ?? 0} total`,
      remaining: `${balance?.annual?.remaining ?? 0} left`,
      percentage:
        balance?.annual?.total > 0
          ? (balance.annual.used / balance.annual.total) * 100
          : 0,
    },
    {
      title: "Sick Leave",
      value: `${balance?.sick?.used ?? 0} used · ${balance?.sick?.total ?? 0} total`,
      remaining: `${balance?.sick?.remaining ?? 0} left`,
      percentage:
        balance?.sick?.total > 0
          ? (balance.sick.used / balance.sick.total) * 100
          : 0,
    },
    {
      title: "Casual Leave",
      value: `${balance?.casual?.used ?? 0} used · ${balance?.casual?.total ?? 0} total`,
      remaining: `${balance?.casual?.remaining ?? 0} left`,
      percentage:
        balance?.casual?.total > 0
          ? (balance.casual.used / balance.casual.total) * 100
          : 0,
    },
  ];

  if (loading) {
    return (
      <section className="leave-summary-section leave-summary-skeleton">
        <div className="leaveSummary-header">
          <div className="leave-skeleton-heading">
            <Skeleton width="28px" height="28px" />
            <Skeleton width="130px" height="22px" />
          </div>
          <Skeleton width="105px" height="16px" />
        </div>

        <div className="leaveSummary-content">
          {[1, 2, 3].map((item) => (
            <div className="leaveSummary-list" key={item}>
              <div className="leave-skeleton-row">
                <div className="leave-skeleton-details">
                  <Skeleton width="110px" height="16px" />
                  <Skeleton width="155px" height="13px" />
                </div>
                <Skeleton width="55px" height="14px" />
              </div>

              <Skeleton width="100%" height="7px" />
            </div>
          ))}
        </div>

        <div className="pending-leave">
          <Skeleton width="18px" height="18px" />
          <Skeleton width="75%" height="14px" />
        </div>
      </section>
    );
  }

  return (
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
        {leaveData.map((item) => (
          <div className="leaveSummary-list" key={item.title}>
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
                  width: `${Math.min(item.percentage, 100)}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="pending-leave">
        <BiSolidError style={{ color: "#ffb965" }} />
        <p>2 leave requests pending approval from manager.</p>
      </div>
    </section>
  );
};

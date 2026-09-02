import {
  MdBeachAccess,
  MdLocalHospital,
  MdOutlineEventAvailable,
} from "react-icons/md";

import "./LeaveBalance.css";

const LeaveBalance = ({ balance }) => {
  if (!balance) {
    return null;
  }

  const leaveData = [
    {
      type: "Annual Leave",
      key: "annual",
      icon: <MdOutlineEventAvailable />,
      ...balance.annual,
    },
    {
      type: "Sick Leave",
      key: "sick",
      icon: <MdLocalHospital />,
      ...balance.sick,
    },
    {
      type: "Casual Leave",
      key: "casual",
      icon: <MdBeachAccess />,
      ...balance.casual,
    },
  ];

  return (
    <section className="leaveBalance">
      <div className="leaveBalance-header">
        <div>
          <h2>Leave Balance</h2>
          <p>Your current leave balance</p>
        </div>
      </div>

      <div className="leaveBalance-grid">
        {leaveData.map((leave) => (
          <article
            className={`leaveBalance-card ${leave.key}`}
            key={leave.type}
          >
            <div className="leaveBalance-card-header">
              <div className="leaveBalance-icon">
                {leave.icon}
              </div>

              <h3>{leave.type}</h3>
            </div>

            <div className="leaveBalance-total">
              <span>{leave.total}</span>

              <div>
                <small>Total Days</small>
                <strong>
                  {leave.total === 1
                    ? "day available"
                    : "days available"}
                </strong>
              </div>
            </div>

            <div className="leaveBalance-details">
              <div className="leaveBalance-detail">
                <span>Used</span>
                <strong>{leave.used}</strong>
              </div>

              <div className="leaveBalance-detail">
                <span>Remaining</span>
                <strong>{leave.remaining}</strong>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default LeaveBalance;
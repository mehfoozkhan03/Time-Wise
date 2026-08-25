import "./LeaveBalance.css";

const leaveBalance = [
  {
    type: "Annual Leave",
    total: 21,
    used: 8,
    remaining: 13,
  },
  {
    type: "Sick Leave",
    total: 10,
    used: 2,
    remaining: 8,
  },
  {
    type: "Casual Leave",
    total: 5,
    used: 3,
    remaining: 2,
  },
];

const LeaveBalance = () => {
  return (
    <section className="leaveBalance">
      <div className="leaveBalance-header">
        <h2>Leave Balance</h2>
        <p>Your current leave balance</p>
      </div>

      <div className="leaveBalance-grid">
        {leaveBalance.map((leave) => (
          <div className="leaveBalance-card" key={leave.type}>
            <h3>{leave.type}</h3>

            <div className="leaveBalance-total">
              <span>{leave.total}</span>
              <small>Total Days</small>
            </div>

            <div className="leaveBalance-details">
              <div>
                <span>Used</span>
                <strong>{leave.used}</strong>
              </div>

              <div>
                <span>Remaining</span>
                <strong>{leave.remaining}</strong>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default LeaveBalance;
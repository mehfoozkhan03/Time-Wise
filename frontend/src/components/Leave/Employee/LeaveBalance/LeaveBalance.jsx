import "./LeaveBalance.css";

const LeaveBalance = ({ balance }) => {
  if (!balance) return null;

  const leaveData = [
    {
      type: "Annual Leave",
      ...balance.annual,
    },
    {
      type: "Sick Leave",
      ...balance.sick,
    },
    {
      type: "Casual Leave",
      ...balance.casual,
    },
  ];

  return (
    <section className="leaveBalance">
      <div className="leaveBalance-header">
        <h2>Leave Balance</h2>
        <p>Your current leave balance</p>
      </div>

      <div className="leaveBalance-grid">
        {leaveData.map((leave) => (
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
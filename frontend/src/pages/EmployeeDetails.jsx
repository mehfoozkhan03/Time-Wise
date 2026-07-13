

import "./EmployeeDetails.css";

export default function EmployeeDetails() {
  return (
    <div className="employee-details">

      <div className="left">

        <div className="profile-card">

          <div className="profile">

            <div className="avatar">SM</div>

            <div>
              <h2>Raunak Yadav<span className="active">Active</span></h2>

              <p>Senior Product Manager</p>

              <p>Product Development</p>

              <h4>ID : EMP-2024-0157</h4>
            </div>

          </div>

          <div className="stats">

            <div className="card red">
              <h4>Total Hours</h4>
              <h2>156.5h</h2>
            </div>

            <div className="card green">
              <h4>Attendance</h4>
              <h2>94%</h2>
            </div>

            <div className="card blue">
              <h4>Punctuality</h4>
              <h2>87%</h2>
            </div>

          </div>

        </div>

        <div className="achievement">

          <h2>Achievements 🏆</h2>

          <div className="ach-box">

            <div>⭐<br />Early Bird</div>

            <div>💼<br />Workhorse</div>

            <div>🌟<br />Consistency</div>

            <div>🔒<br />Goal Crusher</div>

          </div>

        </div>

      </div>

      <div className="right">

        <div className="contact">

          <h2>Contact Information</h2>

          <p>📧 Raunak@timewise.com</p>

          <p>📞 +91 9143543256</p>

          <p>📍 Mumbai</p>

          <p>👤 Joined 15/03/2022</p>

          <button className="msg-btn">Send Message</button>

          <button className="report-btn">View Reports</button>

        </div>

      </div>

    </div>
  );
}


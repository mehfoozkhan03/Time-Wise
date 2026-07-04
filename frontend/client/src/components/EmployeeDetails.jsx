import React from "react";

function EmployeeDetails({ employee, goBack }) {
  return (
    <div className="details-box">
      <button className="back-btn" onClick={goBack}>
        Back
      </button>

      <div className="profile">
        <div className="avatar">
          {employee.name[0]}
        </div>

        <div>
          <h1>{employee.name}</h1>
          <p>{employee.role}</p>
          <p>{employee.department}</p>
          <p>ID: {employee.id}</p>
        </div>
      </div>

      <div className="stats">
        <div className="card">156.5h</div>
        <div className="card">94%</div>
        <div className="card">87%</div>
      </div>
    </div>
  );
}

export default EmployeeDetails;
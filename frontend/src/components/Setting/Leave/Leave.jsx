import { useState } from "react";

import "./Leave.css";

import LeaveBalance from "../../Leave/Employee/LeaveBalance/LeaveBalance";
import ApplyLeave from "../../Leave/Employee/ApplyLeave/ApplyLeave";
import LeaveHistory from "../../Leave/Employee/LeaveHistory/LeaveHistory";

const initialRequests = [
  {
    id: 1,
    leaveType: "Sick Leave",
    leaveTypeValue: "sick",
    startDate: "25 Aug 2026",
    endDate: "26 Aug 2026",
    requestedDays: 2,
    reason: "Personal reason",
    status: "Pending",
    appliedDate: "20 Aug 2026",
  },
  {
    id: 2,
    leaveType: "Annual Leave",
    leaveTypeValue: "annual",
    startDate: "10 Sep 2026",
    endDate: "12 Sep 2026",
    requestedDays: 3,
    reason: "Family trip",
    status: "Approved",
    appliedDate: "18 Aug 2026",
  },
  {
    id: 3,
    leaveType: "Casual Leave",
    leaveTypeValue: "casual",
    startDate: "15 Jul 2026",
    endDate: "15 Jul 2026",
    requestedDays: 1,
    reason: "Personal work",
    status: "Rejected",
    appliedDate: "10 Jul 2026",
  },
];

const Leave = () => {
  const [showApplyLeave, setShowApplyLeave] = useState(false);
  const [requests, setRequests] = useState(initialRequests);

  const handleSubmitLeave = (newRequest) => {
    setRequests((previous) => [newRequest, ...previous]);
  };

  const handleCancelRequest = (requestId) => {
    setRequests((previous) =>
      previous.map((request) =>
        request.id === requestId
          ? {
              ...request,
              status: "Cancelled",
            }
          : request
      )
    );
  };

  return (
    <div className="leave-page">
      <div className="leave-page-header">
        <div>
          <h1>Leave</h1>
          <p>Manage your leave requests and balances.</p>
        </div>

        <button
          type="button"
          className="leave-apply-btn"
          onClick={() => setShowApplyLeave(true)}
        >
          Apply for Leave
        </button>
      </div>

      <div className="leave-page-content">
        <LeaveBalance />

        <LeaveHistory
          requests={requests}
          onCancelRequest={handleCancelRequest}
        />
      </div>

      {showApplyLeave && (
        <ApplyLeave
          onClose={() => setShowApplyLeave(false)}
          onSubmit={handleSubmitLeave}
        />
      )}
    </div>
  );
};

export default Leave;
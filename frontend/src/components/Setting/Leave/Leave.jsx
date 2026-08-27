import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import "./Leave.css";

import LeaveBalance from "../../Leave/Employee/LeaveBalance/LeaveBalance";
import ApplyLeave from "../../Leave/Employee/ApplyLeave/ApplyLeave";
import LeaveHistory from "../../Leave/Employee/LeaveHistory/LeaveHistory";

import {
  fetchLeaveBalance,
  fetchMyLeaves,
  submitLeave,
  cancelLeaveRequest,
} from "../../../store/leaveSlice";

const leaveTypeLabels = {
  annual: "Annual Leave",
  sick: "Sick Leave",
  casual: "Casual Leave",
};

const formatDate = (date) => {
  if (!date) {
    return "";
  }

  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const Leave = () => {
  const dispatch = useDispatch();

  const { balance, requests, loading, error } = useSelector(
    (state) => state.leave,
  );

  const [showApplyLeave, setShowApplyLeave] = useState(false);

  useEffect(() => {
    dispatch(fetchLeaveBalance());
    dispatch(fetchMyLeaves());
  }, [dispatch]);

  const formattedRequests = useMemo(() => {
    return requests.map((request) => ({
      id: request._id,
      leaveType: leaveTypeLabels[request.leaveType] || request.leaveType,
      leaveTypeValue: request.leaveType,
      startDate: formatDate(request.startDate),
      endDate: formatDate(request.endDate),
      requestedDays: request.totalDays,
      reason: request.reason,
      status: request.status,
      appliedDate: formatDate(request.appliedAt),
      adminComment: request.adminComment || "",
      rawRequest: request,
    }));
  }, [requests]);

  const handleSubmitLeave = async (leaveData) => {
    try {
      await dispatch(submitLeave(leaveData)).unwrap();
      await dispatch(fetchMyLeaves()).unwrap();

      setShowApplyLeave(false);
    } catch (submitError) {
      console.error("Submit Leave Error:", submitError);
      throw submitError;
    }
  };

  const handleCancelRequest = async (requestId) => {
    try {
      await dispatch(cancelLeaveRequest(requestId)).unwrap();
      await dispatch(fetchMyLeaves()).unwrap();
    } catch (cancelError) {
      console.error("Cancel Leave Error:", cancelError);
      throw cancelError;
    }
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
        {loading && !balance && !requests.length ? (
          <p>Loading leave information...</p>
        ) : (
          <>
            <LeaveBalance balance={balance} />

            <LeaveHistory
              requests={formattedRequests}
              onCancelRequest={handleCancelRequest}
            />
          </>
        )}

        {error && (
          <p style={{ color: "#ef4444", margin: 0 }}>
            {error}
          </p>
        )}
      </div>

      {showApplyLeave && (
        <ApplyLeave
          onClose={() => setShowApplyLeave(false)}
          onSubmit={handleSubmitLeave}
          balance={balance}
        />
      )}
    </div>
  );
};

export default Leave;
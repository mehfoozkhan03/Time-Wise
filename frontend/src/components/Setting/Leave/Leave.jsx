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

  const {
    balance,
    requests = [],
    loading = false,
    error = null,
  } = useSelector((state) => state.leave);

  const [showApplyLeave, setShowApplyLeave] = useState(false);

  useEffect(() => {
    dispatch(fetchLeaveBalance());
    dispatch(fetchMyLeaves());
  }, [dispatch]);

  const formattedRequests = useMemo(
    () =>
      requests.map((request) => ({
        id: request._id,
        leaveType:
          leaveTypeLabels[request.leaveType] || request.leaveType,
        leaveTypeValue: request.leaveType,
        startDate: formatDate(request.startDate),
        endDate: formatDate(request.endDate),
        requestedDays: request.totalDays,
        reason: request.reason,
        status: request.status,
        appliedDate: formatDate(request.appliedAt),
        adminComment: request.adminComment || "",
        rawRequest: request,
      })),
    [requests],
  );

  const handleOpenApplyLeave = () => {
    setShowApplyLeave(true);
  };

  const handleCloseApplyLeave = () => {
    setShowApplyLeave(false);
  };

  const handleSubmitLeave = async (leaveData) => {
    try {
      await dispatch(submitLeave(leaveData)).unwrap();
      await dispatch(fetchMyLeaves()).unwrap();

      handleCloseApplyLeave();
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

  const isInitialLoading =
    loading && !balance && requests.length === 0;

  return (
    <main className="leave-page">
      <header className="leave-page-header">
        <div className="leave-page-heading">
          <h1>Leave</h1>
          <p>Manage your leave requests and balances.</p>
        </div>

        <button
          type="button"
          className="leave-apply-btn"
          onClick={handleOpenApplyLeave}
          disabled={loading}
        >
          Apply for Leave
        </button>
      </header>

      <div className="leave-page-content">
        {isInitialLoading ? (
          <div className="leave-page-loading">
            <span>Loading leave information...</span>
          </div>
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
          <div
            className="leave-page-error"
            role="alert"
          >
            {error}
          </div>
        )}
      </div>

      {showApplyLeave && (
        <ApplyLeave
          onClose={handleCloseApplyLeave}
          onSubmit={handleSubmitLeave}
          balance={balance}
        />
      )}
    </main>
  );
};

export default Leave;
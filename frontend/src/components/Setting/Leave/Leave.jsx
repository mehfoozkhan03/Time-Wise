import { useCallback, useEffect, useMemo, useState } from "react";
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
    pagination = null,
    loading = false,
    error = null,
  } = useSelector((state) => state.leave);

  const [showApplyLeave, setShowApplyLeave] = useState(false);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("All");

  const limit = 10;

  const fetchLeaveHistory = useCallback(
    async (currentPage, currentStatus) => {
      await dispatch(
        fetchMyLeaves({
          page: currentPage,
          limit,
          status: currentStatus,
        }),
      ).unwrap();
    },
    [dispatch],
  );

  useEffect(() => {
    dispatch(fetchLeaveBalance());
  }, [dispatch]);

  useEffect(() => {
    fetchLeaveHistory(page, status);
  }, [fetchLeaveHistory, page, status]);

  const formattedRequests = useMemo(
    () =>
      requests.map((request) => ({
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
      })),
    [requests],
  );

  const handleOpenApplyLeave = () => {
    setShowApplyLeave(true);
  };

  const handleCloseApplyLeave = () => {
    setShowApplyLeave(false);
  };

  const handleStatusChange = (newStatus) => {
    if (newStatus === status) {
      return;
    }

    setStatus(newStatus);
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    const totalPages = pagination?.totalPages || 0;

    if (newPage < 1) {
      return;
    }

    if (totalPages > 0 && newPage > totalPages) {
      return;
    }

    if (newPage === page) {
      return;
    }

    setPage(newPage);
  };

  const handleSubmitLeave = async (leaveData) => {
    try {
      await dispatch(submitLeave(leaveData)).unwrap();

      await dispatch(fetchLeaveBalance()).unwrap();

      await fetchLeaveHistory(page, status);

      handleCloseApplyLeave();
    } catch (submitError) {
      console.error("Submit Leave Error:", submitError);

      throw submitError;
    }
  };

  const handleCancelRequest = async (requestId) => {
    try {
      await dispatch(cancelLeaveRequest(requestId)).unwrap();

      await dispatch(fetchLeaveBalance()).unwrap();

      const totalPages = pagination?.totalPages || 1;

      const isLastItemOnPage = requests.length === 1;

      const isLastPage = page === totalPages;

      if (isLastItemOnPage && isLastPage && page > 1) {
        setPage((currentPage) => currentPage - 1);
        return;
      }

      await fetchLeaveHistory(page, status);
    } catch (cancelError) {
      console.error("Cancel Leave Error:", cancelError);

      throw cancelError;
    }
  };

  const isInitialLoading = loading && !balance && requests.length === 0;

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
              loading={loading}
              activeFilter={status}
              pagination={pagination}
              onFilterChange={handleStatusChange}
              onPageChange={handlePageChange}
              onCancelRequest={handleCancelRequest}
            />
          </>
        )}

        {error && (
          <div className="leave-page-error" role="alert">
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

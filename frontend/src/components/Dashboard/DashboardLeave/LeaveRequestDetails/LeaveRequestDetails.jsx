import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  FaTimes,
  FaCalendarAlt,
  FaClock,
  FaUser,
  FaEnvelope,
  FaFileAlt,
  FaCheck,
  FaBan,
  FaBuilding,
  FaBriefcase,
} from "react-icons/fa";

import "./LeaveRequestDetails.css";

import { fetchAdminLeaveById } from "../../../../store/leaveSlice";

const leaveTypeLabels = {
  annual: "Annual Leave",
  sick: "Sick Leave",
  casual: "Casual Leave",
};

const formatDate = (date) => {
  if (!date) {
    return "—";
  }

  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatLeaveType = (leaveType) => {
  if (!leaveType) {
    return "—";
  }

  return leaveTypeLabels[leaveType.toLowerCase()] || leaveType;
};

const getEmployee = (request) => request.employee || request.user || null;

const getEmployeeName = (employee) => {
  if (!employee) {
    return "Unknown Employee";
  }

  const name = [employee.firstName, employee.lastName]
    .filter(Boolean)
    .join(" ");

  return name || "Unknown Employee";
};

const getEmployeeInitials = (employee) => {
  if (!employee) {
    return "?";
  }

  const initials = [employee.firstName?.charAt(0), employee.lastName?.charAt(0)]
    .filter(Boolean)
    .join("")
    .toUpperCase();

  return initials || "?";
};

const getAppliedDate = (request) =>
  request.appliedAt || request.createdAt || request.appliedDate;

const getRequestId = (request) => request?.id || request?._id;

export default function LeaveRequestDetails({
  isOpen,
  request,
  onClose,
  onApprove,
  onReject,
}) {
  const dispatch = useDispatch();

  const { adminSelectedLeave = null, loading = false } = useSelector(
    (state) => state.leave,
  );

  const requestId = getRequestId(request);

  useEffect(() => {
    if (!isOpen || !requestId) {
      return;
    }

    dispatch(fetchAdminLeaveById(requestId));
  }, [dispatch, isOpen, requestId]);

  const currentRequest =
    adminSelectedLeave && getRequestId(adminSelectedLeave) === requestId
      ? adminSelectedLeave
      : request;

  if (!isOpen || !currentRequest) {
    return null;
  }

  const employee = getEmployee(currentRequest);
  const employeeName = getEmployeeName(employee);

  const totalDays =
    currentRequest.totalDays ?? currentRequest.requestedDays ?? 0;

  const isPending = currentRequest.status === "Pending";

  const statusClass = currentRequest.status?.toLowerCase() || "";

  return (
    <div className="leave_details_overlay" onClick={onClose}>
      <div
        className="leave_details_modal"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="leave_details_header">
          <div>
            <span className="leave_details_eyebrow">Leave Request</span>

            <h2>Request Details</h2>
          </div>

          <button
            type="button"
            className="leave_details_close"
            onClick={onClose}
            aria-label="Close"
          >
            <FaTimes />
          </button>
        </div>

        <div className="leave_details_employee">
          <div className="leave_details_avatar">
            {getEmployeeInitials(employee)}
          </div>

          <div className="leave_details_employee_info">
            <h3>{employeeName}</h3>

            <span>
              <FaEnvelope />
              {employee?.email || "No email available"}
            </span>

            <div className="leave_details_employee_meta">
              <span>
                <FaBuilding />
                {employee?.department || "Department not available"}
              </span>

              <span>
                <FaBriefcase />
                {employee?.designation || "Designation not available"}
              </span>
            </div>
          </div>
        </div>

        <div className="leave_details_status_row">
          <span className="leave_details_status_label">Current Status</span>

          <span className={`leave_details_status ${statusClass}`}>
            <span className="leave_details_status_dot" />
            {currentRequest.status || "Unknown"}
          </span>
        </div>

        <div className="leave_details_section">
          <div className="leave_details_section_title">
            <FaFileAlt />
            <span>Leave Information</span>
          </div>

          <div className="leave_details_grid">
            <div className="leave_details_item">
              <span className="leave_details_item_label">Leave Type</span>

              <strong>{formatLeaveType(currentRequest.leaveType)}</strong>
            </div>

            <div className="leave_details_item">
              <span className="leave_details_item_label">Total Days</span>

              <strong>
                {totalDays} {totalDays === 1 ? "Day" : "Days"}
              </strong>
            </div>

            <div className="leave_details_item">
              <span className="leave_details_item_label">Start Date</span>

              <strong>
                <FaCalendarAlt />
                {formatDate(currentRequest.startDate)}
              </strong>
            </div>

            <div className="leave_details_item">
              <span className="leave_details_item_label">End Date</span>

              <strong>
                <FaCalendarAlt />
                {formatDate(currentRequest.endDate)}
              </strong>
            </div>

            <div className="leave_details_item">
              <span className="leave_details_item_label">Applied On</span>

              <strong>
                <FaClock />
                {formatDate(getAppliedDate(currentRequest))}
              </strong>
            </div>
          </div>
        </div>

        <div className="leave_details_section">
          <div className="leave_details_section_title">
            <FaFileAlt />
            <span>Reason</span>
          </div>

          <div className="leave_details_reason">
            {currentRequest.reason || "No reason provided."}
          </div>
        </div>

        {currentRequest.adminComment && (
          <div className="leave_details_section">
            <div className="leave_details_section_title">
              <FaUser />
              <span>Admin Comment</span>
            </div>

            <div className="leave_details_comment">
              {currentRequest.adminComment}
            </div>
          </div>
        )}

        <div className="leave_details_footer">
          <button
            type="button"
            className="leave_details_btn secondary"
            onClick={onClose}
          >
            Close
          </button>

          {isPending && !loading && (
            <div className="leave_details_actions">
              <button
                type="button"
                className="leave_details_btn reject"
                onClick={() => onReject?.(currentRequest)}
              >
                <FaBan />
                Reject
              </button>

              <button
                type="button"
                className="leave_details_btn approve"
                onClick={() => onApprove?.(currentRequest)}
              >
                <FaCheck />
                Approve
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

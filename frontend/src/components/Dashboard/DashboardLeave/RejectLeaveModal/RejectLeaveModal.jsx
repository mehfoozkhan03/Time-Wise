import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { FaTimes, FaExclamationTriangle, FaBan } from "react-icons/fa";

import "./RejectLeaveModal.css";

import { rejectAdminLeave } from "../../../../store/leaveSlice";

const leaveTypeLabels = {
  annual: "Annual Leave",
  sick: "Sick Leave",
  casual: "Casual Leave",
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

const formatLeaveType = (leaveType) => {
  if (!leaveType) {
    return "Leave Request";
  }

  return leaveTypeLabels[leaveType.toLowerCase()] || leaveType;
};

const getRequestId = (request) => request?.id || request?._id;

export default function RejectLeaveModal({
  isOpen,
  request,
  onClose,
  onConfirm,
}) {
  const dispatch = useDispatch();

  const {
    loading = false,
    error = null,
    adminSelectedLeave = null,
  } = useSelector((state) => state.leave);

  const [reason, setReason] = useState("");

  useEffect(() => {
    if (isOpen) {
      setReason("");
    }
  }, [isOpen, request]);

  if (!isOpen || !request) {
    return null;
  }

  const selectedRequest =
    adminSelectedLeave &&
    getRequestId(adminSelectedLeave) === getRequestId(request)
      ? adminSelectedLeave
      : request;

  const employee = getEmployee(selectedRequest);
  const employeeName = getEmployeeName(employee);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const trimmedReason = reason.trim();

    if (!trimmedReason) {
      return;
    }

    const leaveID = getRequestId(selectedRequest);

    if (!leaveID) {
      return;
    }

    try {
      await dispatch(
        rejectAdminLeave({
          leaveID,
          adminComment: trimmedReason,
        }),
      ).unwrap();

      onConfirm?.({
        request: selectedRequest,
        reason: trimmedReason,
      });

      setReason("");
    } catch (rejectError) {
      console.error("Reject Leave Error:", rejectError);
    }
  };

  return (
    <div className="reject_leave_overlay" onClick={onClose}>
      <div
        className="reject_leave_modal"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="reject_leave_header">
          <div className="reject_leave_header_icon">
            <FaBan />
          </div>

          <button
            type="button"
            className="reject_leave_close"
            onClick={onClose}
            aria-label="Close"
          >
            <FaTimes />
          </button>
        </div>

        <div className="reject_leave_content">
          <h2>Reject Leave Request</h2>

          <p className="reject_leave_description">
            Are you sure you want to reject this leave request? Please provide a
            reason for the employee.
          </p>

          <div className="reject_leave_employee">
            <div className="reject_leave_avatar">
              {getEmployeeInitials(employee)}
            </div>

            <div className="reject_leave_employee_info">
              <strong>{employeeName}</strong>

              <span>{formatLeaveType(selectedRequest.leaveType)}</span>
            </div>
          </div>

          <div className="reject_leave_warning">
            <FaExclamationTriangle />

            <span>This action will mark the request as rejected.</span>
          </div>

          {error && (
            <div className="reject_leave_error" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="reject_leave_field">
              <label htmlFor="rejectReason">
                Reason for rejection
                <span>*</span>
              </label>

              <textarea
                id="rejectReason"
                value={reason}
                onChange={(event) => setReason(event.target.value)}
                placeholder="Enter the reason for rejecting this leave request..."
                rows="4"
                maxLength="500"
                disabled={loading}
              />

              <div className="reject_leave_character_count">
                {reason.length}/500
              </div>
            </div>

            <div className="reject_leave_actions">
              <button
                type="button"
                className="reject_leave_btn cancel"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="reject_leave_btn confirm"
                disabled={!reason.trim() || loading}
              >
                <FaBan />
                {loading ? "Rejecting..." : "Reject Request"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

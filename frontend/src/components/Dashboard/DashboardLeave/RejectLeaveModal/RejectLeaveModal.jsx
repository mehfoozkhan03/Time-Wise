import { useEffect, useState } from "react";
import {
  FaTimes,
  FaExclamationTriangle,
  FaBan,
} from "react-icons/fa";

import "./RejectLeaveModal.css";

export default function RejectLeaveModal({
  isOpen,
  request,
  onClose,
  onConfirm,
}) {
  const [reason, setReason] = useState("");

  useEffect(() => {
    if (isOpen) {
      setReason("");
    }
  }, [isOpen, request]);

  if (!isOpen || !request) {
    return null;
  }

  const employee =
    request.employee || request.user || null;

  const employeeName =
    `${employee?.firstName || ""} ${
      employee?.lastName || ""
    }`.trim();

  const formatLeaveType = (leaveType) => {
    if (!leaveType) return "Leave Request";

    const labels = {
      annual: "Annual Leave",
      sick: "Sick Leave",
      casual: "Casual Leave",
    };

    return (
      labels[leaveType.toLowerCase()] ||
      leaveType
    );
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const trimmedReason = reason.trim();

    if (!trimmedReason) {
      return;
    }

    onConfirm?.({
      request,
      reason: trimmedReason,
    });
  };

  return (
    <div
      className="reject_leave_overlay"
      onClick={onClose}
    >
      <div
        className="reject_leave_modal"
        onClick={(event) =>
          event.stopPropagation()
        }
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
            Are you sure you want to reject this
            leave request? Please provide a reason
            for the employee.
          </p>

          <div className="reject_leave_employee">
            <div className="reject_leave_avatar">
              {employee?.firstName?.charAt(0)}
              {employee?.lastName?.charAt(0)}
            </div>

            <div className="reject_leave_employee_info">
              <strong>
                {employeeName ||
                  "Unknown Employee"}
              </strong>

              <span>
                {formatLeaveType(
                  request.leaveType
                )}
              </span>
            </div>
          </div>

          <div className="reject_leave_warning">
            <FaExclamationTriangle />

            <span>
              This action will mark the request
              as rejected.
            </span>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="reject_leave_field">
              <label htmlFor="rejectReason">
                Reason for rejection
                <span>*</span>
              </label>

              <textarea
                id="rejectReason"
                value={reason}
                onChange={(event) =>
                  setReason(event.target.value)
                }
                placeholder="Enter the reason for rejecting this leave request..."
                rows="4"
                maxLength="500"
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
              >
                Cancel
              </button>

              <button
                type="submit"
                className="reject_leave_btn confirm"
                disabled={!reason.trim()}
              >
                <FaBan />
                Reject Request
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
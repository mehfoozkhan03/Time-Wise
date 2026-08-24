import {
  FaTimes,
  FaCalendarAlt,
  FaClock,
  FaUser,
  FaEnvelope,
  FaFileAlt,
  FaCheck,
  FaBan,
} from "react-icons/fa";

import "./LeaveRequestDetails.css";

export default function LeaveRequestDetails({
  isOpen,
  request,
  onClose,
  onApprove,
  onReject,
}) {
  if (!isOpen || !request) {
    return null;
  }

  const employeeName = `${request.employee?.firstName || ""} ${
    request.employee?.lastName || ""
  }`.trim();

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const isPending = request.status === "Pending";

  return (
    <div className="leave_details_overlay" onClick={onClose}>
      <div
        className="leave_details_modal"
        onClick={(event) => event.stopPropagation()}
      >
        {/* Header */}
        <div className="leave_details_header">
          <div>
            <span className="leave_details_eyebrow">
              Leave Request
            </span>

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

        {/* Employee */}
        <div className="leave_details_employee">
          <div className="leave_details_avatar">
            {request.employee?.firstName?.charAt(0)}
            {request.employee?.lastName?.charAt(0)}
          </div>

          <div className="leave_details_employee_info">
            <h3>{employeeName || "Unknown Employee"}</h3>

            <span>
              <FaEnvelope />
              {request.employee?.email || "No email available"}
            </span>
          </div>
        </div>

        {/* Status */}
        <div className="leave_details_status_row">
          <span className="leave_details_status_label">
            Current Status
          </span>

          <span
            className={`leave_details_status ${request.status?.toLowerCase()}`}
          >
            <span className="leave_details_status_dot"></span>

            {request.status || "Unknown"}
          </span>
        </div>

        {/* Request Information */}
        <div className="leave_details_section">
          <div className="leave_details_section_title">
            <FaFileAlt />
            <span>Leave Information</span>
          </div>

          <div className="leave_details_grid">
            <div className="leave_details_item">
              <span className="leave_details_item_label">
                Leave Type
              </span>

              <strong>{request.leaveType || "—"}</strong>
            </div>

            <div className="leave_details_item">
              <span className="leave_details_item_label">
                Total Days
              </span>

              <strong>
                {request.requestedDays || 0}{" "}
                {request.requestedDays === 1 ? "Day" : "Days"}
              </strong>
            </div>

            <div className="leave_details_item">
              <span className="leave_details_item_label">
                Start Date
              </span>

              <strong>
                <FaCalendarAlt />
                {formatDate(request.startDate)}
              </strong>
            </div>

            <div className="leave_details_item">
              <span className="leave_details_item_label">
                End Date
              </span>

              <strong>
                <FaCalendarAlt />
                {formatDate(request.endDate)}
              </strong>
            </div>

            <div className="leave_details_item">
              <span className="leave_details_item_label">
                Applied On
              </span>

              <strong>
                <FaClock />
                {request.appliedDate || "—"}
              </strong>
            </div>
          </div>
        </div>

        {/* Reason */}
        <div className="leave_details_section">
          <div className="leave_details_section_title">
            <FaFileAlt />
            <span>Reason</span>
          </div>

          <div className="leave_details_reason">
            {request.reason || "No reason provided."}
          </div>
        </div>

        {/* Admin Comment */}
        {request.adminComment && (
          <div className="leave_details_section">
            <div className="leave_details_section_title">
              <FaUser />
              <span>Admin Comment</span>
            </div>

            <div className="leave_details_comment">
              {request.adminComment}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="leave_details_footer">
          <button
            type="button"
            className="leave_details_btn secondary"
            onClick={onClose}
          >
            Close
          </button>

          {isPending && (
            <div className="leave_details_actions">
              <button
                type="button"
                className="leave_details_btn reject"
                onClick={() => onReject?.(request)}
              >
                <FaBan />
                Reject
              </button>

              <button
                type="button"
                className="leave_details_btn approve"
                onClick={() => onApprove?.(request)}
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
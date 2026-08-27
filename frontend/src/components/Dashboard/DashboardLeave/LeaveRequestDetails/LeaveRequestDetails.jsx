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

  const employee =
    request.employee || request.user || null;

  const employeeName =
    `${employee?.firstName || ""} ${
      employee?.lastName || ""
    }`.trim();

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatLeaveType = (leaveType) => {
    if (!leaveType) return "—";

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

  const totalDays =
    request.totalDays ??
    request.requestedDays ??
    0;

  const isPending =
    request.status === "Pending";

  return (
    <div
      className="leave_details_overlay"
      onClick={onClose}
    >
      <div
        className="leave_details_modal"
        onClick={(event) =>
          event.stopPropagation()
        }
      >
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

        <div className="leave_details_employee">
          <div className="leave_details_avatar">
            {employee?.firstName?.charAt(0)}
            {employee?.lastName?.charAt(0)}
          </div>

          <div className="leave_details_employee_info">
            <h3>
              {employeeName || "Unknown Employee"}
            </h3>

            <span>
              <FaEnvelope />
              {employee?.email ||
                "No email available"}
            </span>
          </div>
        </div>

        <div className="leave_details_status_row">
          <span className="leave_details_status_label">
            Current Status
          </span>

          <span
            className={`leave_details_status ${request.status?.toLowerCase()}`}
          >
            <span className="leave_details_status_dot" />

            {request.status || "Unknown"}
          </span>
        </div>

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

              <strong>
                {formatLeaveType(
                  request.leaveType
                )}
              </strong>
            </div>

            <div className="leave_details_item">
              <span className="leave_details_item_label">
                Total Days
              </span>

              <strong>
                {totalDays}{" "}
                {totalDays === 1
                  ? "Day"
                  : "Days"}
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
                {formatDate(
                  request.appliedAt ||
                    request.createdAt ||
                    request.appliedDate
                )}
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
            {request.reason ||
              "No reason provided."}
          </div>
        </div>

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
                onClick={() =>
                  onReject?.(request)
                }
              >
                <FaBan />
                Reject
              </button>

              <button
                type="button"
                className="leave_details_btn approve"
                onClick={() =>
                  onApprove?.(request)
                }
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
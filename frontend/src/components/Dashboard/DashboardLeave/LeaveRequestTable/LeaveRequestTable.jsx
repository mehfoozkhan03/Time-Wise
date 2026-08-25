import {
  FaEye,
  FaCheck,
  FaTimes,
  FaUserCircle,
} from "react-icons/fa";

import "./LeaveRequestTable.css";

export default function LeaveRequestTable({
  requests = [],
  onView,
  onApprove,
  onReject,
}) {
  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getEmployeeName = (employee) => {
    if (!employee) return "Unknown Employee";

    return `${employee.firstName || ""} ${
      employee.lastName || ""
    }`.trim();
  };

  const getInitials = (employee) => {
    if (!employee) return "?";

    const first = employee.firstName?.charAt(0) || "";
    const last = employee.lastName?.charAt(0) || "";

    return `${first}${last}`.toUpperCase();
  };

  const handleView = (request) => {
    onView?.(request);
  };

  const handleApprove = (request) => {
    onApprove?.(request);
  };

  const handleReject = (request) => {
    onReject?.(request);
  };

  /* ==========================================
     EMPTY STATE
  ========================================== */

  if (requests.length === 0) {
    return (
      <div className="leave_table_empty">
        <div className="leave_empty_icon">
          <FaUserCircle />
        </div>

        <h3>No Leave Requests Found</h3>

        <p>
          There are no leave requests matching your current
          search or filter.
        </p>
      </div>
    );
  }

  return (
    <div className="leave_table_wrapper">
      <div className="leave_table_scroll">
        <table className="leave_request_table">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Leave Type</th>
              <th>Leave Period</th>
              <th>Days</th>
              <th>Status</th>
              <th>Applied On</th>
              <th className="leave_action_heading">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {requests.map((request) => {
              const isPending =
                request.status === "Pending";

              return (
                <tr key={request.id}>
                  {/* =====================================
                      EMPLOYEE
                  ===================================== */}

                  <td>
                    <div className="leave_employee">
                      <div className="leave_employee_avatar">
                        {getInitials(request.employee)}
                      </div>

                      <div className="leave_employee_info">
                        <span className="leave_employee_name">
                          {getEmployeeName(request.employee)}
                        </span>

                        <span className="leave_employee_email">
                          {request.employee?.email || "—"}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* =====================================
                      LEAVE TYPE
                  ===================================== */}

                  <td>
                    <span className="leave_type">
                      {request.leaveType || "—"}
                    </span>
                  </td>

                  {/* =====================================
                      LEAVE PERIOD
                  ===================================== */}

                  <td>
                    <div className="leave_period">
                      <span>
                        {formatDate(request.startDate)}
                      </span>

                      <span className="leave_period_separator">
                        →
                      </span>

                      <span>
                        {formatDate(request.endDate)}
                      </span>
                    </div>
                  </td>

                  {/* =====================================
                      DAYS
                  ===================================== */}

                  <td>
                    <span className="leave_days">
                      {request.requestedDays || 0}
                    </span>
                  </td>

                  {/* =====================================
                      STATUS
                  ===================================== */}

                  <td>
                    <span
                      className={`leave_status ${request.status?.toLowerCase()}`}
                    >
                      <span className="leave_status_dot"></span>

                      {request.status || "Unknown"}
                    </span>
                  </td>

                  {/* =====================================
                      APPLIED DATE
                  ===================================== */}

                  <td>
                    <span className="leave_applied_date">
                      {request.appliedDate || "—"}
                    </span>
                  </td>

                  {/* =====================================
                      ACTIONS
                  ===================================== */}

                  <td>
                    <div className="leave_table_actions">
                      {/* View */}
                      <button
                        type="button"
                        className="leave_action_btn view"
                        title="View request"
                        aria-label="View leave request"
                        onClick={() =>
                          handleView(request)
                        }
                      >
                        <FaEye />
                      </button>

                      {/* Pending Actions */}
                      {isPending && (
                        <>
                          {/* Approve */}
                          <button
                            type="button"
                            className="leave_action_btn approve"
                            title="Approve request"
                            aria-label="Approve leave request"
                            onClick={() =>
                              handleApprove(request)
                            }
                          >
                            <FaCheck />
                          </button>

                          {/* Reject */}
                          <button
                            type="button"
                            className="leave_action_btn reject"
                            title="Reject request"
                            aria-label="Reject leave request"
                            onClick={() =>
                              handleReject(request)
                            }
                          >
                            <FaTimes />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
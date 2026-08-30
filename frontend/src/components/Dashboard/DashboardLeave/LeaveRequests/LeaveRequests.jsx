import { FaSearch, FaSlidersH } from "react-icons/fa";

import "./LeaveRequests.css";

import LeaveRequestTable from "../LeaveRequestTable/LeaveRequestTable";

const filters = ["All", "Pending", "Approved", "Rejected"];

export default function LeaveRequests({
  requests = [],
  loading = false,
  activeFilter = "All",
  searchTerm = "",
  onSearchChange,
  onFilterChange,
  onView,
  onApprove,
  onReject,
  pagination,
  onPageChange,
}) {
  const currentPage = pagination?.page || 1;
  const totalPages = pagination?.totalPages || 0;
  const totalRequests = pagination?.total || 0;

  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  return (
    <section className="leave_requests">
      <div className="leave_requests_header">
        <div className="leave_requests_heading">
          <h2>Leave Requests</h2>

          <p>Manage and review employee leave requests.</p>
        </div>

        <div className="leave_requests_count">
          <span>{totalRequests}</span>
          <small>Requests</small>
        </div>
      </div>

      <div className="leave_requests_controls">
        <div className="leave_search">
          <FaSearch className="leave_search_icon" />

          <input
            type="text"
            placeholder="Search employee or leave type..."
            value={searchTerm}
            onChange={(event) =>
              onSearchChange?.(event.target.value)
            }
            disabled={loading}
          />
        </div>

        <div className="leave_filter_label">
          <FaSlidersH />
          <span>Filter</span>
        </div>

        <div className="leave_status_filters">
          {filters.map((filter) => (
            <button
              type="button"
              key={filter}
              className={
                activeFilter === filter
                  ? "leave_filter_btn active"
                  : "leave_filter_btn"
              }
              onClick={() => onFilterChange?.(filter)}
              disabled={loading}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {loading && requests.length === 0 ? (
        <div className="leave_requests_loading">
          Loading leave requests...
        </div>
      ) : (
        <>
          <LeaveRequestTable
            requests={requests}
            onView={onView}
            onApprove={onApprove}
            onReject={onReject}
          />

          {totalPages > 1 && (
            <div className="leave_pagination">
              <button
                type="button"
                className="leave_pagination_btn"
                onClick={() => onPageChange?.(currentPage - 1)}
                disabled={!canGoPrevious || loading}
              >
                Previous
              </button>

              <div className="leave_pagination_info">
                <span>
                  Page {currentPage} of {totalPages}
                </span>
              </div>

              <button
                type="button"
                className="leave_pagination_btn"
                onClick={() => onPageChange?.(currentPage + 1)}
                disabled={!canGoNext || loading}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}
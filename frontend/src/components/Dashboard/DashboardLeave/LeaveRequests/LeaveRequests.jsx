import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { FaSearch, FaSlidersH } from "react-icons/fa";

import "./LeaveRequests.css";

import LeaveRequestTable from "../LeaveRequestTable/LeaveRequestTable";

import { fetchAdminLeaves } from "../../../../store/leaveSlice";

const filters = ["All", "Pending", "Approved", "Rejected"];

export default function LeaveRequests({ onView, onApprove, onReject }) {
  const dispatch = useDispatch();

  const {
    adminRequests = [],
    adminPagination = null,
    loading = false,
  } = useSelector((state) => state.leave);

  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [page, setPage] = useState(1);

  const limit = 10;

  const currentPage = adminPagination?.page || page;
  const totalPages = adminPagination?.totalPages || 0;
  const totalRequests = adminPagination?.total || 0;

  const formattedRequests = adminRequests.map((request) => ({
    ...request,
    id: request._id,
    employee: request.user || request.employee,
    user: request.user || request.employee,
  }));

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(
        fetchAdminLeaves({
          page,
          limit,
          status: activeFilter,
          search: searchTerm,
        }),
      );
    }, 400);

    return () => clearTimeout(timer);
  }, [dispatch, page, activeFilter, searchTerm]);

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    setPage(1);
  };

  const handleFilterChange = (newStatus) => {
    if (newStatus === activeFilter) return;

    setActiveFilter(newStatus);
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1) return;

    if (totalPages > 0 && newPage > totalPages) {
      return;
    }

    if (newPage === currentPage) {
      return;
    }

    setPage(newPage);
  };

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
            onChange={(event) => handleSearchChange(event.target.value)}
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
              onClick={() => handleFilterChange(filter)}
              disabled={loading}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {loading && formattedRequests.length === 0 ? (
        <div className="leave_requests_loading">Loading leave requests...</div>
      ) : (
        <>
          <LeaveRequestTable
            requests={formattedRequests}
            onView={onView}
            onApprove={onApprove}
            onReject={onReject}
          />

          {totalPages > 1 && (
            <div className="leave_pagination">
              <button
                type="button"
                className="leave_pagination_btn"
                onClick={() => handlePageChange(currentPage - 1)}
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
                onClick={() => handlePageChange(currentPage + 1)}
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

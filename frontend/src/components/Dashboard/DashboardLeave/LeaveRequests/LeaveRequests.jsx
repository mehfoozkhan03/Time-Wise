import { useMemo, useState } from "react";
import { FaSearch, FaSlidersH } from "react-icons/fa";

import "./LeaveRequests.css";

import LeaveRequestTable from "../LeaveRequestTable/LeaveRequestTable";

export default function LeaveRequests({
  requests = [],
  onView,
  onApprove,
  onReject,
}) {
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const filters = ["All", "Pending", "Approved", "Rejected"];

  const filteredRequests = useMemo(() => {
    return requests.filter((request) => {
      const matchesStatus =
        activeFilter === "All" || request.status === activeFilter;

      const employeeName = `${request.employee?.firstName || ""} ${
        request.employee?.lastName || ""
      }`.toLowerCase();

      const email = request.employee?.email?.toLowerCase() || "";

      const leaveType = request.leaveType?.toLowerCase() || "";

      const search = searchTerm.toLowerCase().trim();

      const matchesSearch =
        !search ||
        employeeName.includes(search) ||
        email.includes(search) ||
        leaveType.includes(search);

      return matchesStatus && matchesSearch;
    });
  }, [requests, activeFilter, searchTerm]);

  return (
    <section className="leave_requests">
      {/* Header */}
      <div className="leave_requests_header">
        <div className="leave_requests_heading">
          <h2>Leave Requests</h2>

          <p>
            Manage and review employee leave requests.
          </p>
        </div>

        <div className="leave_requests_count">
          <span>{filteredRequests.length}</span>
          <small>Requests</small>
        </div>
      </div>

      {/* Controls */}
      <div className="leave_requests_controls">
        {/* Search */}
        <div className="leave_search">
          <FaSearch className="leave_search_icon" />

          <input
            type="text"
            placeholder="Search employee or leave type..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>

        {/* Filter label */}
        <div className="leave_filter_label">
          <FaSlidersH />
          <span>Filter</span>
        </div>

        {/* Status Filters */}
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
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <LeaveRequestTable
        requests={filteredRequests}
        onView={onView}
        onApprove={onApprove}
        onReject={onReject}
      />
    </section>
  );
}
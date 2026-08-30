import { useMemo, useState } from "react";
import { FaSearch, FaSlidersH } from "react-icons/fa";

import "./LeaveRequests.css";

import LeaveRequestTable from "../LeaveRequestTable/LeaveRequestTable";

const filters = [
  "All",
  "Pending",
  "Approved",
  "Rejected",
];

const getEmployeeSearchData = (request) => {
  const employee = request.employee || request.user;

  const name = [
    employee?.firstName,
    employee?.lastName,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  const email = employee?.email?.toLowerCase() || "";
  const leaveType = request.leaveType?.toLowerCase() || "";

  return {
    name,
    email,
    leaveType,
  };
};

export default function LeaveRequests({
  requests = [],
  loading = false,
  onView,
  onApprove,
  onReject,
}) {
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredRequests = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    return requests.filter((request) => {
      const matchesStatus =
        activeFilter === "All" ||
        request.status === activeFilter;

      if (!matchesStatus) {
        return false;
      }

      if (!search) {
        return true;
      }

      const {
        name,
        email,
        leaveType,
      } = getEmployeeSearchData(request);

      return (
        name.includes(search) ||
        email.includes(search) ||
        leaveType.includes(search)
      );
    });
  }, [requests, activeFilter, searchTerm]);

  return (
    <section className="leave_requests">
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

      <div className="leave_requests_controls">
        <div className="leave_search">
          <FaSearch className="leave_search_icon" />

          <input
            type="text"
            placeholder="Search employee or leave type..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
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
              onClick={() => setActiveFilter(filter)}
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
        <LeaveRequestTable
          requests={filteredRequests}
          onView={onView}
          onApprove={onApprove}
          onReject={onReject}
        />
      )}
    </section>
  );
}
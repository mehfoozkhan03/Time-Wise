import { useEffect, useState } from "react";
import { MdVisibility } from "react-icons/md";

import CustomSelect from "../../../Common/CustomSelect/CustomSelect";
import LeaveDetails from "../LeaveDetails/LeaveDetails";

import "./LeaveHistory.css";

const filterOptions = [
  {
    value: "All",
    label: "All Requests",
  },
  {
    value: "Pending",
    label: "Pending",
  },
  {
    value: "Approved",
    label: "Approved",
  },
  {
    value: "Rejected",
    label: "Rejected",
  },
  {
    value: "Cancelled",
    label: "Cancelled",
  },
];

const LeaveHistory = ({
  requests = [],
  loading = false,
  activeFilter = "All",
  pagination = null,
  onFilterChange,
  onPageChange,
  onCancelRequest,
}) => {
  const [selectedRequest, setSelectedRequest] = useState(null);

  useEffect(() => {
    if (!selectedRequest) {
      return;
    }

    const updatedRequest = requests.find(
      (request) => request.id === selectedRequest.id,
    );

    if (updatedRequest) {
      setSelectedRequest(updatedRequest);
    } else {
      setSelectedRequest(null);
    }
  }, [requests, selectedRequest]);

  const handleFilterChange = (event) => {
    const newFilter = event.target.value;

    if (newFilter === activeFilter) {
      return;
    }

    onFilterChange?.(newFilter);
  };

  const handleViewRequest = (request) => {
    setSelectedRequest(request);
  };

  const handlePreviousPage = () => {
    if (loading) {
      return;
    }

    onPageChange?.((pagination?.page || 1) - 1);
  };

  const handleNextPage = () => {
    if (loading) {
      return;
    }

    onPageChange?.((pagination?.page || 1) + 1);
  };

  const currentPage = pagination?.page || 1;
  const totalPages = pagination?.totalPages || 0;
  const totalRequests = pagination?.total || 0;

  const hasPreviousPage = currentPage > 1;
  const hasNextPage = totalPages > 0 && currentPage < totalPages;

  const showPagination = totalPages > 1;

  const emptyMessage =
    activeFilter === "All"
      ? "You have not submitted any leave requests yet."
      : `You have no ${activeFilter.toLowerCase()} leave requests.`;

  return (
    <>
      <section className="leaveHistory">
        <div className="leaveHistory-header">
          <div>
            <h2>Leave Requests</h2>

            <p>View and manage your leave requests.</p>
          </div>
        </div>

        <div className="leaveHistory-filter-row">
          <div className="leaveHistory-filter">
            <label
              htmlFor="leaveHistoryStatus"
              className="leaveHistory-filter-label"
            >
              Filter by Status
            </label>

            <CustomSelect
              id="leaveHistoryStatus"
              name="status"
              value={activeFilter}
              options={filterOptions}
              onChange={handleFilterChange}
              disabled={loading}
              placeholder="Select status"
            />
          </div>

          {totalRequests > 0 && (
            <span className="leaveHistory-count">
              {totalRequests} {totalRequests === 1 ? "request" : "requests"}
            </span>
          )}
        </div>

        {loading && requests.length === 0 ? (
          <div className="leaveHistory-loading">
            <span>Loading leave requests...</span>
          </div>
        ) : requests.length === 0 ? (
          <div className="leaveHistory-empty">
            <h3>No leave requests</h3>

            <p>{emptyMessage}</p>
          </div>
        ) : (
          <>
            <div className="leaveHistory-table-wrapper">
              <table className="leaveHistory-table">
                <thead>
                  <tr>
                    <th>Leave Type</th>
                    <th>Dates</th>
                    <th>Days</th>
                    <th>Status</th>
                    <th>Applied</th>
                    <th></th>
                  </tr>
                </thead>

                <tbody>
                  {requests.map((request) => {
                    const status = request.status || "Pending";

                    return (
                      <tr key={request.id}>
                        <td>{request.leaveType}</td>

                        <td>
                          {request.startDate} - {request.endDate}
                        </td>

                        <td>{request.requestedDays}</td>

                        <td>
                          <span
                            className={`leaveHistory-status ${status.toLowerCase()}`}
                          >
                            {status}
                          </span>
                        </td>

                        <td>{request.appliedDate}</td>

                        <td>
                          <button
                            type="button"
                            className="leaveHistory-view"
                            onClick={() => handleViewRequest(request)}
                            aria-label={`View ${request.leaveType} request`}
                          >
                            <MdVisibility />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {showPagination && (
              <div className="leaveHistory-pagination">
                <button
                  type="button"
                  className="leaveHistory-pagination-btn"
                  onClick={handlePreviousPage}
                  disabled={loading || !hasPreviousPage}
                  aria-label="Previous page"
                >
                  Previous
                </button>

                <div className="leaveHistory-pagination-info">
                  <span>
                    Page <strong>{currentPage}</strong> of{" "}
                    <strong>{totalPages}</strong>
                  </span>
                </div>

                <button
                  type="button"
                  className="leaveHistory-pagination-btn"
                  onClick={handleNextPage}
                  disabled={loading || !hasNextPage}
                  aria-label="Next page"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </section>

      {selectedRequest && (
        <LeaveDetails
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
          onCancel={onCancelRequest}
        />
      )}
    </>
  );
};

export default LeaveHistory;

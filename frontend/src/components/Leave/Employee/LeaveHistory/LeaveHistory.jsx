import { useMemo, useState } from "react";
import { MdVisibility } from "react-icons/md";

import LeaveDetails from "../LeaveDetails/LeaveDetails";

import "./LeaveHistory.css";

const filters = [
  "All",
  "Pending",
  "Approved",
  "Rejected",
  "Cancelled",
];

const LeaveHistory = ({ requests = [], onCancelRequest }) => {
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedRequest, setSelectedRequest] = useState(null);

  const filteredRequests = useMemo(() => {
    if (activeFilter === "All") {
      return requests;
    }

    return requests.filter(
      (request) =>
        request.status.toLowerCase() === activeFilter.toLowerCase()
    );
  }, [requests, activeFilter]);

  return (
    <>
      <section className="leaveHistory">
        <div className="leaveHistory-header">
          <div>
            <h2>Leave Requests</h2>
            <p>View and manage your leave requests.</p>
          </div>
        </div>

        <div className="leaveHistory-filters">
          {filters.map((filter) => (
            <button
              key={filter}
              type="button"
              className={
                activeFilter === filter
                  ? "leaveHistory-filter active"
                  : "leaveHistory-filter"
              }
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>

        {filteredRequests.length === 0 ? (
          <div className="leaveHistory-empty">
            <h3>No leave requests</h3>

            <p>
              {activeFilter === "All"
                ? "You have not submitted any leave requests yet."
                : `You have no ${activeFilter.toLowerCase()} leave requests.`}
            </p>
          </div>
        ) : (
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
                {filteredRequests.map((request) => (
                  <tr key={request.id}>
                    <td>{request.leaveType}</td>

                    <td>
                      {request.startDate} - {request.endDate}
                    </td>

                    <td>{request.requestedDays}</td>

                    <td>
                      <span
                        className={`leaveHistory-status ${request.status.toLowerCase()}`}
                      >
                        {request.status}
                      </span>
                    </td>

                    <td>{request.appliedDate}</td>

                    <td>
                      <button
                        type="button"
                        className="leaveHistory-view"
                        onClick={() => setSelectedRequest(request)}
                        aria-label={`View ${request.leaveType} request`}
                      >
                        <MdVisibility />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
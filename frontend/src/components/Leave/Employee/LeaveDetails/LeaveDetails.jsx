import { useState } from "react";
import { MdClose } from "react-icons/md";

import "./LeaveDetails.css";

const LeaveDetails = ({ request, onClose, onCancel }) => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [error, setError] = useState("");

  if (!request) {
    return null;
  }

  const status = request.status || "Pending";
  const canCancel = status === "Pending";

  const handleClose = () => {
    if (cancelling) {
      return;
    }

    onClose();
  };

  const handleCancel = async () => {
    try {
      setCancelling(true);
      setError("");

      await onCancel(request.id);

      onClose();
    } catch (cancelError) {
      setError(
        cancelError?.message || "Failed to cancel leave request.",
      );
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div
      className="leaveDetails-overlay"
      onMouseDown={handleClose}
    >
      <div
        className="leaveDetails-modal"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="leaveDetails-header">
          <div>
            <h2>Leave Details</h2>
            <p>View details of your leave request.</p>
          </div>

          <button
            type="button"
            className="leaveDetails-close"
            onClick={handleClose}
            aria-label="Close"
            disabled={cancelling}
          >
            <MdClose />
          </button>
        </div>

        <div className="leaveDetails-content">
          <div className="leaveDetails-status-row">
            <span className="leaveDetails-label">Status</span>

            <span
              className={`leaveDetails-status ${status.toLowerCase()}`}
            >
              {status}
            </span>
          </div>

          <div className="leaveDetails-grid">
            <div className="leaveDetails-item">
              <span>Leave Type</span>
              <strong>{request.leaveType}</strong>
            </div>

            <div className="leaveDetails-item">
              <span>Total Days</span>
              <strong>{request.requestedDays} days</strong>
            </div>

            <div className="leaveDetails-item">
              <span>Start Date</span>
              <strong>{request.startDate}</strong>
            </div>

            <div className="leaveDetails-item">
              <span>End Date</span>
              <strong>{request.endDate}</strong>
            </div>

            <div className="leaveDetails-item">
              <span>Applied Date</span>
              <strong>{request.appliedDate}</strong>
            </div>
          </div>

          <div className="leaveDetails-reason">
            <span>Reason</span>
            <p>{request.reason}</p>
          </div>

          {request.adminComment && (
            <div className="leaveDetails-comment">
              <span>Admin Comment</span>
              <p>{request.adminComment}</p>
            </div>
          )}

          {error && (
            <p className="leaveDetails-error">
              {error}
            </p>
          )}
        </div>

        <div className="leaveDetails-footer">
          {canCancel && !showConfirmation && (
            <button
              type="button"
              className="leaveDetails-cancel-btn"
              onClick={() => {
                setError("");
                setShowConfirmation(true);
              }}
              disabled={cancelling}
            >
              Cancel Request
            </button>
          )}

          {!showConfirmation && (
            <button
              type="button"
              className="leaveDetails-close-btn"
              onClick={handleClose}
              disabled={cancelling}
            >
              Close
            </button>
          )}

          {showConfirmation && (
            <div className="leaveDetails-confirmation">
              <p>
                Are you sure you want to cancel this leave request?
              </p>

              <div className="leaveDetails-confirmation-actions">
                <button
                  type="button"
                  className="leaveDetails-keep-btn"
                  onClick={() => {
                    setError("");
                    setShowConfirmation(false);
                  }}
                  disabled={cancelling}
                >
                  Keep Request
                </button>

                <button
                  type="button"
                  className="leaveDetails-confirm-btn"
                  onClick={handleCancel}
                  disabled={cancelling}
                >
                  {cancelling
                    ? "Cancelling..."
                    : "Cancel Request"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeaveDetails;
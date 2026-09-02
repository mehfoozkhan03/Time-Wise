import { useState } from "react";
import {
  MdCalendarToday,
  MdClose,
  MdEventAvailable,
  MdInfoOutline,
} from "react-icons/md";

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
      setError(cancelError?.message || "Failed to cancel leave request.");
    } finally {
      setCancelling(false);
    }
  };

  const handleShowConfirmation = () => {
    setError("");
    setShowConfirmation(true);
  };

  const handleKeepRequest = () => {
    if (cancelling) {
      return;
    }

    setError("");
    setShowConfirmation(false);
  };

  return (
    <div className="leaveDetails-overlay" onMouseDown={handleClose}>
      <div
        className="leaveDetails-modal"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="leaveDetails-header">
          <div className="leaveDetails-heading">
            <div className="leaveDetails-title-row">
              <div className="leaveDetails-title-icon">
                <MdEventAvailable />
              </div>

              <div>
                <h2>Leave Details</h2>

                <p>View details of your leave request.</p>
              </div>
            </div>
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
            <div className="leaveDetails-status-heading">
              <MdInfoOutline />

              <span className="leaveDetails-label">Request Status</span>
            </div>

            <span className={`leaveDetails-status ${status.toLowerCase()}`}>
              {status}
            </span>
          </div>

          <div className="leaveDetails-section-title">
            <span>Request Information</span>
          </div>

          <div className="leaveDetails-grid">
            <div className="leaveDetails-item">
              <span>Leave Type</span>

              <strong>{request.leaveType}</strong>
            </div>

            <div className="leaveDetails-item">
              <span>Total Days</span>

              <strong>
                {request.requestedDays}{" "}
                {request.requestedDays === 1 ? "day" : "days"}
              </strong>
            </div>

            <div className="leaveDetails-item">
              <span>Start Date</span>

              <strong>
                <MdCalendarToday />
                {request.startDate}
              </strong>
            </div>

            <div className="leaveDetails-item">
              <span>End Date</span>

              <strong>
                <MdCalendarToday />
                {request.endDate}
              </strong>
            </div>

            <div className="leaveDetails-item leaveDetails-item-full">
              <span>Applied Date</span>

              <strong>
                <MdCalendarToday />
                {request.appliedDate}
              </strong>
            </div>
          </div>

          <div className="leaveDetails-section-title">
            <span>Leave Reason</span>
          </div>

          <div className="leaveDetails-reason">
            <p>{request.reason || "No reason provided."}</p>
          </div>

          {request.adminComment && (
            <>
              <div className="leaveDetails-section-title">
                <span>Admin Response</span>
              </div>

              <div className="leaveDetails-comment">
                <div className="leaveDetails-comment-icon">
                  <MdInfoOutline />
                </div>

                <div>
                  <span>Admin Comment</span>

                  <p>{request.adminComment}</p>
                </div>
              </div>
            </>
          )}

          {error && (
            <p className="leaveDetails-error" role="alert">
              {error}
            </p>
          )}
        </div>

        <div className="leaveDetails-footer">
          {!showConfirmation ? (
            <div className="leaveDetails-footer-actions">
              {canCancel && (
                <button
                  type="button"
                  className="leaveDetails-cancel-btn"
                  onClick={handleShowConfirmation}
                  disabled={cancelling}
                >
                  Cancel Request
                </button>
              )}

              <button
                type="button"
                className="leaveDetails-close-btn"
                onClick={handleClose}
                disabled={cancelling}
              >
                Close
              </button>
            </div>
          ) : (
            <div className="leaveDetails-confirmation">
              <div className="leaveDetails-confirmation-message">
                <div className="leaveDetails-confirmation-icon">
                  <MdInfoOutline />
                </div>

                <div>
                  <strong>Cancel this request?</strong>

                  <p>This action will cancel your pending leave request.</p>
                </div>
              </div>

              <div className="leaveDetails-confirmation-actions">
                <button
                  type="button"
                  className="leaveDetails-keep-btn"
                  onClick={handleKeepRequest}
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
                  {cancelling ? "Cancelling..." : "Cancel Request"}
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

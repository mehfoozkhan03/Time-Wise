import { useMemo, useState } from "react";
import { MdClose } from "react-icons/md";

import "./ApplyLeave.css";

const leaveTypeLabels = {
  annual: "Annual Leave",
  sick: "Sick Leave",
  casual: "Casual Leave",
};

const ApplyLeave = ({ onClose, onSubmit, balance }) => {
  const [formData, setFormData] = useState({
    leaveType: "",
    startDate: "",
    endDate: "",
    reason: "",
  });

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  const leaveTypes = useMemo(
    () => [
      {
        value: "annual",
        label: leaveTypeLabels.annual,
        balance: balance?.annual?.remaining ?? 0,
      },
      {
        value: "sick",
        label: leaveTypeLabels.sick,
        balance: balance?.sick?.remaining ?? 0,
      },
      {
        value: "casual",
        label: leaveTypeLabels.casual,
        balance: balance?.casual?.remaining ?? 0,
      },
    ],
    [balance],
  );

  const selectedLeave = useMemo(
    () => leaveTypes.find((leave) => leave.value === formData.leaveType),
    [formData.leaveType, leaveTypes],
  );

  const requestedDays = useMemo(() => {
    if (!formData.startDate || !formData.endDate) {
      return 0;
    }

    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);

    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    const difference = end.getTime() - start.getTime();

    if (difference < 0) {
      return 0;
    }

    return Math.floor(difference / (1000 * 60 * 60 * 24)) + 1;
  }, [formData.startDate, formData.endDate]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!balance) {
      setError("Leave balance is still loading. Please try again.");
      return;
    }

    if (!formData.leaveType) {
      setError("Please select a leave type.");
      return;
    }

    if (!formData.startDate) {
      setError("Please select a start date.");
      return;
    }

    if (!formData.endDate) {
      setError("Please select an end date.");
      return;
    }

    if (formData.startDate < today) {
      setError("Start date cannot be in the past.");
      return;
    }

    if (formData.endDate < formData.startDate) {
      setError("End date cannot be before start date.");
      return;
    }

    if (!selectedLeave) {
      setError("Invalid leave type.");
      return;
    }

    if (selectedLeave.balance <= 0) {
      setError("You have no remaining balance for this leave type.");
      return;
    }

    if (requestedDays > selectedLeave.balance) {
      setError("Requested days cannot exceed your available balance.");
      return;
    }

    if (!formData.reason.trim()) {
      setError("Please enter a reason for your leave.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      await onSubmit({
        leaveType: formData.leaveType,
        startDate: formData.startDate,
        endDate: formData.endDate,
        reason: formData.reason.trim(),
      });
    } catch (submitError) {
      setError(submitError?.message || "Failed to submit leave request.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="applyLeave-overlay" onMouseDown={onClose}>
      <div
        className="applyLeave-modal"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="applyLeave-header">
          <div>
            <h2>Apply for Leave</h2>
            <p>Submit a new leave request.</p>
          </div>

          <button
            type="button"
            className="applyLeave-close"
            onClick={onClose}
            aria-label="Close"
            disabled={submitting}
          >
            <MdClose />
          </button>
        </div>

        <form className="applyLeave-form" onSubmit={handleSubmit}>
          <div className="applyLeave-field">
            <label htmlFor="leaveType">Leave Type</label>

            <select
              id="leaveType"
              name="leaveType"
              value={formData.leaveType}
              onChange={handleChange}
              disabled={submitting || !balance}
            >
              <option value="">Select leave type</option>

              {leaveTypes.map((leave) => (
                <option
                  key={leave.value}
                  value={leave.value}
                  disabled={leave.balance <= 0}
                >
                  {leave.label}
                </option>
              ))}
            </select>
          </div>

          <div className="applyLeave-date-grid">
            <div className="applyLeave-field">
              <label htmlFor="startDate">Start Date</label>

              <input
                id="startDate"
                name="startDate"
                type="date"
                min={today}
                value={formData.startDate}
                onChange={handleChange}
                disabled={submitting || !balance}
              />
            </div>

            <div className="applyLeave-field">
              <label htmlFor="endDate">End Date</label>

              <input
                id="endDate"
                name="endDate"
                type="date"
                min={formData.startDate || today}
                value={formData.endDate}
                onChange={handleChange}
                disabled={submitting || !balance}
              />
            </div>
          </div>

          <div className="applyLeave-info">
            <div>
              <span>Available Balance</span>
              <strong>{selectedLeave?.balance ?? 0} days</strong>
            </div>

            <div>
              <span>Requested Days</span>
              <strong>{requestedDays} days</strong>
            </div>
          </div>

          <div className="applyLeave-field">
            <label htmlFor="reason">Reason</label>

            <textarea
              id="reason"
              name="reason"
              rows="4"
              placeholder="Enter the reason for your leave"
              value={formData.reason}
              onChange={handleChange}
              disabled={submitting || !balance}
            />
          </div>

          {error && <p className="applyLeave-error">{error}</p>}

          <div className="applyLeave-actions">
            <button
              type="button"
              className="applyLeave-cancel"
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="applyLeave-submit"
              disabled={submitting || !balance}
            >
              {submitting ? "Submitting..." : "Submit Request"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplyLeave;
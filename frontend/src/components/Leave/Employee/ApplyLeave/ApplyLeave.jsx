import { useMemo, useState } from "react";
import { MdClose } from "react-icons/md";

import "./ApplyLeave.css";

const leaveTypes = [
  {
    value: "annual",
    label: "Annual Leave",
    balance: 13,
  },
  {
    value: "sick",
    label: "Sick Leave",
    balance: 8,
  },
  {
    value: "casual",
    label: "Casual Leave",
    balance: 2,
  },
];

const ApplyLeave = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    leaveType: "",
    startDate: "",
    endDate: "",
    reason: "",
  });

  const [error, setError] = useState("");

  const selectedLeave = useMemo(
    () => leaveTypes.find((leave) => leave.value === formData.leaveType),
    [formData.leaveType],
  );

  const requestedDays = useMemo(() => {
    if (!formData.startDate || !formData.endDate) {
      return 0;
    }

    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);

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

  const handleSubmit = (event) => {
    event.preventDefault();

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

    if (new Date(formData.endDate) < new Date(formData.startDate)) {
      setError("End date cannot be before start date.");
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

    const newRequest = {
      id: Date.now(),
      leaveType: selectedLeave.label,
      leaveTypeValue: formData.leaveType,
      startDate: formData.startDate,
      endDate: formData.endDate,
      requestedDays,
      reason: formData.reason.trim(),
      status: "Pending",
      appliedDate: new Date().toLocaleDateString("en-GB"),
    };

    onSubmit(newRequest);
    onClose();
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
            >
              <option value="">Select leave type</option>

              {leaveTypes.map((leave) => (
                <option key={leave.value} value={leave.value}>
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
                value={formData.startDate}
                onChange={handleChange}
              />
            </div>

            <div className="applyLeave-field">
              <label htmlFor="endDate">End Date</label>

              <input
                id="endDate"
                name="endDate"
                type="date"
                value={formData.endDate}
                onChange={handleChange}
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
            />
          </div>

          {error && <p className="applyLeave-error">{error}</p>}

          <div className="applyLeave-actions">
            <button
              type="button"
              className="applyLeave-cancel"
              onClick={onClose}
            >
              Cancel
            </button>

            <button type="submit" className="applyLeave-submit">
              Submit Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplyLeave;

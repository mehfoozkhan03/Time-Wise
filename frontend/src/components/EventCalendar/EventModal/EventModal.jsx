import "./EventModal.css";

import { memo, useCallback, useEffect } from "react";

import {
  FaTimes,
  FaEdit,
  FaTrash,
  FaUser,
  FaBuilding,
  FaCalendarAlt,
  FaClock,
  FaTag,
} from "react-icons/fa";

import { EVENT_CONFIG } from "../../../data/eventConfig";

import { formatFullDate, formatTime } from "../../../utils/dateUtils";

import InfoRow from "../../Common/InfoRow/InfoRow";

function EventModal({ event, onClose, onEdit, onDelete }) {
  /* =========================================
       ESC Close
    ========================================= */

  useEffect(() => {
    if (!event) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [event, onClose]);

  /* =========================================
       Handlers
    ========================================= */

  const handleOverlayClick = useCallback(() => {
    onClose();
  }, [onClose]);

  const handleModalClick = useCallback((e) => {
    e.stopPropagation();
  }, []);

  const handleEdit = useCallback(() => {
    onEdit?.(event);
  }, [event, onEdit]);

  const handleDelete = useCallback(() => {
    onDelete?.(event);
  }, [event, onDelete]);

  if (!event) return null;

  const config = EVENT_CONFIG[event.type];

  if (!config) return null;

  const Icon = config.icon;

  const employeeName = event.employeeName ?? event.employee ?? "N/A";

  const eventTime = event.isAllDay
    ? "All Day"
    : `${formatTime(event.startTime)} - ${formatTime(event.endTime)}`;

  return (
    <div
      className="eventModalOverlay"
      onClick={handleOverlayClick}
      role="presentation"
    >
      <div
        className="eventModal"
        onClick={handleModalClick}
        role="dialog"
        aria-modal="true"
        aria-labelledby="event-modal-title"
      >
        {/* Header */}

        <div className="modalHeader">
          <div className="modalTitle">
            <div
              className="eventIcon"
              style={{
                "--event-color": config.color,
              }}
            >
              <Icon />
            </div>

            <div>
              <h2 id="event-modal-title">{event.title}</h2>

              <span
                className="eventType"
                style={{
                  "--event-color": config.color,
                }}
              >
                {config.label}
              </span>
            </div>
          </div>

          <button
            type="button"
            className="closeBtn"
            onClick={onClose}
            aria-label="Close"
          >
            <FaTimes />
          </button>
        </div>

        {/* Body */}

        <div className="modalBody">
          <InfoRow icon={FaUser} label="Employee" value={employeeName} />

          <InfoRow
            icon={FaBuilding}
            label="Department"
            value={event.department || "N/A"}
          />

          <InfoRow
            icon={FaCalendarAlt}
            label="Date"
            value={formatFullDate(event.date)}
          />

          <InfoRow icon={FaClock} label="Time" value={eventTime} />

          <InfoRow icon={FaTag} label="Event Type" value={config.label} />

          <div className="descriptionCard">
            <h3>Description</h3>

            <p>{event.description || "No description available."}</p>
          </div>
        </div>

        {/* Footer */}

        <div className="modalFooter">
          <button type="button" className="editBtn" onClick={handleEdit}>
            <FaEdit />
            Edit
          </button>

          <button type="button" className="deleteBtn" onClick={handleDelete}>
            <FaTrash />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default memo(EventModal);

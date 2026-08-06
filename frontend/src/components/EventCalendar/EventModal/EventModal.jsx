import "./EventModal.css";

import { memo, useEffect, useMemo, useRef, useCallback } from "react";

import {
  FaTimes,
  FaEdit,
  FaTrash,
  FaUser,
  FaBuilding,
  FaCalendarAlt,
  FaClock,
  FaTag,
  FaMapMarkerAlt,
  FaExclamationCircle,
  FaIdBadge,
} from "react-icons/fa";

import { EVENT_CONFIG } from "../../../data/eventConfig";
import { formatFullDate, formatTime } from "../../../utils/dateUtils";

import InfoRow from "../../Common/InfoRow/InfoRow";

function EventModal({ event, onClose, onEdit, onDelete, canEdit = false }) {
  const closeButtonRef = useRef(null);

  const config = useMemo(() => {
    if (!event) {
      return null;
    }

    return EVENT_CONFIG[String(event.type).toUpperCase()];
  }, [event]);

  const isHoliday = useMemo(() => {
    return Boolean(event?.isHoliday);
  }, [event]);

  const displayName = useMemo(() => {
    if (!event || !config) {
      return "";
    }

    if (isHoliday) {
      return config.label;
    }

    return event.employeeName || "N/A";
  }, [event, config, isHoliday]);

  const eventTime = useMemo(() => {
    if (!event) {
      return "--";
    }

    if (event.isAllDay) {
      return "All Day";
    }

    const start = event.startTime ? formatTime(event.startTime) : "";
    const end = event.endTime ? formatTime(event.endTime) : "";

    if (start && end) {
      return `${start} - ${end}`;
    }

    if (start) {
      return `Starts at ${start}`;
    }

    if (end) {
      return `Ends at ${end}`;
    }

    return "--";
  }, [event]);

  useEffect(() => {
    if (!event) {
      return;
    }

    closeButtonRef.current?.focus();

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose?.();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [event, onClose]);

  const handleClose = useCallback(() => {
    onClose?.();
  }, [onClose]);

  const handleOverlayClick = useCallback(
    (e) => {
      if (e.target === e.currentTarget) {
        handleClose();
      }
    },
    [handleClose],
  );

  const handleModalClick = useCallback((e) => {
    e.stopPropagation();
  }, []);

  const handleEdit = useCallback(() => {
    onClose?.();
    onEdit?.(event);
  }, [event, onEdit, onClose]);

  const handleDelete = useCallback(() => {
    onClose?.();
    onDelete?.(event);
  }, [event, onDelete, onClose]);

  if (!event || !config) {
    return null;
  }

  const Icon = config.icon;

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
        aria-describedby="event-modal-description"
      >
        <div className="modalHeader">
          <div className="modalTitle">
            <div
              className="eventIcon"
              style={{
                "--event-color": config.color,
              }}
              aria-hidden="true"
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
            ref={closeButtonRef}
            type="button"
            className="closeBtn"
            onClick={handleClose}
            aria-label="Close Event"
          >
            <FaTimes />
          </button>
        </div>

        <div className="modalBody">
          <InfoRow
            icon={FaUser}
            label={isHoliday ? "Holiday Type" : "Employee"}
            value={displayName}
          />

          {!isHoliday && (
            <>
              <InfoRow
                icon={FaBuilding}
                label="Department"
                value={event.department || "N/A"}
              />

              <InfoRow
                icon={FaIdBadge}
                label="Designation"
                value={event.designation || "N/A"}
              />

              <InfoRow
                icon={FaMapMarkerAlt}
                label="Location"
                value={event.location || "N/A"}
              />

              <InfoRow
                icon={FaExclamationCircle}
                label="Priority"
                value={event.priority || "MEDIUM"}
              />
            </>
          )}

          <InfoRow
            icon={FaCalendarAlt}
            label="Date"
            value={formatFullDate(event.date)}
          />

          <InfoRow icon={FaClock} label="Time" value={eventTime} />

          <InfoRow icon={FaTag} label="Event Type" value={config.label} />

          <div className="descriptionCard" id="event-modal-description">
            <h3>Description</h3>

            <p>{event.description || "No description provided."}</p>
          </div>
        </div>

        {canEdit && (
          <div className="modalFooter">
            {onEdit && (
              <button type="button" className="editBtn" onClick={handleEdit}>
                <FaEdit />
                Edit
              </button>
            )}

            {onDelete && (
              <button
                type="button"
                className="deleteBtn"
                onClick={handleDelete}
              >
                <FaTrash />
                Delete
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

EventModal.displayName = "EventModal";

export default memo(EventModal);

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

function EventModal({
  event,
  onClose,
  onEdit,
  onDelete,
  canEdit = false,
  canDelete = false,
  isLoading = false,
}) {
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

    if (event.employeeName) {
      return event.employeeName;
    }

    if (typeof event.employeeId === "object") {
      return event.employeeId?.name || "N/A";
    }

    return "N/A";
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
      if (e.key === "Escape" && !isLoading) {
        onClose?.();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [event, onClose, isLoading]);

  const handleClose = useCallback(() => {
    if (isLoading) {
      return;
    }

    onClose?.();
  }, [onClose, isLoading]);

  const handleOverlayClick = useCallback(
    (e) => {
      if (isLoading) {
        return;
      }

      if (e.target === e.currentTarget) {
        handleClose();
      }
    },
    [handleClose, isLoading],
  );

  const handleModalClick = useCallback((e) => {
    e.stopPropagation();
  }, []);

  const handleEdit = useCallback(() => {
    if (isLoading) {
      return;
    }

    onClose?.();
    onEdit?.(event);
  }, [event, onEdit, onClose, isLoading]);

  const handleDelete = useCallback(() => {
    if (isLoading) {
      return;
    }

    onClose?.();
    onDelete?.(event);
  }, [event, onDelete, onClose, isLoading]);

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
            disabled={isLoading}
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

        {(canEdit || canDelete) && (
          <div className="modalFooter">
            {canEdit && onEdit && (
              <button
                type="button"
                className="editBtn"
                onClick={handleEdit}
                disabled={isLoading}
              >
                <FaEdit />
                Edit
              </button>
            )}

            {canDelete && onDelete && (
              <button
                type="button"
                className="deleteBtn"
                onClick={handleDelete}
                disabled={isLoading}
              >
                <FaTrash />
                {isLoading ? "Deleting..." : "Delete"}
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

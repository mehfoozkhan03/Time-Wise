import "./EventModal.css";

import { memo, useCallback, useEffect, useMemo, useRef } from "react";

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

function EventModal({
  event,
  onClose,
  onEdit,
  onDelete,
  canEdit = false,
}) {
  /* =========================================
     Close Button Ref
  ========================================= */

  const closeButtonRef = useRef(null);

  /* =========================================
     Event Config
  ========================================= */

  const config = useMemo(() => {
    if (!event) return null;
    return EVENT_CONFIG[event.type];
  }, [event]);

  /* =========================================
     Employee Name
  ========================================= */

  const employeeName = useMemo(() => {
    if (!event) return "";

    if (event.isHoliday) {
      return "Public Holiday";
    }

    return event.employeeName ?? event.employee ?? "N/A";
  }, [event]);

  /* =========================================
     Event Time
  ========================================= */

  const eventTime = useMemo(() => {
    if (!event) return "--";

    if (event.isAllDay) {
      return "All Day";
    }

    const start = event.startTime
      ? formatTime(event.startTime)
      : "--";

    const end = event.endTime
      ? formatTime(event.endTime)
      : "--";

    return `${start} - ${end}`;
  }, [event]);

  /* =========================================
     ESC Close + Focus
  ========================================= */

  useEffect(() => {
    if (!event) return;

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

  /* =========================================
     Validation
  ========================================= */

  if (!event || !config) {
    return null;
  }

  const Icon = config.icon;

  /* =========================================
     Handlers
  ========================================= */

  const handleOverlayClick = useCallback(
    (e) => {
      if (e.target === e.currentTarget) {
        onClose?.();
      }
    },
    [onClose]
  );

  const handleModalClick = useCallback((e) => {
    e.stopPropagation();
  }, []);

  const handleEdit = useCallback(() => {
    onEdit?.(event);
  }, [event, onEdit]);

  const handleDelete = useCallback(() => {
    onDelete?.(event);
  }, [event, onDelete]);

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
              <h2 id="event-modal-title">
                {event.title}
              </h2>

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
            onClick={onClose}
            aria-label="Close Event"
          >
            <FaTimes />
          </button>
        </div>

        <div className="modalBody">
          <InfoRow
            icon={FaUser}
            label="Employee"
            value={employeeName}
          />

          {!event.isHoliday && (
            <InfoRow
              icon={FaBuilding}
              label="Department"
              value={event.department || "N/A"}
            />
          )}

          <InfoRow
            icon={FaCalendarAlt}
            label="Date"
            value={formatFullDate(event.date)}
          />

          <InfoRow
            icon={FaClock}
            label="Time"
            value={eventTime}
          />

          <InfoRow
            icon={FaTag}
            label="Event Type"
            value={config.label}
          />

          <div className="descriptionCard">
            <h3>Description</h3>

            <p>
              {event.description ||
                "No description available."}
            </p>
          </div>
        </div>

        {!event.isHoliday && canEdit && (
          <div className="modalFooter">
            {onEdit && (
              <button
                type="button"
                className="editBtn"
                onClick={handleEdit}
              >
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

export default memo(EventModal);
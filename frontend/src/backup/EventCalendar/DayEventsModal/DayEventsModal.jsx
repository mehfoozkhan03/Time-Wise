import "./DayEventsModal.css";

import { memo, useCallback, useEffect, useRef } from "react";

import { FaTimes, FaCalendarAlt } from "react-icons/fa";

import EventItem from "../../Common/EventItem/EventItem";

import { formatFullDate } from "../../../utils/dateUtils";
import { Modal } from "../../Modal/Modal";

function DayEventsModal({ date, events = [], onClose, onEventClick }) {
  const closeButtonRef = useRef(null);

  useEffect(() => {
    closeButtonRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose?.();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  const handleOverlayClick = useCallback(
    (event) => {
      if (event.target === event.currentTarget) {
        onClose?.();
      }
    },
    [onClose],
  );

  const handleModalClick = useCallback((event) => {
    event.stopPropagation();
  }, []);

  const handleEventClick = useCallback(
    (event) => {
      onClose?.();
      onEventClick?.(event);
    },
    [onClose, onEventClick],
  );

  return (
    <Modal
      isOpen
      overlayClassName="dayEventsOverlay"
      className="dayEventsModal"
      onOverlayClick={handleOverlayClick}
      onContentClick={handleModalClick}
      ariaLabelledBy="day-events-title"
    >
        <div className="dayEventsHeader">
          <div className="dayEventsTitle">
            <FaCalendarAlt />

            <div>
              <h2 id="day-events-title">{formatFullDate(date)}</h2>

              <span>
                {events.length} Event{events.length !== 1 ? "s" : ""}
              </span>
            </div>
          </div>

          <button
            ref={closeButtonRef}
            type="button"
            className="closeBtn"
            onClick={onClose}
            aria-label="Close"
          >
            <FaTimes />
          </button>
        </div>

        <div className="dayEventsBody">
          {events.map((event) => (
            <EventItem
              key={event._id ?? event.id}
              event={event}
              variant="default"
              showAvatar
              showTime
              showType
              onClick={handleEventClick}
            />
          ))}
        </div>
    </Modal>
  );
}

DayEventsModal.displayName = "DayEventsModal";

export default memo(DayEventsModal);

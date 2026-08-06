import "./AllUpcomingEventsModal.css";

import { memo, useEffect, useRef, useMemo, useCallback } from "react";

import { FaTimes, FaCalendarAlt } from "react-icons/fa";

import EventItem from "../../../Common/EventItem/EventItem";
import EmptyState from "../../../Common/EmptyState/EmptyState";

function AllUpcomingEventsModal({ events = [], onClose, onEventClick }) {
  /* =========================================
     Close Button Ref
  ========================================= */

  const closeButtonRef = useRef(null);

  /* =========================================
     Sorted Events
  ========================================= */

  const upcomingEvents = useMemo(() => {
    if (!Array.isArray(events)) {
      return [];
    }

    return [...events].sort((a, b) => {
      const dateDiff = new Date(a.date) - new Date(b.date);

      if (dateDiff !== 0) {
        return dateDiff;
      }

      return (a.startTime || "").localeCompare(b.startTime || "");
    });
  }, [events]);

  /* =========================================
     Focus + ESC Close
  ========================================= */

  useEffect(() => {
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
  }, [onClose]);

  /* =========================================
     Handlers
  ========================================= */

  const handleOverlayClick = useCallback(
    (e) => {
      if (e.target === e.currentTarget) {
        onClose?.();
      }
    },
    [onClose],
  );

  const handleModalClick = useCallback((e) => {
    e.stopPropagation();
  }, []);

  const handleEventClick = useCallback(
    (event) => {
      onEventClick?.(event);
      onClose?.();
    },
    [onEventClick, onClose],
  );

  return (
    <div
      className="allUpcomingOverlay"
      onClick={handleOverlayClick}
      role="presentation"
    >
      <div
        className="allUpcomingModal"
        onClick={handleModalClick}
        role="dialog"
        aria-modal="true"
        aria-labelledby="all-upcoming-title"
        tabIndex={-1}
      >
        {/* =========================================
            Header
        ========================================= */}

        <div className="allUpcomingHeader">
          <div className="allUpcomingTitle">
            <div className="allUpcomingIcon" aria-hidden="true">
              <FaCalendarAlt />
            </div>

            <div className="allUpcomingHeading">
              <h2 id="all-upcoming-title">Upcoming Events</h2>

              <span className="allUpcomingCount">
                {upcomingEvents.length} Event
                {upcomingEvents.length !== 1 ? "s" : ""}
              </span>
            </div>
          </div>

          <button
            ref={closeButtonRef}
            type="button"
            className="closeBtn"
            onClick={onClose}
            aria-label="Close Upcoming Events"
          >
            <FaTimes />
          </button>
        </div>

        {/* =========================================
            Body
        ========================================= */}

        <div className="allUpcomingBody">
          {upcomingEvents.length === 0 ? (
            <EmptyState
              icon={<FaCalendarAlt />}
              title="No Upcoming Events"
              description="You're all caught up."
            />
          ) : (
            <div
              className="allUpcomingList"
              role="list"
              aria-label="Upcoming Events"
            >
              {upcomingEvents.map((event) => (
                <div
                  key={event._id ?? event.id ?? `${event.date}-${event.title}`}
                  className="allUpcomingItem"
                  role="listitem"
                >
                  <EventItem
                    event={event}
                    variant="default"
                    showAvatar
                    showTime
                    showType
                    onClick={handleEventClick}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

AllUpcomingEventsModal.displayName = "AllUpcomingEventsModal";

export default memo(AllUpcomingEventsModal);

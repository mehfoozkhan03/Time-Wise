import "./AllUpcomingEventsModal.css";

import {
  memo,
  useEffect,
  useRef,
} from "react";

import {
  FaTimes,
  FaCalendarAlt,
} from "react-icons/fa";

import EventItem from "../../../Common/EventItem/EventItem";
import EmptyState from "../../../Common/EmptyState/EmptyState";

function AllUpcomingEventsModal({
  events = [],
  onClose,
  onEventClick,
}) {
  /* =========================================
     Close Button Ref
  ========================================= */

  const closeButtonRef = useRef(null);

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

    document.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [onClose]);

  /* =========================================
     Overlay Close
  ========================================= */

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose?.();
    }
  };

  const handleModalClick = (e) => {
    e.stopPropagation();
  };

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
            <div className="allUpcomingIcon">
              <FaCalendarAlt />
            </div>

            <div className="allUpcomingHeading">
              <h2 id="all-upcoming-title">
                Upcoming Events
              </h2>

              <span className="allUpcomingCount">
                {events.length} Event
                {events.length !== 1 ? "s" : ""}
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
          {events.length === 0 ? (
            <EmptyState
              icon={<FaCalendarAlt />}
              title="No Upcoming Events"
              description="You're all caught up."
            />
          ) : (
            <div className="allUpcomingList">
              {events.map((event) => (
                <div
                  key={
                    event._id ??
                    event.id ??
                    `${event.date}-${event.title}`
                  }
                  className="allUpcomingItem"
                >
                  <EventItem
                    event={event}
                    variant="default"
                    showAvatar
                    showTime
                    showType
                    onClick={onEventClick}
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

AllUpcomingEventsModal.displayName =
  "AllUpcomingEventsModal";

export default memo(AllUpcomingEventsModal);
import "./UpcomingEvents.css";

import {
  memo,
  useMemo,
  useCallback,
  useState,
} from "react";

import {
  FaCalendarAlt,
  FaArrowRight,
  FaCalendarTimes,
} from "react-icons/fa";

import Card from "../../Common/CalendarCard/Card";
import EventItem from "../../Common/EventItem/EventItem";
import EmptyState from "../../Common/EmptyState/EmptyState";

import AllUpcomingEventsModal from "./AllUpcomingEventsModal/AllUpcomingEventsModal";

import { getUpcomingEvents } from "../../../utils/eventUtils";
import { getRelativeDateLabel } from "../../../utils/dateUtils";

function UpcomingEvents({
  events = [],
  onEventClick,
}) {
  /* =========================================
     Modal State
  ========================================= */

  const [isModalOpen, setIsModalOpen] =
    useState(false);

  /* =========================================
     All Upcoming Events
  ========================================= */

  const allUpcomingEvents = useMemo(() => {
    return getUpcomingEvents(events).map(
      (event) => ({
        ...event,
        relativeDate: getRelativeDateLabel(
          event.date
        ),
      })
    );
  }, [events]);

  /* =========================================
     Card Events (First 2)
  ========================================= */

  const upcomingEvents = useMemo(() => {
    return allUpcomingEvents.slice(0, 2);
  }, [allUpcomingEvents]);

  /* =========================================
     Handlers
  ========================================= */

  const handleViewAll = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const handleEventClick = useCallback(
    (event) => {
      onEventClick?.(event);
      setIsModalOpen(false);
    },
    [onEventClick]
  );

  return (
    <>
      <Card
        title="Upcoming Events"
        icon={<FaCalendarAlt />}
        className="upcomingCard"
      >
        {upcomingEvents.length === 0 ? (
          <EmptyState
            icon={<FaCalendarTimes />}
            title="No Upcoming Events"
            description="You're all caught up."
          />
        ) : (
          <>
            <div className="upcomingList">
              {upcomingEvents.map((event) => (
                <div
                  key={
                    event._id ??
                    event.id ??
                    `${event.date}-${event.title}`
                  }
                  className="upcomingItem"
                >
                  <EventItem
                    event={event}
                    variant="compact"
                    showAvatar={false}
                    showTime={false}
                    showType={false}
                    onClick={onEventClick}
                  />

                  <time
                    className="eventDate"
                    dateTime={event.date}
                  >
                    {event.relativeDate}
                  </time>
                </div>
              ))}
            </div>

            <button
              type="button"
              className="viewAllBtn"
              onClick={handleViewAll}
            >
              View All
              <FaArrowRight />
            </button>
          </>
        )}
      </Card>

      {isModalOpen && (
        <AllUpcomingEventsModal
          events={allUpcomingEvents}
          onClose={handleCloseModal}
          onEventClick={handleEventClick}
        />
      )}
    </>
  );
}

UpcomingEvents.displayName =
  "UpcomingEvents";

export default memo(UpcomingEvents);
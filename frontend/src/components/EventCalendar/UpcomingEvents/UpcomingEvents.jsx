import "./UpcomingEvents.css";

import { memo, useMemo, useCallback } from "react";

import {
  FaCalendarAlt,
  FaArrowRight,
  FaCalendarTimes,
} from "react-icons/fa";

import Card from "../../Common/CalendarCard/Card";
import EventItem from "../../Common/EventItem/EventItem";
import EmptyState from "../../Common/EmptyState/EmptyState";

import { getUpcomingEvents } from "../../../utils/eventUtils";
import { getRelativeDateLabel } from "../../../utils/dateUtils";

function UpcomingEvents({ events = [], onEventClick }) {
  /* =========================================
     Upcoming Events
  ========================================= */

  const upcomingEvents = useMemo(() => {
    return getUpcomingEvents(events, 4).map((event) => ({
      ...event,
      relativeDate: getRelativeDateLabel(event.date),
    }));
  }, [events]);

  /* =========================================
     View All
  ========================================= */

  const handleViewAll = useCallback(() => {
    // Future enhancement:
    // Navigate to all upcoming events
  }, []);

  return (
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
            disabled
            title="Coming Soon"
          >
            View All
            <FaArrowRight />
          </button>
        </>
      )}
    </Card>
  );
}

UpcomingEvents.displayName = "UpcomingEvents";

export default memo(UpcomingEvents);
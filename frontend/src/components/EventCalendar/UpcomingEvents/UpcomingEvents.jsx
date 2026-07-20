import "./UpcomingEvents.css";

import { memo, useMemo } from "react";

import { FaCalendarAlt, FaArrowRight, FaCalendarTimes } from "react-icons/fa";

import Card from "../../Common/Card/Card";
import EventItem from "../../Common/EventItem/EventItem";
import EmptyState from "../../Common/EmptyState/EmptyState";

import { getUpcomingEvents } from "../../../utils/eventUtils";

import { getRelativeDateLabel } from "../../../utils/dateUtils";

function UpcomingEvents({ events, onEventClick }) {
  const upcomingEvents = useMemo(
    () => getUpcomingEvents(events).slice(0, 4),
    [events],
  );

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
        <div className="upcomingList">
          {upcomingEvents.map((event) => (
            <div key={event.id} className="upcomingItem">
              <EventItem
                event={event}
                variant="compact"
                showAvatar={false}
                showTime={false}
                showType={false}
                onClick={onEventClick}
              />
              {/* <EventItem
    event={event}
    variant="compact"
    showTime={false}
    showType={false}
    onClick={onEventClick}
/> */}
              <span className="eventDate">
                {getRelativeDateLabel(event.date)}
              </span>
            </div>
          ))}
        </div>
      )}

      <button type="button" className="viewAllBtn">
        View All
        <FaArrowRight />
      </button>
    </Card>
  );
}

export default memo(UpcomingEvents);

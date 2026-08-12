import "./EventBadge.css";

import { memo, useCallback } from "react";

import EventItem from "../../Common/EventItem/EventItem";

function EventBadge({ event, onClick, ...props }) {

  if (!event?.type) {
    return null;
  }

  const handleClick = useCallback(() => {
    if (!event || !onClick) {
      return;
    }

    onClick(event);
  }, [event, onClick]);

  return (
    <EventItem
      event={event}
      variant="compact"
      onClick={handleClick}
      {...props}
    />
  );
}

EventBadge.displayName = "EventBadge";

export default memo(EventBadge);
import "./EventBadge.css";

import { memo, useCallback } from "react";

import EventItem from "../../Common/EventItem/EventItem";

function EventBadge({
  event,
  onClick,
  ...props
}) {
  /* =========================================
     Validation
  ========================================= */

  if (!event?.type) {
    return null;
  }

  /* =========================================
     Click Handler
  ========================================= */

  const handleClick = useCallback(() => {
    if (!onClick) {
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
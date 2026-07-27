import "./EventBadge.css";

import { memo, useCallback } from "react";

import EventItem from "../../Common/EventItem/EventItem";

function EventBadge({ event, onClick }) {
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
    onClick?.(event);
  }, [event, onClick]);

  return <EventItem event={event} variant="compact" onClick={handleClick} />;
}

export default memo(EventBadge);

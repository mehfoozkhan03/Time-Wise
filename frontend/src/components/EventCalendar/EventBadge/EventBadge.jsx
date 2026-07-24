import "./EventBadge.css";

import { memo } from "react";

import EventItem from "../../Common/EventItem/EventItem";

function EventBadge({
    event,
    onClick,
}) {
    if (!event) return null;

    return (
        <EventItem
            event={event}
            variant="compact"
            onClick={onClick}
        />
    );
}

export default memo(EventBadge);
import EventItem from "../../Common/EventItem/EventItem";

export default function EventBadge({

    event,

    onClick,

}) {

    return (

        <EventItem

            event={event}

            variant="compact"

            onClick={onClick}

        />

    );

}
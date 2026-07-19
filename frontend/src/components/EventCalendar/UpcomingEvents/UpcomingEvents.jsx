import "./UpcomingEvents.css";

import {

    getRelativeDateLabel,

} from "../../../utils/dateUtils";

import {

    getUpcomingEvents,

} from "../../../utils/eventUtils";

import {

    FaCalendarAlt,

    FaArrowRight,

    FaCalendarTimes,

} from "react-icons/fa";

import Card from "../../Common/Card/Card";
import EventItem from "../../Common/EventItem/EventItem";
import EmptyState from "../../Common/EmptyState/EmptyState";

export default function UpcomingEvents({

    events,

    onEventClick,

}) {

    const upcomingEvents = getUpcomingEvents(events);

    return (

        <Card

            title="Upcoming Events"

            icon={<FaCalendarAlt />}

        >

            {

                upcomingEvents.length === 0 ? (

                    <EmptyState

                        icon={<FaCalendarTimes />}

                        title="No Upcoming Events"

                        description="You're all caught up. There are no upcoming events."

                    />

                ) : (

                    upcomingEvents.map((event) => (

                        <div

                            key={event.id}

                            className="upcomingWrapper"

                        >

                            <EventItem

                                event={event}

                                variant="sidebar"

                                onClick={onEventClick}

                            />

                            <p className="eventDate">

                                {getRelativeDateLabel(event.date)}

                            </p>

                        </div>

                    ))

                )

            }

            <button className="viewAllBtn">

                View All

                <FaArrowRight />

            </button>

        </Card>

    );

}
import "./UpcomingEvents.css";

import { EVENT_CONFIG } from "../data/eventConfig";
import { formatDate } from "../utils/dateUtils";

export default function UpcomingEvents({

    events

}) {

    const upcomingEvents = [...events]

        .sort((a, b) => new Date(a.date) - new Date(b.date))

        .slice(0, 6);

    return (

        <div className="upcomingEvents">

            <h3>

                Upcoming Events

            </h3>

            {

                upcomingEvents.length === 0 ? (

                    <p className="noEvents">

                        No Upcoming Events

                    </p>

                ) : (

                    upcomingEvents.map((event) => {

                        const config = EVENT_CONFIG[event.type];

                        return (

                            <div
                                key={event.id}
                                className="upcomingCard"
                            >

                                <div
                                    className="eventCircle"
                                    style={{
                                        backgroundColor: config.color
                                    }}
                                >

                                    {config.icon}

                                </div>

                                <div className="upcomingContent">

                                    <h4>

                                        {event.title}

                                    </h4>

                                    <span>

                                        {formatDate(event.date)}

                                    </span>

                                </div>

                            </div>

                        );

                    })

                )

            }

        </div>

    );

}
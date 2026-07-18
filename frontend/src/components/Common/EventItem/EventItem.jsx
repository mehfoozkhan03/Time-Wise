import "./EventItem.css";

import { EVENT_CONFIG } from "../../../data/eventConfig";

import { formatTime } from "../../../utils/dateUtils";

import {

    getInitials,

    getAvatarColor,

} from "../../../utils/stringUtils";

export default function EventItem({

    event,

    variant = "default",

    showAvatar = true,

    showTime = true,

    showType = true,

    onClick,

}) {

    const config = EVENT_CONFIG[event.type];

    if (!config) return null;

    const Icon = config.icon;

    const handleClick = (e) => {

        e.stopPropagation();

        onClick?.(event);

    };

    return (

        <div

            className={`eventItem ${variant}`}

            onClick={handleClick}

            style={{

                "--event-color": config.color,

            }}

        >

            {

                showAvatar && (

                    <div

                        className="eventItemAvatar"

                        style={{

                            background: getAvatarColor(event.employee),

                        }}

                    >

                        {getInitials(event.employee)}

                    </div>

                )

            }

            <div className="eventItemContent">

                <h5 title={event.title}>

                    {event.title}

                </h5>

                <div className="eventItemMeta">

                    {

                        showType && (

                            <span className="eventItemIcon">

                                <Icon />

                            </span>

                        )

                    }

                    {

                        showTime &&

                        event.startTime && (

                            <span>

                                {formatTime(event.startTime)}

                            </span>

                        )

                    }

                </div>

            </div>

        </div>

    );

}
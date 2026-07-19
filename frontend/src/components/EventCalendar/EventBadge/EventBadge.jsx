import "./EventBadge.css";

import { EVENT_CONFIG } from "../data/eventConfig.js";

export default function EventBadge({ event , onClick }) {

    const config = EVENT_CONFIG[event.type];

    if(!config) return null;

    return(

        <div

            className="eventBadge"
            onClick={(e) => {
              e.stopPropagation();
              onClick();
              }}

            style={{

                backgroundColor:config.color

            }}

        >

            <span className="eventIcon">

                {config.icon}

            </span>

            <span className="eventTitle">

                {event.title}

            </span>

        </div>

    );

}
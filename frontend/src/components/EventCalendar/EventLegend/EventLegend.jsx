import "./EventLegend.css";

import { EVENT_CONFIG } from "../../../data/eventConfig";

export default function EventLegend({

    filters,

    toggleFilter,

}) {

    return (

        <div className="eventLegend">

            <h3>

                Event Legend

            </h3>

            <div className="legendList">

                {

                    Object.entries(EVENT_CONFIG).map(

                        ([type, config]) => {

                            const Icon = config.icon;

                            const active = filters[type];

                            return (

                                <button

                                    key={type}

                                    className={`legendItem ${

                                        active

                                            ? "active"

                                            : "inactive"

                                    }`}

                                    onClick={() =>

                                        toggleFilter(type)

                                    }

                                >

                                    <div

                                        className="legendIcon"

                                        style={{

                                            "--legend-color":

                                                config.color,

                                        }}

                                    >

                                        <Icon />

                                    </div>

                                    <span>

                                        {config.label}

                                    </span>

                                </button>

                            );

                        }

                    )

                }

            </div>

        </div>

    );

}
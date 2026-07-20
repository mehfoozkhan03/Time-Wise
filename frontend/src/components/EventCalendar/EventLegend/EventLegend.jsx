import "./EventLegend.css";

import { memo, useMemo } from "react";
import { FaListUl } from "react-icons/fa";

import Card from "../../Common/Card/Card";
import { EVENT_CONFIG } from "../../../data/eventConfig";

function EventLegend({
    filters,
    toggleFilter,
}) {

    const legendItems = useMemo(
        () => Object.entries(EVENT_CONFIG),
        []
    );

    return (

        <Card
            title="Event Legend"
            icon={<FaListUl />}
            className="legendCard"
        >

            <div className="legendList">

                {

                    legendItems.map(([type, config]) => {

                        const Icon = config.icon;

                        const active = filters[type];

                        return (

                            <button
                                key={type}
                                type="button"
                                className={`legendItem ${
                                    active ? "active" : "inactive"
                                }`}
                                onClick={() => toggleFilter(type)}
                            >

                                <div
                                    className="legendIcon"
                                    style={{
                                        "--legend-color": config.color,
                                    }}
                                >
                                    <Icon />
                                </div>

                                <div className="legendContent">

                                    <span className="legendTitle">

                                        {config.label}

                                    </span>

                                    <small>

                                        {active
                                            ? "Visible"
                                            : "Hidden"}

                                    </small>

                                </div>

                            </button>

                        );

                    })

                }

            </div>

        </Card>

    );

}

export default memo(EventLegend);
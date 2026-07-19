import "./EventLegend.css";

import { FaListUl } from "react-icons/fa";

import Card from "../../Common/Card/Card";

import { EVENT_CONFIG } from "../../../data/eventConfig";

export default function EventLegend({

    filters,

    toggleFilter,

}) {

    return (

        <Card

            title="Event Legend"

            icon={<FaListUl />}

        >

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

        </Card>

    );

}
import "./TodaySummary.css";

import { EVENT_CONFIG } from "../../../data/eventConfig";

import {

    getTodaySummary,

} from "../../../utils/eventUtils";

import EmptyState from "../../Common/EmptyState/EmptyState";

import {

    FaRegCalendarCheck,

} from "react-icons/fa";

export default function TodaySummary({

    events,

}) {

    const summaryData = getTodaySummary(

        events,

        EVENT_CONFIG

    );

    return (

        <div className="todaySummary">

            <h3>

                Today's Summary

            </h3>

            {

                summaryData.length === 0 ? (

                    <EmptyState

                        icon={<FaRegCalendarCheck />}

                        title="No Events Today"

                        description="There are no scheduled events for today."

                    />

                ) : (

                    <div className="summaryList">

                        {

                            summaryData.map((item) => {

                                const Icon = item.config.icon;

                                return (

                                    <div

                                        key={item.type}

                                        className="summaryItem"

                                    >

                                        <div className="summaryLeft">

                                            <div

                                                className="summaryIcon"

                                                style={{

                                                    "--summary-color":

                                                        item.config.color,

                                                }}

                                            >

                                                <Icon />

                                            </div>

                                            <span>

                                                {item.config.label}

                                            </span>

                                        </div>

                                        <span className="summaryCount">

                                            {item.count}

                                        </span>

                                    </div>

                                );

                            })

                        }

                    </div>

                )

            }

        </div>

    );

}
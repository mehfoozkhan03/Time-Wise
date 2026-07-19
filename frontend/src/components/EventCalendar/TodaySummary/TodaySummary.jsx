import "./TodaySummary.css";

import {

    FaChartPie,

    FaRegCalendarCheck,

} from "react-icons/fa";

import Card from "../../Common/Card/Card";

import EmptyState from "../../Common/EmptyState/EmptyState";

import { EVENT_CONFIG } from "../../../data/eventConfig";

import {

    getTodaySummary,

} from "../../../utils/eventUtils";

export default function TodaySummary({

    events,

}) {

    const summaryData = getTodaySummary(

        events,

        EVENT_CONFIG

    );

    return (

        <Card

            title="Today's Summary"

            icon={<FaChartPie />}

        >

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

        </Card>

    );

}
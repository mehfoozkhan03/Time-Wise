import "./TodaySummary.css";

import { memo, useMemo } from "react";

import { FaChartPie, FaRegCalendarCheck } from "react-icons/fa";

import Card from "../../Common/Card/Card";
import EmptyState from "../../Common/EmptyState/EmptyState";

import { EVENT_CONFIG } from "../../../data/eventConfig";
import { getTodaySummary } from "../../../utils/eventUtils";

function TodaySummary({ events }) {
  const summaryData = useMemo(
    () => getTodaySummary(events, EVENT_CONFIG),
    [events],
  );

  return (
    <Card title="Today's Summary" icon={<FaChartPie />} className="summaryCard">
      {summaryData.length === 0 ? (
        <EmptyState
          icon={<FaRegCalendarCheck />}
          title="No Events Today"
          description="No scheduled events for today."
        />
      ) : (
        <div className="summaryList">
          {summaryData.map((item) => {
            const Icon = item.config.icon;

            return (
              <div key={item.type} className="summaryItem">
                <div className="summaryLeft">
                  <div
                    className="summaryIcon"
                    style={{
                      "--summary-color": item.config.color,
                    }}
                  >
                    <Icon />
                  </div>

                  <div className="summaryContent">
                    <span className="summaryTitle">{item.config.label}</span>

                    <small>Today's Events</small>
                  </div>
                </div>

                <span className="summaryCount">{item.count}</span>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}

export default memo(TodaySummary);

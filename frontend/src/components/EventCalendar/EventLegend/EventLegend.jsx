import "./EventLegend.css";

import { memo, useCallback } from "react";

import { FaListUl } from "react-icons/fa";

import Card from "../../Common/CalendarCard/Card";

import { EVENT_CONFIG } from "../../../data/eventConfig";

const legendItems = Object.entries(EVENT_CONFIG);

function EventLegend({ filters = {}, toggleFilter }) {
  /* =========================================
     Toggle Filter
  ========================================= */

  const handleToggleFilter = useCallback(
    (type) => {
      toggleFilter?.(type);
    },
    [toggleFilter],
  );

  return (
    <Card title="Event Legend" icon={<FaListUl />} className="legendCard">
      <div className="legendList" role="group" aria-label="Event Legend">
        {legendItems.map(([type, config]) => {
          const Icon = config.icon;

          const active = Boolean(filters[type]);

          const className = ["legendItem", active ? "active" : "inactive"].join(
            " ",
          );

          const statusId = `legend-status-${type}`;

          return (
            <button
              key={type}
              type="button"
              className={className}
              aria-pressed={active}
              aria-label={`Toggle ${config.label}`}
              aria-describedby={statusId}
              title={config.label}
              onClick={() => handleToggleFilter(type)}
            >
              <div
                className="legendIcon"
                style={{
                  "--legend-color": config.color,
                }}
                aria-hidden="true"
              >
                <Icon />
              </div>

              <div className="legendContent">
                <span className="legendTitle">{config.label}</span>

                <small id={statusId}>{active ? "Visible" : "Hidden"}</small>
              </div>
            </button>
          );
        })}
      </div>
    </Card>
  );
}

EventLegend.displayName = "EventLegend";

export default memo(EventLegend);

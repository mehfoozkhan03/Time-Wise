import "./EventLegend.css";

import { memo, useCallback, useMemo } from "react";

import { FaListUl } from "react-icons/fa";

import Card from "../../Common/CalendarCard/Card";

import { EVENT_CONFIG } from "../../../data/eventConfig";

function EventLegend({ filters = {}, toggleFilter }) {
  /* =========================================
     Legend Items
  ========================================= */

  const legendItems = useMemo(() => {
    return Object.entries(EVENT_CONFIG);
  }, []);

  /* =========================================
     Toggle Filter
  ========================================= */

  const handleToggleFilter = useCallback(
    (type) => {
      toggleFilter?.(type);
    },
    [toggleFilter],
  );

  const createToggleHandler = useCallback(
    (type) => () => {
      handleToggleFilter(type);
    },
    [handleToggleFilter],
  );

  return (
    <Card title="Event Legend" icon={<FaListUl />} className="legendCard">
      <div className="legendList" role="group" aria-label="Event Legend">
        {legendItems.map(([type, config]) => {
          const Icon = config.icon;

          const active = Boolean(filters[type]);

          const statusId = `legend-status-${type}`;

          const className = ["legendItem", active ? "active" : "inactive"].join(
            " ",
          );

          return (
            <button
              key={type}
              type="button"
              className={className}
              onClick={createToggleHandler(type)}
              aria-pressed={active}
              aria-label={`Toggle ${config.label}`}
              aria-describedby={statusId}
              title={config.label}
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

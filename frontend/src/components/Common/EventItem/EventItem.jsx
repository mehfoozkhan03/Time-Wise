import "./EventItem.css";

import { memo, useMemo, useCallback } from "react";

import { EVENT_CONFIG } from "../../../data/eventConfig";

import { formatTime } from "../../../utils/dateUtils";

import { getAvatarColor, getInitials } from "../../../utils/stringUtils";

function EventItem({
  event,
  variant = "default",
  showAvatar = true,
  showTime = true,
  showType = true,
  onClick,
}) {
  /* =========================================
     Validation
  ========================================= */

  if (!event?.type) {
    return null;
  }

  /* =========================================
     Event Config
  ========================================= */

  const eventType = String(event.type).toUpperCase();

  const config = EVENT_CONFIG[eventType];

  if (!config) {
    return null;
  }

  const Icon = config.icon;

  /* =========================================
     Event Type
  ========================================= */

  const isHoliday = Boolean(event.isHoliday || config.isHoliday);

  /* =========================================
     Display Name
  ========================================= */

  const displayName = useMemo(() => {
    if (isHoliday) {
      return config.label;
    }

    return event.employeeName || event.employee || event.displayName || "";
  }, [
    event.employeeName,
    event.employee,
    event.displayName,
    config.label,
    isHoliday,
  ]);

  /* =========================================
     Avatar
  ========================================= */

  const avatarColor = useMemo(() => {
    return getAvatarColor(displayName);
  }, [displayName]);

  const initials = useMemo(() => {
    return getInitials(isHoliday ? event.title || config.label : displayName);
  }, [displayName, event.title, config.label, isHoliday]);

  /* =========================================
     Time
  ========================================= */

  const formattedTime = useMemo(() => {
    if (event.isAllDay) {
      return "All Day";
    }

    return event.startTime ? formatTime(event.startTime) : "";
  }, [event.isAllDay, event.startTime]);

  /* =========================================
     Click
  ========================================= */

  const handleClick = useCallback(
    (e) => {
      if (!onClick) {
        return;
      }

      e.stopPropagation();

      onClick(event);
    },
    [event, onClick],
  );

  const handleKeyDown = useCallback(
    (e) => {
      if (!onClick) {
        return;
      }

      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();

        onClick(event);
      }
    },
    [event, onClick],
  );

  /* =========================================
     Class Name
  ========================================= */

  const className = useMemo(() => {
    return ["eventItem", variant, isHoliday && "holiday"]
      .filter(Boolean)
      .join(" ");
  }, [variant, isHoliday]);

  return (
    <div
      className={className}
      style={{
        "--event-color": config.color,
      }}
      onClick={onClick ? handleClick : undefined}
      onKeyDown={onClick ? handleKeyDown : undefined}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      aria-label={
        onClick ? `${event.title || config.label} (${config.label})` : undefined
      }
    >
      {showAvatar && (displayName || isHoliday) && (
        <div
          className="eventItemAvatar"
          style={{
            background: avatarColor,
          }}
          aria-hidden="true"
        >
          {initials}
        </div>
      )}

      <div className="eventItemContent">
        <h5 title={event.title || config.label}>
          {event.title || config.label}
        </h5>

        <div className="eventItemMeta">
          {showType && (
            <span className="eventItemIcon" aria-hidden="true">
              <Icon />
            </span>
          )}

          {showTime && formattedTime && <span>{formattedTime}</span>}
        </div>
      </div>
    </div>
  );
}

EventItem.displayName = "EventItem";

export default memo(EventItem);

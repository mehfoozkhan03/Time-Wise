import "./EventItem.css";

import { memo, useCallback, useMemo } from "react";

import { EVENT_CONFIG } from "../../../data/eventConfig";
import { formatTime } from "../../../utils/dateUtils";

import {
  getAvatarColor,
  getInitials,
} from "../../../utils/stringUtils";

function EventItem({
  event,
  variant = "default",
  showAvatar = true,
  showTime = true,
  showType = true,
  onClick,
}) {
  if (!event) {
    return null;
  }

  /* =========================================
     Event Config
  ========================================= */

  const config = useMemo(() => {
    return EVENT_CONFIG[event.type];
  }, [event.type]);

  if (!config) {
    return null;
  }

  const Icon = config.icon;

  /* =========================================
     Event Type
  ========================================= */

  const isHoliday = useMemo(() => {
    return Boolean(event.isHoliday);
  }, [event.isHoliday]);

  /* =========================================
     Display Name
  ========================================= */

  const displayName = useMemo(() => {
    if (isHoliday) {
      return config.label;
    }

    return (
      event.employeeName ??
      event.employee ??
      ""
    );
  }, [
    config.label,
    event.employee,
    event.employeeName,
    isHoliday,
  ]);

  /* =========================================
     Avatar
  ========================================= */

  const avatarColor = useMemo(() => {
    return getAvatarColor(displayName);
  }, [displayName]);

  const initials = useMemo(() => {
    if (isHoliday) {
      return getInitials(
        event.title || config.label
      );
    }

    return getInitials(displayName);
  }, [
    config.label,
    displayName,
    event.title,
    isHoliday,
  ]);

  /* =========================================
     Time
  ========================================= */

  const formattedTime = useMemo(() => {
    if (event.isAllDay) {
      return "All Day";
    }

    return event.startTime
      ? formatTime(event.startTime)
      : "";
  }, [
    event.startTime,
    event.isAllDay,
  ]);

  /* =========================================
     Click
  ========================================= */

  const handleClick = useCallback(
    (e) => {
      if (!onClick) return;

      e.stopPropagation();

      onClick(event);
    },
    [event, onClick]
  );

  const handleKeyDown = useCallback(
    (e) => {
      if (!onClick) return;

      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();

        onClick(event);
      }
    },
    [event, onClick]
  );

  return (
    <div
      className={`eventItem ${variant}`}
      style={{
        "--event-color": config.color,
      }}
      onClick={onClick ? handleClick : undefined}
      onKeyDown={onClick ? handleKeyDown : undefined}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      aria-label={
        onClick
          ? `${event.title || config.label} (${config.label})`
          : undefined
      }
    >
      {showAvatar &&
        (displayName || isHoliday) && (
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
            <span
              className="eventItemIcon"
              aria-hidden="true"
            >
              <Icon />
            </span>
          )}

          {showTime &&
            formattedTime && (
              <span>{formattedTime}</span>
            )}
        </div>
      </div>
    </div>
  );
}

EventItem.displayName = "EventItem";

export default memo(EventItem);
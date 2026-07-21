import "./EventItem.css";

import { memo, useCallback, useMemo } from "react";

import { EVENT_CONFIG } from "../../../data/eventConfig";

import { formatTime } from "../../../utils/dateUtils";

import { getInitials, getAvatarColor } from "../../../utils/stringUtils";

function EventItem({
  event,
  variant = "default",
  showAvatar = true,
  showTime = true,
  showType = true,
  onClick,
}) {
  const config = useMemo(() => EVENT_CONFIG[event.type], [event.type]);

  if (!config) return null;

  const Icon = config.icon;

  const avatarColor = useMemo(
    () => getAvatarColor(event.employee),
    [event.employee],
  );

  const initials = useMemo(() => getInitials(event.employee), [event.employee]);

  const formattedTime = useMemo(
    () => (event.startTime ? formatTime(event.startTime) : ""),
    [event.startTime],
  );

  const handleClick = useCallback(
    (e) => {
      e.stopPropagation();
      onClick?.(event);
    },
    [event, onClick],
  );

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onClick?.(event);
      }
    },
    [event, onClick],
  );

  return (
    <div
      className={`eventItem ${variant}`}
      style={{
        "--event-color": config.color,
      }}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {showAvatar && (
        <div
          className="eventItemAvatar"
          style={{
            background: avatarColor,
          }}
        >
          {initials}
        </div>
      )}

      <div className="eventItemContent">
        <h5 title={event.title}>{event.title}</h5>

        <div className="eventItemMeta">
          {showType && (
            <span className="eventItemIcon">
              <Icon />
            </span>
          )}

          {showTime && formattedTime && <span>{formattedTime}</span>}
        </div>
      </div>
    </div>
  );
}

export default memo(EventItem);

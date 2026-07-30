import "./EmptyState.css";

import { memo } from "react";

function EmptyState({
  icon,
  title = "No Data",
  description = "Nothing to display.",
  className = "",
}) {
  return (
    <section
      className={`emptyState ${className}`.trim()}
      role="status"
      aria-live="polite"
    >
      {icon && (
        <div className="emptyIcon" aria-hidden="true">
          {icon}
        </div>
      )}

      <h3>{title}</h3>

      <p>{description}</p>
    </section>
  );
}

EmptyState.displayName = "EmptyState";

export default memo(EmptyState);
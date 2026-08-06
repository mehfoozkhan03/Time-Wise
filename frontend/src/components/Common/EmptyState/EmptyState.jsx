import "./EmptyState.css";

import { memo, useId, useMemo } from "react";

function EmptyState({
  icon,
  title = "No Data",
  description = "Nothing to display.",
  action,
  className = "",
  ...props
}) {
  /* =========================================
     Accessibility IDs
  ========================================= */

  const titleId = useId();
  const descriptionId = useId();

  /* =========================================
     Class Name
  ========================================= */

  const emptyStateClass = useMemo(() => {
    return ["emptyState", className].filter(Boolean).join(" ");
  }, [className]);

  return (
    <section
      className={emptyStateClass}
      role="status"
      aria-live="polite"
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      {...props}
    >
      {icon && (
        <div className="emptyIcon" aria-hidden="true">
          {icon}
        </div>
      )}

      <h3 id={titleId}>{title}</h3>

      <p id={descriptionId}>{description}</p>

      {action && <div className="emptyAction">{action}</div>}
    </section>
  );
}

EmptyState.displayName = "EmptyState";

export default memo(EmptyState);

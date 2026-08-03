import "./EmptyState.css";

import { memo, useId } from "react";

function EmptyState({
  icon,
  title = "No Data",
  description = "Nothing to display.",
  className = "",
}) {
  const titleId = useId();

  return (
    <section
      className={[
        "emptyState",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      role="status"
      aria-live="polite"
      aria-labelledby={titleId}
    >
      {icon && (
        <div
          className="emptyIcon"
          aria-hidden="true"
        >
          {icon}
        </div>
      )}

      <h3 id={titleId}>
        {title}
      </h3>

      <p>{description}</p>
    </section>
  );
}

EmptyState.displayName = "EmptyState";

export default memo(EmptyState);
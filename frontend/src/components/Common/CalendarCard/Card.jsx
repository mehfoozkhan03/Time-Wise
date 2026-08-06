import "./Card.css";

import { memo, useMemo } from "react";

function Card({
  title,
  icon,
  headerActions,
  children,
  className = "",
  ...props
}) {
  /* =========================================
     Card Title ID
  ========================================= */

  const titleId = useMemo(() => {
    if (!title) {
      return undefined;
    }

    return `${title.toLowerCase().replace(/\s+/g, "-")}-card`;
  }, [title]);

  /* =========================================
     Card Class
  ========================================= */

  const cardClassName = useMemo(() => {
    return ["card", className].filter(Boolean).join(" ");
  }, [className]);

  return (
    <section
      className={cardClassName}
      aria-labelledby={titleId}
      role={title ? "region" : undefined}
      {...props}
    >
      {(title || icon || headerActions) && (
        <div className="cardHeader">
          <div className="cardHeaderLeft">
            {icon && (
              <span className="cardIcon" aria-hidden="true">
                {icon}
              </span>
            )}

            {title && <h3 id={titleId}>{title}</h3>}
          </div>

          {headerActions && (
            <div className="cardHeaderActions">{headerActions}</div>
          )}
        </div>
      )}

      <div className="cardBody">{children}</div>
    </section>
  );
}

Card.displayName = "Card";

export default memo(Card);

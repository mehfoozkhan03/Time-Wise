import "./Card.css";

import { memo, useMemo } from "react";

function Card({
  title,
  icon,
  children,
  className = "",
}) {
  /* =========================================
     Card Title ID
  ========================================= */

  const titleId = useMemo(() => {
    if (!title) return undefined;

    return `${title
      .toLowerCase()
      .replace(/\s+/g, "-")}-card`;
  }, [title]);


  const cardClassName = useMemo(() => {
    return `card ${className}`.trim();
  }, [className]);

  return (
    <section
      className={cardClassName}
      aria-labelledby={titleId}
    >
      {(title || icon) && (
        <div className="cardHeader">
          {icon && (
            <span
              className="cardIcon"
              aria-hidden="true"
            >
              {icon}
            </span>
          )}

          {title && (
            <h3 id={titleId}>
              {title}
            </h3>
          )}
        </div>
      )}

      <div className="cardBody">
        {children}
      </div>
    </section>
  );
}

Card.displayName = "Card";

export default memo(Card);
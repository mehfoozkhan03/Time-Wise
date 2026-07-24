import "./Card.css";

import { memo, useMemo } from "react";

function Card({ title, icon, children, className = "" }) {
  /* =========================================
     Card Title ID
  ========================================= */

  const titleId = useMemo(() => {
    if (!title) return undefined;

    return `${title.toLowerCase().replace(/\s+/g, "-")}-card`;
  }, [title]);

  return (
    <section className={`card ${className}`.trim()} aria-labelledby={titleId}>
      {(title || icon) && (
        <div className="cardHeader">
          {icon && (
            <span className="cardIcon" aria-hidden="true">
              {icon}
            </span>
          )}

          {title && <h3 id={titleId}>{title}</h3>}
        </div>
      )}

      <div className="cardBody">{children}</div>
    </section>
  );
}

export default memo(Card);

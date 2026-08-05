import "./InfoRow.css";

import { memo } from "react";

function InfoRow({
  icon: Icon,
  label,
  value,
}) {
  const displayValue = value ?? "--";

  return (
    <div className="infoRow">
      {Icon && (
        <div
          className="infoIcon"
          aria-hidden="true"
        >
          <Icon />
        </div>
      )}

      <div className="infoContent">
        <span className="infoLabel">
          {label}
        </span>

        <p
          className="infoValue"
          title={String(displayValue)}
        >
          {displayValue}
        </p>
      </div>
    </div>
  );
}

InfoRow.displayName = "InfoRow";

export default memo(InfoRow);
import "./InfoRow.css";

import { memo } from "react";

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="infoRow">
      {Icon && (
        <div className="infoIcon" aria-hidden="true">
          <Icon />
        </div>
      )}

      <div className="infoContent">
        <span className="infoLabel">{label}</span>

        <p className="infoValue">{value || "--"}</p>
      </div>
    </div>
  );
}

export default memo(InfoRow);

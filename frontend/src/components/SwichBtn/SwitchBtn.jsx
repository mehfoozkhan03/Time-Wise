import { useId, useState } from "react";
import "./SwitchBtn.css";

export const SwitchBtn = ({ checked, onChange, disabled = false, className = "", ariaLabel = "Toggle setting" }) => {
  const inputId = useId();
  const [internalChecked, setInternalChecked] = useState(false);
  const isControlled = typeof checked === "boolean";
  const isChecked = isControlled ? checked : internalChecked;

  const handleChange = (event) => {
    if (!isControlled) setInternalChecked(event.target.checked);
    onChange?.(event.target.checked, event);
  };

  return (
      <div className={`switchBtn-container ${className}`}>
        <label className="switch" htmlFor={inputId}>
          <input id={inputId} type="checkbox" checked={isChecked} onChange={handleChange} disabled={disabled} aria-label={ariaLabel} />
          <span className="switch-slider"></span>
        </label>
      </div>
  );
};

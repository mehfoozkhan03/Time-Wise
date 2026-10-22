import { useEffect, useRef, useState } from "react";
import { MdKeyboardArrowDown, MdCheck } from "react-icons/md";
import "./NotificationDropdown.css";

export const NotificationDropdown = ({
  options = [],
  value = "",
  onChange,
  placeholder = "Select an option",
  label,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const selectedOption = options.find((option) => option.value === value);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const handleSelect = (option) => {
    onChange?.(option.value);
    setIsOpen(false);
  };

  return (
    <div
      className="custom-dropdown"
      ref={dropdownRef}
    >
      {label && <label className="custom-dropdown__label">{label}</label>}

      <button
        type="button"
        className={`custom-dropdown__trigger ${isOpen ? "is-open" : ""}`}
        onClick={() => setIsOpen((previous) => !previous)}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="custom-dropdown__selected">
          {selectedOption?.icon && (
            <span className="custom-dropdown__icon">{selectedOption.icon}</span>
          )}

          <span className={!selectedOption ? "is-placeholder" : ""}>
            {selectedOption?.label || placeholder}
          </span>
        </span>

        <MdKeyboardArrowDown
          className={`custom-dropdown__arrow ${isOpen ? "rotated" : ""}`}
          size={22}
        />
      </button>

      {isOpen && (
        <div
          className="custom-dropdown__menu"
          role="listbox"
        >
          {options.map((option) => {
            const isSelected = option.value === value;

            return (
              <button
                type="button"
                key={option.value}
                role="option"
                aria-selected={isSelected}
                className={`custom-dropdown__option ${
                  isSelected ? "is-selected" : ""
                }`}
                onClick={() => handleSelect(option)}
              >
                <span className="custom-dropdown__option-content">
                  {option.icon && (
                    <span className="custom-dropdown__icon">{option.icon}</span>
                  )}
                  <span>{option.label}</span>
                </span>

                {isSelected && <MdCheck size={19} />}
              </button>
            );
          })}

          {options.length === 0 && (
            <div className="custom-dropdown__empty">No options available</div>
          )}
        </div>
      )}
    </div>
  );
};

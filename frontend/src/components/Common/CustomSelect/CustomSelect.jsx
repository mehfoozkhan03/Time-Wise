import "./CustomSelect.css";

import {
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { FaCheck, FaChevronDown } from "react-icons/fa";

function CustomSelect({
  id,
  name,
  value,
  options = [],
  onChange,
  disabled = false,
  placeholder = "Select option",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null);

  const selectedOption = options.find(
    (option) => option.value === value,
  );

  const handleToggle = useCallback(() => {
    if (disabled) {
      return;
    }

    setIsOpen((previous) => !previous);
  }, [disabled]);

  const handleSelect = useCallback(
    (option) => {
      if (disabled) {
        return;
      }

      onChange?.({
        target: {
          name,
          value: option.value,
        },
      });

      setIsOpen(false);
    },
    [disabled, name, onChange],
  );

  const handleKeyDown = useCallback(
    (event) => {
      if (disabled) {
        return;
      }

      if (
        event.key === "Enter" ||
        event.key === " " ||
        event.key === "ArrowDown"
      ) {
        event.preventDefault();
        setIsOpen(true);
        return;
      }

      if (event.key === "Escape") {
        event.preventDefault();
        setIsOpen(false);
      }
    },
    [disabled],
  );

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  useEffect(() => {
    if (disabled) {
      setIsOpen(false);
    }
  }, [disabled]);

  return (
    <div
      ref={selectRef}
      className={`customSelect ${isOpen ? "open" : ""} ${
        disabled ? "disabled" : ""
      }`}
    >
      <button
        id={id}
        type="button"
        className="customSelectTrigger"
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className={selectedOption ? "" : "placeholder"}>
          {selectedOption?.label || placeholder}
        </span>

        <FaChevronDown className="customSelectArrow" />
      </button>

      {isOpen && (
        <div
          className="customSelectMenu"
          role="listbox"
          aria-labelledby={id}
        >
          {options.map((option) => {
            const isSelected = option.value === value;

            return (
              <button
                key={option.value}
                type="button"
                className={`customSelectOption ${
                  isSelected ? "selected" : ""
                }`}
                onClick={() => handleSelect(option)}
                role="option"
                aria-selected={isSelected}
              >
                <span>{option.label}</span>

                {isSelected && (
                  <FaCheck className="customSelectCheck" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

CustomSelect.displayName = "CustomSelect";

export default memo(CustomSelect);
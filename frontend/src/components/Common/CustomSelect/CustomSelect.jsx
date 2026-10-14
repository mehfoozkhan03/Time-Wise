import "./CustomSelect.css";

import {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { FaCheck, FaChevronDown, FaSearch } from "react-icons/fa";

function CustomSelect({
  id,
  name,
  value,
  options = [],
  onChange,
  disabled = false,
  placeholder = "Select option",
  searchable = false,
  searchPlaceholder = "Search options...",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const selectRef = useRef(null);
  const searchInputRef = useRef(null);

  const selectedOption = options.find(
    (option) => option.value === value,
  );

  const filteredOptions = useMemo(() => {
    if (!searchable || !searchTerm.trim()) {
      return options;
    }

    const query = searchTerm.trim().toLowerCase();

    return options.filter((option) =>
      String(option.label ?? "")
        .toLowerCase()
        .includes(query),
    );
  }, [options, searchable, searchTerm]);

  const handleToggle = useCallback(() => {
    if (disabled) {
      return;
    }

    setIsOpen((previous) => {
      const nextOpen = !previous;

      if (!nextOpen) {
        setSearchTerm("");
      }

      return nextOpen;
    });
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
      setSearchTerm("");
    },
    [disabled, name, onChange],
  );

  const handleKeyDown = useCallback(
    (event) => {
      if (disabled) {
        return;
      }

      if (event.key === "Escape") {
        event.preventDefault();
        setIsOpen(false);
        setSearchTerm("");
        return;
      }

      if (
        event.key === "Enter" ||
        event.key === " " ||
        event.key === "ArrowDown"
      ) {
        if (searchable && event.target === searchInputRef.current) {
          if (event.key === "Enter" && filteredOptions.length === 1) {
            event.preventDefault();
            handleSelect(filteredOptions[0]);
          }

          return;
        }

        event.preventDefault();
        setIsOpen(true);
      }
    },
    [disabled, searchable, filteredOptions, handleSelect],
  );

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target)
      ) {
        setIsOpen(false);
        setSearchTerm("");
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
      setSearchTerm("");
    }
  }, [disabled]);

  useEffect(() => {
    if (isOpen && searchable) {
      searchInputRef.current?.focus();
    }
  }, [isOpen, searchable]);

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
        <div className="customSelectMenu">
          {searchable && (
            <div className="customSelectSearch">
              <FaSearch aria-hidden="true" />

              <input
                ref={searchInputRef}
                type="text"
                value={searchTerm}
                placeholder={searchPlaceholder}
                aria-label={searchPlaceholder}
                onChange={(event) => setSearchTerm(event.target.value)}
                onKeyDown={handleKeyDown}
                onClick={(event) => event.stopPropagation()}
                disabled={disabled}
              />
            </div>
          )}

          <div
            role="listbox"
            aria-labelledby={id}
            aria-activedescendant={undefined}
          >
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => {
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
              })
            ) : (
              <div className="customSelectEmpty">
                No matching options found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

CustomSelect.displayName = "CustomSelect";

export default memo(CustomSelect);

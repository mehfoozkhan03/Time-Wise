import { useEffect, useRef, useState } from "react";
import { FaChevronDown } from "react-icons/fa6";
import "./AnnoucementDropdown.css";

export const AnnoucementDropdown = ({
  options,
  value,
  onChange,
  placeholder = "Select",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const handleSelect = (option) => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div className="custom_dropdown" ref={dropdownRef}>
      <button
        type="button"
        className={`dropdown_trigger ${isOpen ? "active" : ""}`}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span>{value || placeholder}</span>

        <FaChevronDown
          className={isOpen ? "rotate" : ""}
        />
      </button>

      {isOpen && (
        <div className="dropdown_menu">
          {options.map((option) => (
            <div
              key={option}
              className={`dropdown_option ${
                value === option ? "selected" : ""
              }`}
              onClick={() => handleSelect(option)}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
import "./DesignationDropdown.css";

import { useEffect, useRef, useState } from "react";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";

export const DesignationDropdown = ({
  designations,
  selectedDesignation,
  onSelect,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const dropdownRef = useRef(null);

  const handleSelect = (designation) => {
    setIsOpen(false);
    onSelect(designation);
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  return (
    <div
      ref={dropdownRef}
      className="employeeDesignationDropdown"
    >
      <button
        type="button"
        className="employeeDesignationDropdown-button"
        disabled={!!selectedDesignation}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span>{selectedDesignation || "Select Designation"}</span>

        {!selectedDesignation && (
          <MdOutlineKeyboardArrowDown
            className={isOpen ? "employeeDesignationDropdown-arrow-open" : ""}
          />
        )}
      </button>

      {isOpen && !selectedDesignation && (
        <div className="employeeDesignationDropdown-menu">
          {designations.map((designation) => (
            <div
              key={designation}
              className="employeeDesignationDropdown-option"
              onClick={() => handleSelect(designation)}
            >
              {designation}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

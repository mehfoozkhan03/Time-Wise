import "./DepartmentDropdown.css";

import { useEffect, useRef, useState } from "react";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";

export const DepartmentDropdown = ({ departments, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);

  const dropdownRef = useRef(null);

  const handleSelect = (department) => {
    setIsOpen(false);
    onSelect(department);
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
      className="employeeDepartmentDropdown"
      ref={dropdownRef}
    >
      <button
        type="button"
        className="employeeDepartmentDropdown-button"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span>Select Department</span>

        <MdOutlineKeyboardArrowDown
          className={isOpen ? "employeeDepartmentDropdown-arrow-open" : ""}
        />
      </button>

      {isOpen && (
        <div className="employeeDepartmentDropdown-menu">
          {departments.map((department) => (
            <div
              key={department}
              className="employeeDepartmentDropdown-option"
              onClick={() => handleSelect(department)}
            >
              {department}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

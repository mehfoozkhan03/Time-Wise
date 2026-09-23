import "./RoleDropdown.css";

import { useEffect, useRef, useState } from "react";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";

export const RoleDropdown = ({
  roles,
  selectedRole,
  onSelect,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const dropdownRef = useRef(null);

  const handleSelect = (role) => {
    setIsOpen(false);
    onSelect(role);
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, []);

  return (
    <div
      className="employeeRoleDropdown"
      ref={dropdownRef}
    >
      <button
        type="button"
        className="employeeRoleDropdown-button"
        onClick={() =>
          setIsOpen((prev) => !prev)
        }
      >
        <span>
          {selectedRole || "Select Role"}
        </span>

        <MdOutlineKeyboardArrowDown
          className={
            isOpen
              ? "employeeRoleDropdown-arrow-open"
              : ""
          }
        />
      </button>

      {isOpen && (
        <div className="employeeRoleDropdown-menu">
          {roles.map((role) => (
            <div
              key={role}
              className="employeeRoleDropdown-option"
              onClick={() => handleSelect(role)}
            >
              {role}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
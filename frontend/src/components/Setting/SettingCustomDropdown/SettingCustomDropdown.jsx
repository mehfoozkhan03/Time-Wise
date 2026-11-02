import { useEffect, useRef, useState } from "react";
import "./SettingCustomDropdown.css";

import { FaAngleDown } from "react-icons/fa6";

export const SettingCustomDropdown = ({
    options,
    value,
    onChange,
    placeholder = "Select an option"
}) => {

    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const handleSelect = (option) => {
        onChange(option.value);
        setIsOpen(false);
    };

    const selectedOption = options.find(
        (el) => el.value === value
    );

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <>
            <div className="setting-dropdown-container" onClick={() => setIsOpen(!isOpen)} ref={dropdownRef}>
                <div className="setting-dropdown-header">
                    {selectedOption?.label || placeholder}
                </div>

                {isOpen && (
                    <div className="setting-dropdown-menu">
                        {
                            options.map((el) => (
                                <div key={el.value} className="setting-dropdown-item"
                                    onClick={() => handleSelect(el)}>
                                    {el.label}
                                </div>
                            ))
                        }
                    </div>
                )}
                <FaAngleDown style={{ rotate: isOpen ? "180deg" : "none" }} />
            </div>
        </>
    )
}
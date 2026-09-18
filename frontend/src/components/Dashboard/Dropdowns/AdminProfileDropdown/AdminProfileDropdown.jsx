import "./AdminProfileDropdown.css";

import { useEffect, useRef, useState } from "react";
import {
  FiChevronDown,
  FiUser,
  FiSettings,
  FiBell,
  FiLock,
  FiLogOut,
} from "react-icons/fi";
import { adminAuthService } from "../../../../services/adminAuthService";
import { adminLogout } from "../../../../store/adminAuthSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

export const AdminProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await adminAuthService.logout();

      dispatch(adminLogout());

      navigate("/admin/login");
    } catch (error) {
      console.error("Admin Logout Error:", error);
    }
  };

  const [isOpen, setIsOpen] = useState(false);

  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      className="admin-profile-wrapper"
      ref={dropdownRef}
    >
      {/* Profile Button */}
      <button
        className="admin-profile-btn"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <div className="admin-avatar">SK</div>

        <div className="admin-profile-info">
          <strong>Admin</strong>
          <span>Super Admin</span>
        </div>

        <FiChevronDown className={`admin-chevron ${isOpen ? "rotate" : ""}`} />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="admin-profile-dropdown">
          <div className="admin-dropdown-header">
            <div className="admin-avatar large">SK</div>

            <div>
              <strong>Admin</strong>
              <span>Super Admin</span>
            </div>
          </div>

          <div className="admin-dropdown-divider" />

          <button className="admin-dropdown-item">
            <FiUser />
            <span>My Profile</span>
          </button>

          <button className="admin-dropdown-item">
            <FiSettings />
            <span>Account Settings</span>
          </button>

          <button className="admin-dropdown-item">
            <FiLock />
            <span>Change Password</span>
          </button>

          <div className="admin-dropdown-divider" />

          <button
            className="admin-dropdown-item logout"
            onClick={handleLogout}
          >
            <FiLogOut />
            <span>Logout</span>
          </button>
        </div>
      )}
    </div>
  );
};

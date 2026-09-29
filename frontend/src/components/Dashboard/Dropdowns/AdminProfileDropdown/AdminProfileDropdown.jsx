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
import { Modal } from "../../../Modal/Modal";

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

  //# Change Admin Password
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;

    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const closePasswordModal = () => {
    if (isChangingPassword) return;

    setShowPasswordModal(false);

    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const handleChangePassword = async () => {
    const { currentPassword, newPassword, confirmPassword } = passwordData;

    if (!currentPassword.trim()) {
      alert("Please enter your current password.");
      return;
    }

    if (!newPassword.trim()) {
      alert("Please enter your new password.");
      return;
    }

    if (newPassword.length < 6) {
      alert("New password must be at least 6 characters.");
      return;
    }

    if (!confirmPassword.trim()) {
      alert("Please confirm your new password.");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("New passwords do not match.");
      return;
    }

    if (currentPassword === newPassword) {
      alert("New password must be different from your current password.");
      return;
    }

    try {
      setIsChangingPassword(true);

      await adminAuthService.changeOwnPassword(currentPassword, newPassword);

      alert("Password changed successfully.");

      closePasswordModal();
    } catch (error) {
      console.error("Admin password change failed:", error);

      alert(error?.response?.data?.message || "Failed to change password.");
    } finally {
      setIsChangingPassword(false);
    }
  };

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

          <button
            className="admin-dropdown-item"
            onClick={() => {
              setShowPasswordModal(true);
              setIsOpen(false);

              setPasswordData({
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
              });
            }}
          >
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
      {showPasswordModal && (
        <Modal isOpen overlayClassName="admin-password-modal-overlay" className="admin-password-modal">
            <div className="admin-password-icon">
              <FiLock />
            </div>

            <h3>Change Password</h3>

            <p className="admin-password-description">
              Enter your current password and choose a new password.
            </p>

            {/* CURRENT PASSWORD */}
            <div className="admin-password-input-group">
              <label>Current Password</label>

              <input
                type="password"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                placeholder="Enter current password"
                disabled={isChangingPassword}
              />
            </div>

            {/* NEW PASSWORD */}
            <div className="admin-password-input-group">
              <label>New Password</label>

              <input
                type="password"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                placeholder="Enter new password"
                disabled={isChangingPassword}
              />
            </div>

            {/* CONFIRM PASSWORD */}
            <div className="admin-password-input-group">
              <label>Confirm New Password</label>

              <input
                type="password"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                placeholder="Confirm new password"
                disabled={isChangingPassword}
              />
            </div>

            {/* BUTTONS */}
            <div className="admin-password-modal-actions">
              <button
                type="button"
                className="admin-password-cancel"
                onClick={closePasswordModal}
                disabled={isChangingPassword}
              >
                Cancel
              </button>

              <button
                type="button"
                className="admin-password-confirm"
                onClick={handleChangePassword}
                disabled={isChangingPassword}
              >
                {isChangingPassword ? "Changing..." : "Change Password"}
              </button>
            </div>
        </Modal>
      )}
    </div>
  );
};

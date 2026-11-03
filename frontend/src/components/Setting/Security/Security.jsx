import { IoMdEye } from "react-icons/io";
import { IoMdEyeOff } from "react-icons/io";
import { IoToggleOutline } from "react-icons/io5";
import { IoToggle } from "react-icons/io5";
import { useState, useEffect } from "react";
import Skeleton from "../../../components/Skeleton/Skeleton";

import "./Security.css";
import { SwitchBtn } from "../../SwichBtn/SwitchBtn";
import { SettingCustomDropdown } from "../SettingCustomDropdown/SettingCustomDropdown";

const timeSelectionOpt = [
  { label: "15 Min", value: "15 min" },
  { label: "30 Min", value: "30 min" },
  { label: "1 Hr", value: "1 hr" },
  { label: "4 Hr", value: "4 hr" },
  { label: "Never", value: "never" },
]

export const Security = () => {

  //# Dropdown 
  const [timeSelection, setTimeSelection] = useState("15 min");

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const togglePassword = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const [showSkeleton, setShowSkeleton] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSkeleton(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (showSkeleton) {
    return (
      <div className="security-container">

        {/* Heading Skeleton */}
        <div className="security-heading">
          <Skeleton width="150px" height="32px" />

          <div style={{ marginTop: "10px" }}>
            <Skeleton width="450px" height="18px" />
          </div>
        </div>

        {/* Change Password Skeleton */}
        <div className="change-password">
          <div className="change-password-heading">
            <Skeleton width="180px" height="25px" />
          </div>

          <div className="change-password-content">

            {[1, 2, 3].map((item) => (
              <div key={item}>
                <Skeleton width="140px" height="18px" />

                <div style={{ marginTop: "8px" }}>
                  <Skeleton width="100%" height="45px" radius="8px" />
                </div>
              </div>
            ))}

          </div>
        </div>

        {/* Two Factor Authentication Skeleton */}
        <div className="two-factor-authentication">
          <div className="two-factor-heading">
            <Skeleton width="220px" height="25px" />
          </div>

          <div className="two-factor-content">
            <div>
              <Skeleton width="120px" height="20px" />

              <div style={{ marginTop: "8px" }}>
                <Skeleton width="300px" height="16px" />
              </div>
            </div>

            <Skeleton width="45px" height="25px" radius="20px" />
          </div>
        </div>

        {/* Session & Access Skeleton */}
        <div className="session-access">

          <div className="session-heading">
            <Skeleton width="170px" height="25px" />
          </div>

          {/* Login Alert */}
          <div className="login-alert">
            <div>
              <Skeleton width="120px" height="20px" />

              <div style={{ marginTop: "8px" }}>
                <Skeleton width="350px" height="16px" />
              </div>
            </div>

            <Skeleton width="45px" height="25px" radius="20px" />
          </div>

          {/* Session Timeout */}
          <div className="session-timeout">
            <div>
              <Skeleton width="140px" height="20px" />

              <div style={{ marginTop: "8px" }}>
                <Skeleton width="280px" height="16px" />
              </div>
            </div>

            <Skeleton width="130px" height="40px" radius="8px" />
          </div>

        </div>

        {/* Save Changes Skeleton */}
        <div className="save_changes">
          <Skeleton width="130px" height="18px" />

          <Skeleton width="140px" height="42px" radius="8px" />
        </div>

      </div>
    );
  }

  return (
    <>
      <div className="security-container">
        <div className="security-heading">
          <h2>Security</h2>
          <p>Manage your password, two-factor auth, and session settings.</p>
        </div>

        {/* Change password */}
        <div className="change-password">
          <div className="change-password-heading">
            <h3>Change password</h3>
          </div>
          <div className="change-password-content">
            <div className="current-password">
              <label htmlFor="currentpassword">Current password</label>
              <div>
                <input
                  type={showPassword.current ? "text" : "password"}
                  placeholder="Enter current password"
                />

                {showPassword.current ? (
                  <IoMdEyeOff
                    className="password-eye"
                    onClick={() => togglePassword("current")}
                  />
                ) : (
                  <IoMdEye
                    className="password-eye"
                    onClick={() => togglePassword("current")}
                  />
                )}
              </div>
            </div>
            <div className="new-password">
              <label htmlFor="newpassword">New password</label>
              <div>
                <input
                  type={showPassword.new ? "text" : "password"}
                  placeholder="Enter new password"
                />

                {showPassword.new ? (
                  <IoMdEyeOff
                    className="password-eye"
                    onClick={() => togglePassword("new")}
                  />
                ) : (
                  <IoMdEye
                    className="password-eye"
                    onClick={() => togglePassword("new")}
                  />
                )}
              </div>
            </div>
            <div className="confirm-new-password">
              <label htmlFor="currentpassword">Confirm new password</label>
              <div>
                <input
                  type={showPassword.confirm ? "text" : "password"}
                  placeholder="Repeat new password"
                />

                {showPassword.confirm ? (
                  <IoMdEyeOff
                    className="password-eye"
                    onClick={() => togglePassword("confirm")}
                  />
                ) : (
                  <IoMdEye
                    className="password-eye"
                    onClick={() => togglePassword("confirm")}
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Two factor authentication */}
        <div className="two-factor-authentication">
          <div className="two-factor-heading">
            <h3>Two-factor authentication</h3>
          </div>
          <div className="two-factor-content">
            <div>
              <h3>Enable 2FA</h3>
              <p>Require a verification code on every sign-in</p>
            </div>
            <div>
              <SwitchBtn />
            </div>
          </div>
        </div>

        {/* session & access */}
        <div className="session-access">
          <div className="session-heading">
            <h3>Session & heading</h3>
          </div>
          <div className="login-alert">
            <div>
              <h3>Login alerts</h3>
              <p>
                Get notified when your account is accessed from a new device
              </p>
            </div>
            <div>
              <SwitchBtn />
            </div>
          </div>
          <div className="session-timeout">
            <div>
              <h3>Session timeout</h3>
              <p>Automatically log out after inactivity</p>
            </div>
            <div className="timeout-selection">
              <SettingCustomDropdown value={timeSelection}
                onChange={setTimeSelection}
                placeholder="Select date format" options={timeSelectionOpt} />
            </div>
          </div>
        </div>

        {/* Save changes */}
        <div className="save_changes">
          <div>
            <p>Unsaved changes</p>
          </div>
          <button
            type="button"
            className="change-btn"
          >
            Save changes
          </button>
        </div>
      </div>
    </>
  );
};


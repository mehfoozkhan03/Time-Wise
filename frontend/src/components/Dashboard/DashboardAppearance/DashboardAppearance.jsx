import { useDispatch, useSelector } from "react-redux";


import { MdOutlineLightMode } from "react-icons/md";
import { MdOutlineDarkMode } from "react-icons/md";
import { CiLaptop } from "react-icons/ci";

import "./DashboardAppearance.css";
import { setAdminTheme, updateAdminTheme } from "../../../store/adminThemeSlice";


export const DashboardAppearance = () => {
  const dispatch = useDispatch();

  const theme = useSelector((state) => state.adminTheme.theme);

  const changeTheme = (newTheme) => {
    // Immediately update UI
    dispatch(setAdminTheme(newTheme));

    // Save to backend
    dispatch(updateAdminTheme(newTheme));
  };

  return (
    <>
      <div className="dahsboard-appearance-container">
        <div className="dahsboard-appearance-heading">
          <h2>Apperance</h2>
          <p>Customize how the app looks and feels on your devices.</p>
        </div>

        {/* Theme */}
        <div className="dahsboard-theme-container">
          <div className="dahsboard-theme-heading">
            <h3>Theme</h3>
          </div>
          <div className="dahsboard-theme-mode">
            <div
              className={`dahsboard-light-mode ${
                theme === "light" ? "dahsboard-active-theme" : ""
              }`}
              onClick={() => changeTheme("light")}
            >
              <MdOutlineLightMode className="dahsboard-mode-icon" />
              <p>Light</p>
            </div>
            <div
              className={`dahsboard-dark-mode ${
                theme === "dark" ? "dahsboard-active-theme" : ""
              }`}
              onClick={() => changeTheme("dark")}
            >
              <MdOutlineDarkMode className="dahsboard-mode-icon" />
              <p>Dark</p>
            </div>
            <div
              className={`dahsboard-system-mode ${
                theme === "system" ? "dahsboard-active-theme" : ""
              }`}
              onClick={() => changeTheme("system")}
            >
              <CiLaptop className="dahsboard-mode-icon" />
              <p>System</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

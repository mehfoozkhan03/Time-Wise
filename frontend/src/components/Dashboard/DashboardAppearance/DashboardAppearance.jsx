import { MdOutlineLightMode } from "react-icons/md";
import { MdOutlineDarkMode } from "react-icons/md";
import { CiLaptop } from "react-icons/ci";
import "./DashboardAppearance.css";
import { useAdminTheme } from "../../../context/AdminThemeContext";

export const DashboardAppearance = () => {
  const { adminTheme, changeAdminTheme } = useAdminTheme();

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
                adminTheme === "light" ? "dahsboard-active-theme" : ""
              }`}
              onClick={() => changeAdminTheme("light")}
            >
              <MdOutlineLightMode className="dahsboard-mode-icon" />
              <p>Light</p>
            </div>
            <div
              className={`dahsboard-dark-mode ${
                adminTheme === "dark" ? "dahsboard-active-theme" : ""
              }`}
              onClick={() => changeAdminTheme("dark")}
            >
              <MdOutlineDarkMode className="dahsboard-mode-icon" />
              <p>Dark</p>
            </div>
            <div
              className={`dahsboard-system-mode ${
                adminTheme === "system" ? "dahsboard-active-theme" : ""
              }`}
              onClick={() => changeAdminTheme("system")}
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

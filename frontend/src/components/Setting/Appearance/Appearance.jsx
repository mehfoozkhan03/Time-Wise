// import { useTheme } from "../../../context/ThemeContext";

// import { MdOutlineLightMode } from "react-icons/md";
// import { MdOutlineDarkMode } from "react-icons/md";
// import { CiLaptop } from "react-icons/ci";
// import "./Appearance.css";


// export const Appearance = () => {
//     const { currentTheme, changeTheme } = useTheme();

//     return (
//         <>
//             <div className="appearance-container">
//                 <div className="appearance-heading">
//                     <h2>Apperance</h2>
//                     <p>Customize how the app looks and feels on your devices.</p>
//                 </div>

//                 {/* Theme */}
//                 <div className="theme-container">
//                     <div className="theme-heading">
//                         <h3>Theme</h3>
//                     </div>
//                     <div className="theme-mode">
//                         <div className={`light-mode ${currentTheme === "light" ? "active-theme" : ""}`} onClick={() => changeTheme("light")}>
//                             <MdOutlineLightMode className="mode-icon" />
//                             <p>Light</p>
//                         </div>
//                         <div className={`dark-mode ${currentTheme === "dark" ? "active-theme" : ""}`} onClick={() => changeTheme("dark")}>
//                             <MdOutlineDarkMode className="mode-icon" />
//                             <p>Dark</p>
//                         </div>
//                         <div className={`system-mode ${currentTheme === "system" ? "active-theme" : ""}`} onClick={() => changeTheme("system")}>
//                             <CiLaptop className="mode-icon" />
//                             <p>System</p>
//                         </div>
//                     </div>
//                 </div>


//                 {/* Layout & Localization */}
//                 <div className="layout-localization">
//                     <div className="layout-heading">
//                         <h3>Layout & localization</h3>
//                     </div>
//                     <div className="layout">
//                         <div className="display-density">
//                             <div>
//                                 <h3>Dissplay density</h3>
//                                 <p>Controls padding and element sizing</p>
//                             </div>
//                             <div className="layout-select">
//                                 <select>
//                                     <option value="compact">Compact</option>
//                                     <option value="comfortable" selected>Comfortable</option>
//                                     <option value="spacious">Spacious</option>
//                                 </select>
//                             </div>
//                         </div>
//                         <div className="language">
//                             <div>
//                                 <h3>Language</h3>
//                                 <p>Interface language</p>
//                             </div>
//                             <div className="layout-select">
//                                 <select>
//                                     <option value="english">English(US)</option>
//                                     <option value="french">French</option>
//                                     <option value="german">German</option>
//                                 </select>
//                             </div>
//                         </div>
//                         <div className="date-format">
//                             <div>
//                                 <h3>Date format</h3>
//                                 <p>How dates are displayed across the app</p>
//                             </div>
//                             <div className="layout-select">
//                                 <select>
//                                     <option value="MM/DD/YYYY">MM/DD/YYYY</option>
//                                     <option value="DD/MM/YYYY">DD/MM/YYYY</option>
//                                     <option value="YYYY-MM-DD">YYYY-MM-DD</option>
//                                 </select>
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Save changes */}
//                 <div className="save_changes">
//                     <div>
//                         <p>Unsaved changes</p>
//                     </div>
//                     <button
//                         type="button"
//                         className="change-btn"
//                     >
//                         Save changes
//                     </button>
//                 </div>
//             </div>
//         </>
//     )
// }


import { useTheme } from "../../../context/ThemeContext";

import { MdOutlineLightMode } from "react-icons/md";
import { MdOutlineDarkMode } from "react-icons/md";
import { CiLaptop } from "react-icons/ci";

import Skeleton from "../../../components/Skeleton/Skeleton";

import "./Appearance.css";

export const Appearance = ({ isLoading = false }) => {
  const { currentTheme, changeTheme } = useTheme();

  // =========================
  // SKELETON UI
  // =========================
  if (isLoading) {
    return (
      <div className="appearance-container">

        {/* Heading Skeleton */}
        <div className="appearance-heading">
          <Skeleton width="120px" height="28px" />

          <div style={{ marginTop: "10px" }}>
            <Skeleton width="350px" height="16px" />
          </div>
        </div>

        {/* Theme Skeleton */}
        <div className="theme-container">

          <div className="theme-heading">
            <Skeleton width="70px" height="22px" />
          </div>

          <div
            className="theme-mode"
            style={{
              display: "flex",
              gap: "15px",
              marginTop: "15px",
            }}
          >
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                style={{
                  width: "100px",
                  height: "80px",
                  borderRadius: "10px",
                  border: "1px solid var(--border)",
                  padding: "15px",
                }}
              >
                <Skeleton
                  width="28px"
                  height="28px"
                  radius="50%"
                />

                <div style={{ marginTop: "10px" }}>
                  <Skeleton width="50px" height="14px" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Layout & Localization Skeleton */}
        <div className="layout-localization">

          <div className="layout-heading">
            <Skeleton width="180px" height="22px" />
          </div>

          <div className="layout">

            {[1, 2, 3].map((item) => (
              <div
                key={item}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "18px 0",
                  borderBottom: "1px solid var(--border)",
                }}
              >
                <div>
                  <Skeleton width="150px" height="18px" />

                  <div style={{ marginTop: "8px" }}>
                    <Skeleton width="220px" height="14px" />
                  </div>
                </div>

                <Skeleton
                  width="150px"
                  height="40px"
                  radius="7px"
                />
              </div>
            ))}

          </div>
        </div>

        {/* Save Changes Skeleton */}
        <div
          className="save_changes"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Skeleton width="130px" height="16px" />

          <Skeleton
            width="120px"
            height="40px"
            radius="8px"
          />
        </div>

      </div>
    );
  }

  // =========================
  // ORIGINAL UI
  // =========================
  return (
    <div className="appearance-container">

      {/* Appearance Heading */}
      <div className="appearance-heading">
        <h2>Appearance</h2>

        <p>
          Customize how the app looks and feels on your devices.
        </p>
      </div>

      {/* Theme */}
      <div className="theme-container">

        <div className="theme-heading">
          <h3>Theme</h3>
        </div>

        <div className="theme-mode">

          <div
            className={`light-mode ${
              currentTheme === "light" ? "active-theme" : ""
            }`}
            onClick={() => changeTheme("light")}
          >
            <MdOutlineLightMode className="mode-icon" />
            <p>Light</p>
          </div>

          <div
            className={`dark-mode ${
              currentTheme === "dark" ? "active-theme" : ""
            }`}
            onClick={() => changeTheme("dark")}
          >
            <MdOutlineDarkMode className="mode-icon" />
            <p>Dark</p>
          </div>

          <div
            className={`system-mode ${
              currentTheme === "system" ? "active-theme" : ""
            }`}
            onClick={() => changeTheme("system")}
          >
            <CiLaptop className="mode-icon" />
            <p>System</p>
          </div>

        </div>
      </div>

      {/* Layout & Localization */}
      <div className="layout-localization">

        <div className="layout-heading">
          <h3>Layout & localization</h3>
        </div>

        <div className="layout">

          {/* Display Density */}
          <div className="display-density">

            <div>
              <h3>Display density</h3>
              <p>Controls padding and element sizing</p>
            </div>

            <div className="layout-select">
              <select defaultValue="comfortable">
                <option value="compact">Compact</option>
                <option value="comfortable">Comfortable</option>
                <option value="spacious">Spacious</option>
              </select>
            </div>

          </div>

          {/* Language */}
          <div className="language">

            <div>
              <h3>Language</h3>
              <p>Interface language</p>
            </div>

            <div className="layout-select">
              <select defaultValue="english">
                <option value="english">English(US)</option>
                <option value="french">French</option>
                <option value="german">German</option>
              </select>
            </div>

          </div>

          {/* Date Format */}
          <div className="date-format">

            <div>
              <h3>Date format</h3>
              <p>How dates are displayed across the app</p>
            </div>

            <div className="layout-select">
              <select defaultValue="MM/DD/YYYY">
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              </select>
            </div>

          </div>

        </div>
      </div>

      {/* Save Changes */}
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
  );
};
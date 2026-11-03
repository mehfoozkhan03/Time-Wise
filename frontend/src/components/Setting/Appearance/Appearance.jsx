
// import { useDispatch, useSelector } from "react-redux";
// import { useEffect, useState } from "react";

// import "./Appearance.css";
// import { updateTheme } from "../../../store/themeSlice";
// import Skeleton from "../../../components/Skeleton/Skeleton";

// import { MdOutlineLightMode, MdOutlineDarkMode } from "react-icons/md";
// import { CiLaptop } from "react-icons/ci";
// import { SettingCustomDropdown } from "../SettingCustomDropdown/SettingCustomDropdown";

// const densityOpt = [
//   { label: "Compact", value: "compact" },
//   { label: "Comfortable", value: "comfortable" },
//   { label: "Spacious", value: "spacious" }
// ]

// const languageOpt = [
//   {label: "English", value: "english"},
//   {label: "French", value: "french"},
//   {label: "German", value: "german"},
// ]
// const dateFormatOpt = [
//   {label: "MM/DD/YYYY", value: "mm/dd/yyyy"},
//   {label: "DD/MM/YYYY", value: "dd/mm/yyyy"},
//   {label: "YYYY-MM-DD", value: "yyyy/mm/dd"},
// ]

// export const Appearance = () => {

//   //# Dropdown 
//   const [density, setDensity] = useState("comfortable");
//   const [language, setLanguage] = useState("english");
//   const [dateFormat, setDateFormat] = useState("mm/dd/yyyy");

//   const dispatch = useDispatch();

//   const {
//     theme: currentTheme,
//     loading,
//     error,
//   } = useSelector((state) => state.theme);

//   const [showSkeleton, setShowSkeleton] = useState(true);

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setShowSkeleton(false);
//     }, 1500);

//     return () => clearTimeout(timer);
//   }, []);

//   const changeTheme = (theme) => {
//     dispatch(updateTheme(theme));
//   };

//   // Skeleton UI
//   if (showSkeleton) {
//     return (
//       <div className="appearance-container appearance-skeleton">

//         {/* Heading */}
//         <div className="appearance-heading">
//           <Skeleton width="150px" height="28px" />
//           <div className="appearance-skeleton-subtitle">
//             <Skeleton width="350px" height="16px" />
//           </div>
//         </div>

//         {/* Theme */}
//         <div className="theme-container">
//           <div className="theme-heading">
//             <Skeleton width="70px" height="22px" />
//           </div>

//           <div className="theme-mode">
//             {[1, 2, 3].map((item) => (
//               <div className="appearance-skeleton-theme" key={item}>
//                 <Skeleton
//                   width="28px"
//                   height="28px"
//                   radius="50%"
//                 />
//                 <Skeleton width="55px" height="16px" />
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Layout & Localization */}
//         <div className="layout-localization">
//           <div className="layout-heading">
//             <Skeleton width="210px" height="24px" />
//           </div>

//           <div className="layout">
//             {[1, 2, 3].map((item) => (
//               <div className="appearance-skeleton-row" key={item}>
//                 <div className="appearance-skeleton-text">
//                   <Skeleton width="150px" height="18px" />
//                   <Skeleton width="220px" height="14px" />
//                 </div>

//                 <Skeleton
//                   width="160px"
//                   height="40px"
//                   radius="6px"
//                 />
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Save Changes */}
//         <div className="save_changes">
//           <Skeleton width="130px" height="16px" />
//           <Skeleton width="130px" height="40px" radius="8px" />
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="appearance-container">

//       {/* Heading */}
//       <div className="appearance-heading">
//         <h2>Appearance</h2>
//         <p>Customize how the app looks and feels on your devices.</p>
//       </div>

//       {/* Theme */}
//       <div className="theme-container">
//         <div className="theme-heading">
//           <h3>Theme</h3>
//         </div>

//         <div className="theme-mode">
//           <div
//             className={`light-mode ${currentTheme === "light" ? "active-theme" : ""
//               }`}
//             onClick={() => changeTheme("light")}
//           >
//             <MdOutlineLightMode className="mode-icon" />
//             <p>Light</p>
//           </div>

//           <div
//             className={`dark-mode ${currentTheme === "dark" ? "active-theme" : ""
//               }`}
//             onClick={() => changeTheme("dark")}
//           >
//             <MdOutlineDarkMode className="mode-icon" />
//             <p>Dark</p>
//           </div>

//           <div
//             className={`system-mode ${currentTheme === "system" ? "active-theme" : ""
//               }`}
//             onClick={() => changeTheme("system")}
//           >
//             <CiLaptop className="mode-icon" />
//             <p>System</p>
//           </div>
//         </div>

//         {loading && (
//           <p className="theme-status">Saving theme...</p>
//         )}

//         {error && (
//           <p className="theme-error">{error}</p>
//         )}
//       </div>

//       {/* Layout & Localization */}
//       <div className="layout-localization">
//         <div className="layout-heading">
//           <h3>Layout & localization</h3>
//         </div>

//         <div className="layout">

//           {/* Display Density */}
//           <div className="display-density">
//             <div>
//               <h3>Display density</h3>
//               <p>Controls padding and element sizing</p>
//             </div>

//             <div className="layout-select">
//               <SettingCustomDropdown value={density}
//                 onChange={setDensity}
//                 placeholder="Select density" options={densityOpt} />
//             </div>
//           </div>

//           {/* Language */}
//           <div className="language">
//             <div>
//               <h3>Language</h3>
//               <p>Interface language</p>
//             </div>

//             <div className="layout-select">
//               <SettingCustomDropdown value={language}
//                 onChange={setLanguage}
//                 placeholder="Select Language" options={languageOpt} />
//             </div>
//           </div>

//           {/* Date Format */}
//           <div className="date-format">
//             <div>
//               <h3>Date format</h3>
//               <p>How dates are displayed across the app</p>
//             </div>

//             <div className="layout-select">
//               <SettingCustomDropdown value={dateFormat}
//                 onChange={setDateFormat}
//                 placeholder="Select date format" options={dateFormatOpt} />
//             </div>
//           </div>

//         </div>
//       </div>

//       {/* Save Changes */}
//       <div className="save_changes">
//         <div>
//           <p>Unsaved changes</p>
//         </div>

//         <button
//           type="button"
//           className="change-btn"
//         >
//           Save changes
//         </button>
//       </div>

//     </div>
//   );
// };

// export default Appearance;

import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

import "./Appearance.css";
import { updateTheme } from "../../../store/themeSlice";
import Skeleton from "../../../components/Skeleton/Skeleton";

import {
  MdOutlineLightMode,
  MdOutlineDarkMode,
} from "react-icons/md";
import { CiLaptop } from "react-icons/ci";

import { SettingCustomDropdown } from "../SettingCustomDropdown/SettingCustomDropdown";

const densityOpt = [
  { label: "Compact", value: "compact" },
  { label: "Comfortable", value: "comfortable" },
  { label: "Spacious", value: "spacious" },
];

const languageOpt = [
  { label: "English", value: "english" },
  { label: "French", value: "french" },
  { label: "German", value: "german" },
];

const dateFormatOpt = [
  { label: "MM/DD/YYYY", value: "mm/dd/yyyy" },
  { label: "DD/MM/YYYY", value: "dd/mm/yyyy" },
  { label: "YYYY-MM-DD", value: "yyyy-mm-dd" },
];

export const Appearance = () => {
  // Dropdown States
  const [density, setDensity] = useState("comfortable");
  const [language, setLanguage] = useState("english");
  const [dateFormat, setDateFormat] = useState("mm/dd/yyyy");

  const dispatch = useDispatch();

  const {
    theme: currentTheme,
    loading,
    error,
  } = useSelector((state) => state.theme);

  // Skeleton State
  const [showSkeleton, setShowSkeleton] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSkeleton(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  // Change Theme
  const changeTheme = (theme) => {
    dispatch(updateTheme(theme));
  };

  // =====================================
  // SKELETON UI
  // =====================================

  if (showSkeleton) {
    return (
      <div className="appearance-container appearance-skeleton">

        {/* Heading */}
        <div className="appearance-heading">
          <Skeleton width="150px" height="24px" />

          <div className="appearance-skeleton-subtitle">
            <Skeleton width="320px" height="13px" />
          </div>
        </div>

        {/* Theme Section */}
        <div className="theme-container">

          <div className="theme-heading">
            <Skeleton width="65px" height="18px" />
          </div>

          <div className="theme-mode">
            {[1, 2, 3].map((item) => (
              <div className="appearance-skeleton-theme" key={item}>
                <Skeleton
                  width="18px"
                  height="18px"
                  radius="50%"
                />

                <Skeleton width="55px" height="12px" />
              </div>
            ))}
          </div>

        </div>

        {/* Layout & Localization */}
        <div className="layout-localization">

          <div className="layout-heading">
            <Skeleton width="190px" height="20px" />
          </div>

          <div className="layout">

            {[1, 2, 3].map((item) => (
              <div className="appearance-skeleton-row" key={item}>

                <div className="appearance-skeleton-text">
                  <Skeleton width="125px" height="15px" />
                  <Skeleton width="210px" height="12px" />
                </div>

                <Skeleton
                  width="132px"
                  height="36px"
                  radius="8px"
                />

              </div>
            ))}

          </div>
        </div>

        {/* Save Changes */}
        <div className="save_changes">
          <Skeleton width="115px" height="14px" />

          <Skeleton
            width="130px"
            height="40px"
            radius="8px"
          />
        </div>

      </div>
    );
  }

  // =====================================
  // ACTUAL APPEARANCE UI
  // =====================================

  return (
    <div className="appearance-container">

      {/* Heading */}
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

        {loading && (
          <p className="theme-status">Saving theme...</p>
        )}

        {error && (
          <p className="theme-error">{error}</p>
        )}

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
              <SettingCustomDropdown
                value={density}
                onChange={setDensity}
                placeholder="Select density"
                options={densityOpt}
              />
            </div>
          </div>

          {/* Language */}
          <div className="language">
            <div>
              <h3>Language</h3>
              <p>Interface language</p>
            </div>

            <div className="layout-select">
              <SettingCustomDropdown
                value={language}
                onChange={setLanguage}
                placeholder="Select Language"
                options={languageOpt}
              />
            </div>
          </div>

          {/* Date Format */}
          <div className="date-format">
            <div>
              <h3>Date format</h3>
              <p>How dates are displayed across the app</p>
            </div>

            <div className="layout-select">
              <SettingCustomDropdown
                value={dateFormat}
                onChange={setDateFormat}
                placeholder="Select date format"
                options={dateFormatOpt}
              />
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

export default Appearance;

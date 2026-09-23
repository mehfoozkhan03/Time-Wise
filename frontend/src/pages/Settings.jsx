// import { useLocation, Outlet } from "react-router-dom";

// import { FaRegUser } from "react-icons/fa";
// import { FaCalendarAlt } from "react-icons/fa";
// import { SettingSidebar } from "../components/Setting/SettingSidebar/SettingSidebar";
// import { MdOutlineWatchLater } from "react-icons/md";
// import { MdNotifications } from "react-icons/md";
// import { RiPaletteLine } from "react-icons/ri";
// import { FaLock } from "react-icons/fa";
// import { GoDatabase } from "react-icons/go";
// import { MdOutlineContactSupport } from "react-icons/md";
// import { MdEventAvailable } from "react-icons/md";

// import "../styles/Setting.css";

// export const Settings = () => {
//   const location = useLocation();

//   const pageData = {
//     "/settings/profile": {
//       title: "Profile",
//       icon: <FaRegUser />,
//     },
//     "/settings/attendance": {
//       title: "Attendance",
//       icon: <MdOutlineWatchLater />,
//     },
//     "/settings/leave": {
//       title: "Leave",
//       icon: <MdEventAvailable />,
//     },
//     "/settings/calendar": {
//       title: "Calendar",
//       icon: <FaCalendarAlt />,
//     },
//     "/settings/notification": {
//       title: "Notifications",
//       icon: <MdNotifications />,
//     },
//     "/settings/appearance": {
//       title: "Appearance",
//       icon: <RiPaletteLine />,
//     },
//     "/settings/security": {
//       title: "Security",
//       icon: <FaLock />,
//     },
//     "/settings/data_export": {
//       title: "Data & Export",
//       icon: <GoDatabase />,
//     },
//     "/settings/help_support": {
//       title: "Help & Support",
//       icon: <MdOutlineContactSupport />,
//     },
//   };

//   const currentPage =
//     pageData[location.pathname] || pageData["/settings/profile"];

//   return (
//     <div className="setting-page-container">
//       <SettingSidebar />

//       <div className="setting-page-content">
//         <div className="content-heading">
//           <span>{currentPage.icon}</span>
//           <h4>{currentPage.title}</h4>
//         </div>

//         <Outlet />
//       </div>
//     </div>
//   );
// };


import { useEffect, useState } from "react";
import { useLocation, Outlet } from "react-router-dom";

import { FaRegUser } from "react-icons/fa";
import { FaCalendarAlt } from "react-icons/fa";
import { SettingSidebar } from "../components/Setting/SettingSidebar/SettingSidebar";
import { MdOutlineWatchLater } from "react-icons/md";
import { MdNotifications } from "react-icons/md";
import { RiPaletteLine } from "react-icons/ri";
import { FaLock } from "react-icons/fa";
import { GoDatabase } from "react-icons/go";
import { MdOutlineContactSupport } from "react-icons/md";
import { MdEventAvailable } from "react-icons/md";

import Skeleton from "../components/Skeleton/Skeleton";

import "../styles/Setting.css";

export const Settings = () => {
  const location = useLocation();

  /* ==========================================
     SIDEBAR SKELETON
  ========================================== */

  const [showSkeleton, setShowSkeleton] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSkeleton(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  /* ==========================================
     PAGE DATA
  ========================================== */

  const pageData = {
    "/settings/profile": {
      title: "Profile",
      icon: <FaRegUser />,
    },

    "/settings/attendance": {
      title: "Attendance",
      icon: <MdOutlineWatchLater />,
    },

    "/settings/leave": {
      title: "Leave",
      icon: <MdEventAvailable />,
    },

    "/settings/calendar": {
      title: "Calendar",
      icon: <FaCalendarAlt />,
    },

    "/settings/notification": {
      title: "Notifications",
      icon: <MdNotifications />,
    },

    "/settings/appearance": {
      title: "Appearance",
      icon: <RiPaletteLine />,
    },

    "/settings/security": {
      title: "Security",
      icon: <FaLock />,
    },

    "/settings/data_export": {
      title: "Data & Export",
      icon: <GoDatabase />,
    },

    "/settings/help_support": {
      title: "Help & Support",
      icon: <MdOutlineContactSupport />,
    },
  };

  const currentPage =
    pageData[location.pathname] ||
    pageData["/settings/profile"];

  return (
    <div className="setting-page-container">

      {/* ======================================
          SETTINGS SIDEBAR
      ====================================== */}

      {showSkeleton ? (

        <aside className="setting-sidebar-skeleton">

          {/* SIDEBAR TITLE */}

          <div className="setting-sidebar-skeleton-title">

            <Skeleton
              width="120px"
              height="22px"
            />

          </div>


          {/* SIDEBAR ITEMS */}

          <div className="setting-sidebar-skeleton-items">

            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(
              (item) => (

                <div
                  className="setting-sidebar-skeleton-item"
                  key={item}
                >

                  {/* ICON */}

                  <Skeleton
                    width="18px"
                    height="18px"
                    radius="4px"
                  />


                  {/* TEXT */}

                  <Skeleton
                    width={
                      item === 7
                        ? "105px"
                        : item === 8
                        ? "110px"
                        : "90px"
                    }
                    height="15px"
                  />

                </div>

              )
            )}

          </div>


          {/* BOTTOM USER SECTION */}

          <div className="setting-sidebar-skeleton-user">

            <Skeleton
              width="38px"
              height="38px"
              radius="50%"
            />

            <div className="setting-sidebar-skeleton-user-info">

              <Skeleton
                width="90px"
                height="13px"
              />

              <div className="setting-sidebar-user-email">

                <Skeleton
                  width="125px"
                  height="11px"
                />

              </div>

            </div>

          </div>

        </aside>

      ) : (

        <SettingSidebar />

      )}


      {/* ======================================
          SETTINGS CONTENT
          DON'T CHANGE
      ====================================== */}

      <div className="setting-page-content">

        <div className="content-heading">

          <span>
            {currentPage.icon}
          </span>

          <h4>
            {currentPage.title}
          </h4>

        </div>

        <Outlet />

      </div>  

    </div>
  );
};
import "../../components/Setting/SettingSidebar.css"

import { NavLink } from "react-router-dom";
import { Outlet } from "react-router-dom";


import { FaRegUser } from "react-icons/fa";
import { MdOutlineWatchLater } from "react-icons/md";
import { MdNotifications } from "react-icons/md";
import { RiPaletteLine } from "react-icons/ri";
import { FaLock } from "react-icons/fa";
import { GoDatabase } from "react-icons/go";
import { MdOutlineContactSupport } from "react-icons/md";


export const SettingSidebar = () => {

    return (
        <>
            <div className="setting_container">
                <div className="sidebar_container">
                    <div className="logo">
                        <img src="../../public/Time_Wise_Logo_DarkMode.svg" alt="logo" />
                    </div>
                    <div className="settings_name">
                        <p className="settings_heading">SETTINGS</p>
                        <NavLink to="profile" className="setting-profile setting-link">
                            <FaRegUser className="icon" />
                            <span>Profile</span>
                        </NavLink>
                        <NavLink to="attendance" className="attendance setting-link">
                            <MdOutlineWatchLater className="icon" />
                            <span >Attendance</span>
                        </NavLink>
                        <NavLink to="notification" className="notifications setting-link">
                            <MdNotifications className="icon" />
                            <span>Notifications</span>
                        </NavLink>
                        <NavLink to="appearance" className="appearance setting-link">
                            <RiPaletteLine className="icon" />
                            <span >Appearance</span>
                        </NavLink>
                        <NavLink to="security" className="security setting-link">
                            <FaLock className="icon" />
                            <span>Security</span>
                        </NavLink>
                        <NavLink to="data_export" className="dataExport setting-link">
                            <GoDatabase className="icon" />
                            <span>Data & Exoport</span>
                        </NavLink>
                        <NavLink to="help_support" className="helpSupport setting-link">
                            <MdOutlineContactSupport className="icon" />
                            <span>Help & Support</span>
                        </NavLink>
                    </div>
                    <div className="user_profile">
                        <div className="user_img">
                            <img src="../../public/favicon.svg" alt="" />
                        </div>
                        <div className="user_details">
                            <p>Silent Killer</p>
                            <p>email@.com</p>
                        </div>
                    </div>
                </div>
                <div className="content-container">
                    <div className="content-heading">
                        <p>Content icon</p>
                        <p>Content name(Profile)</p>
                    </div>
                    <Outlet/>
                </div>
                
            </div>
        </>
    )
}
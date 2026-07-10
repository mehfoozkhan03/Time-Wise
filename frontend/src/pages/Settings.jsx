import "../App.css"

import { NavLink } from "react-router-dom";
import { Outlet } from "react-router-dom";

import { CiUser } from "react-icons/ci";
import { MdOutlineWatchLater } from "react-icons/md";
import { IoIosNotificationsOutline } from "react-icons/io";
import { RiPaletteLine } from "react-icons/ri";
import { IoLockClosedOutline } from "react-icons/io5";
import { GoDatabase } from "react-icons/go";
import { MdOutlineContactSupport } from "react-icons/md";



export const Settings = () => {


    return (
        <>
            <div className="setting_container">
                <div className="sidebar_container">
                    <div className="logo">
                        <img src="../../public/Time_Wise_Logo_DarkMode.svg" alt="logo" />
                    </div>
                    <div className="settings_name">
                        <p className="settings_heading">SETTINGS</p>
                        <div className="profile">
                            <CiUser className="icon" />
                            <NavLink to="profile">Profile</NavLink>
                        </div>
                        <div className="attendance">
                            <MdOutlineWatchLater className="icon" />
                            <NavLink to="attendance">Attendance</NavLink>
                        </div>
                        <div className="notifications">
                            <IoIosNotificationsOutline className="icon" />
                            <NavLink to="notification">Notifications</NavLink>
                        </div>
                        <div className="appearance">
                            <RiPaletteLine className="icon" />
                            <NavLink to="appearance">Appearance</NavLink>
                        </div>
                        <div className="security">
                            <IoLockClosedOutline className="icon" />
                            <NavLink to="security">Security</NavLink>
                        </div>
                        <div className="dataExport">
                            <GoDatabase className="icon" />
                            <NavLink to="data_export">Data & Exoport</NavLink>
                        </div>
                        <div className="helpSupport">
                            <MdOutlineContactSupport className="icon" />
                            <NavLink to="help_support">Help & Support</NavLink>
                        </div>
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

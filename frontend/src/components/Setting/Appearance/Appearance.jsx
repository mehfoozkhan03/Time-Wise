import "./Appearance.css";


import { MdOutlineLightMode } from "react-icons/md";
import { MdOutlineDarkMode } from "react-icons/md";
import { CiLaptop } from "react-icons/ci";
import { useTheme } from "../../../context/ThemeContext";


export const Appearance = () => {
    const { changeTheme } = useTheme();


    return (
        <>
            <div className="appearance-container">
                <div className="appearance-heading">
                    <h2>Apperance</h2>
                    <p>Customize how the app looks and feels on your devices.</p>
                </div>

                {/* Theme */}
                <div className="theme-container">
                    <div className="theme-heading">
                        <h3>Theme</h3>
                    </div>
                    <div className="theme-mode">
                        <div className="light-mode" onClick={() => changeTheme("light")}>
                            <MdOutlineLightMode className="mode-icon" />
                            <p>Light</p>
                        </div>
                        <div className="dark-mode" onClick={() => changeTheme("dark")}>
                            <MdOutlineDarkMode className="mode-icon" />
                            <p>Dark</p>
                        </div>
                        <div className="system-mode" onClick={() => changeTheme("system")}>
                            <CiLaptop className="mode-icon" />
                            <p>System</p>
                        </div>
                    </div>
                </div>

                {/* Accent color */}
                {/* <div className="accent-color-container">
                    <div className="accent-heading">
                        <h3>Accent color</h3>
                    </div>
                    <div className="accent-color">
                        <div className="blue-violet"></div>
                        <div className="blue"></div>
                        <div className="teal"></div>
                        <div className="rose"></div>
                        <div className="amber"></div>
                    </div>
                </div> */}

                {/* Layout & Localization */}
                <div className="layout-localization">
                    <div className="layout-heading">
                        <h3>Layout & localization</h3>
                    </div>
                    <div className="layout">
                        <div className="display-density">
                            <div>
                                <h3>Dissplay density</h3>
                                <p>Controls padding and element sizing</p>
                            </div>
                            <div className="layout-select">
                                <select>
                                    <option value="compact">Compact</option>
                                    <option value="comfortable" selected>Comfortable</option>
                                    <option value="spacious">Spacious</option>
                                </select>
                            </div>
                        </div>
                        <div className="language">
                            <div>
                                <h3>Language</h3>
                                <p>Interface language</p>
                            </div>
                            <div className="layout-select">
                                <select>
                                    <option value="english">English(US)</option>
                                    <option value="french">French</option>
                                    <option value="german">German</option>
                                </select>
                            </div>
                        </div>
                        <div className="date-format">
                            <div>
                                <h3>Date format</h3>
                                <p>How dates are displayed across the app</p>
                            </div>
                            <div className="layout-select">
                                <select>
                                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                                </select>
                            </div>
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
    )
}
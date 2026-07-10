import { IoMdEye } from "react-icons/io";
import { IoMdEyeOff } from "react-icons/io";
import { IoToggleOutline } from "react-icons/io5";
import { IoToggle } from "react-icons/io5";


import "../../components/Setting/Security.css"


export const Security = () => {

    return(
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
                                <input type="password" placeholder="Enter current password" />
                                <IoMdEye />
                                <IoMdEyeOff />
                            </div>
                        </div>
                        <div className="new-password">
                            <label htmlFor="newpassword">New password</label>
                            <div>
                                <input type="password" placeholder="Enter new password" />
                                <IoMdEye />
                                <IoMdEyeOff />
                            </div>
                        </div>
                        <div className="confirm-new-password">
                            <label htmlFor="currentpassword">Confirm new password</label>
                            <input type="password" placeholder="Repeat new password" />
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
                            <IoToggleOutline />
                            <IoToggle />
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
                            <p>Get notified when your account is accessed from a new device</p>
                        </div>
                        <div>
                            <IoToggleOutline />
                            <IoToggle />
                        </div>
                    </div>
                    <div className="session-timeout">
                        <div>
                            <h3>Session timeout</h3>
                            <p>Automatically log out after inactivity</p>
                        </div>
                        <div className="timeout-selection">
                            <select>
                                <option value="15 minutes">15 minutes</option>
                                <option value="30 minutes">30 minutes</option>
                                <option value="1 hour">1 hour</option>
                                <option value="4 hours">4 hours</option>
                                <option value="Never">Never</option>
                            </select>
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
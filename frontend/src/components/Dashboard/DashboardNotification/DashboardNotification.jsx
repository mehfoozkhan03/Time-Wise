import "./DashboardNotification.css"


import { FaBell, FaCloud } from "react-icons/fa6";
import { RiTargetFill } from "react-icons/ri";
import { MdKeyboardArrowDown } from "react-icons/md";
import { FaHeart } from "react-icons/fa";
import { FaTriangleExclamation } from "react-icons/fa6";

export const DashboardNotification = () => {

    return (
        <>
            <div className="dashboardNotification-container">
                <div className="dashboard-create-notification">
                    <div className="create-notification-header">
                        <h3>Create Notifications</h3>
                        <span>Push to employees or groups</span>
                    </div>
                    <div className="create-notification-content">
                        <div className="create-notification-title">
                            <label htmlFor="notificationtitle">NOTIFICATION TITLE</label>
                            <input type="text" placeholder="Reminder: Submit timesheets" />
                        </div>
                        <div className="create-notification-msg">
                            <label htmlFor="notificationmsg">MESSAGE</label>
                            <textarea rows={5} placeholder="Write your notification message..."></textarea>
                        </div>
                        <div className="create-target-audience">
                            <label htmlFor="targetaudience">TARGET AUDIENCE</label>
                            <div className="audience-selection">
                                <div className="audience-selection-list">
                                    <div>All Employees</div>
                                    <div>Engineering</div>
                                    <div>Design</div>
                                    <div>HR</div>
                                    <div>Analytics</div>
                                    <div>Marketing</div>
                                    <div>Managers Only</div>
                                </div>
                                <MdKeyboardArrowDown />
                            </div>
                        </div>
                        <div className="create-notification-btn">
                            <FaBell style={{color: "#ef9b52"}} />
                            <span>Send Notification</span>
                        </div>
                    </div>
                </div>
                <div className="dashboard-recent-notification">
                    <div className="recent-notification-header">
                        <h3>Recent Notifications</h3>
                        <span>3 unread</span>
                    </div>
                    <div className="recent-notification-content-container">
                        <div className="recent-notification-content">
                            <div className="recent-notification-type">
                                <div className="recent-notification-icon">
                                    <FaHeart style={{color: "#ee2a44"}} />
                                </div>
                                <div className="recent-notification-msg">
                                    <p>Sarah Mitchell liked a thought post</p>
                                    <span>2m ago</span>
                                </div>
                            </div>
                            <div className="recent-notification-active"></div>
                        </div>
                        <div className="recent-notification-content">
                            <div className="recent-notification-type">
                                <div className="recent-notification-icon">
                                    <FaTriangleExclamation style={{color: "#f6be5d"}} />
                                </div>
                                <div className="recent-notification-msg">
                                    <p>3 employees haven't checked in today</p>
                                    <span>10m ago</span>
                                </div>
                            </div>
                            <div className="recent-notification-active"></div>
                        </div>
                        <div className="recent-notification-content">
                            <div className="recent-notification-type">
                                <div className="recent-notification-icon">
                                    <FaBell style={{color: "#ef9b52"}} />
                                </div>
                                <div className="recent-notification-msg">
                                    <p>Monthly attendance report is ready to export</p>
                                    <span>1h ago</span>
                                </div>
                            </div>
                            <div className="recent-notification-active"></div>
                        </div>
                        <div className="recent-notification-content">
                            <div className="recent-notification-type">
                                <div className="recent-notification-icon">
                                    <FaCloud />
                                </div>
                                <div className="recent-notification-msg">
                                    <p>New comment on company announcement</p>
                                    <span>3h ago</span>
                                </div>
                            </div>
                            <div className="recent-notification-active"></div>
                        </div>
                        <div className="recent-notification-content">
                            <div className="recent-notification-type">
                                <div className="recent-notification-icon">
                                    <RiTargetFill style={{color: "#ff6da8"}} />
                                </div>
                                <div className="recent-notification-msg">
                                    <p>Attendance sync completed successfully</p>
                                    <span>Yesterday</span>
                                </div>
                            </div>
                            <div className="recent-notification-active"></div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
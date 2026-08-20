import "./DashboardNotification.css"


import { FaBell, FaCloud } from "react-icons/fa6";
import { RiTargetFill } from "react-icons/ri";
import { MdKeyboardArrowDown } from "react-icons/md";
import { FaHeart } from "react-icons/fa";
import { FaTriangleExclamation } from "react-icons/fa6";

export const DashboardNotification = () => {

    const recentNotification = [
        {
            icon: <FaHeart style={{color: "#ee2a44"}} />,
            notificationTitle: "Sarah Mitchell liked a thought post",
            time: "2m ago"
        },
        {
            icon: <FaTriangleExclamation style={{color: "#f6be5d"}} />,
            notificationTitle: "3 employees haven't checked in today",
            time: "10m ago"
        },
        {
            icon: <FaBell style={{color: "#ef9b52"}} />,
            notificationTitle: "Monthly attendance report is ready to export",
            time: "1h ago"
        },
        {
            icon: <FaCloud />,
            notificationTitle: "New comment on company announcement",
            time: "3h ago"
        },
        {
            icon: <RiTargetFill style={{color: "#ff6da8"}} />,
            notificationTitle: "Attendance sync completed successfully",
            time: "Yesterday"
        },
    ]

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
                        {
                            recentNotification && recentNotification.map((el, id) => (
                                <div className="recent-notification-content" key={id}>
                                    <div className="recent-notification-type">
                                        <div className="recent-notification-icon">
                                            {el.icon}
                                        </div>
                                        <div className="recent-notification-msg">
                                            <p>{el.notificationTitle}</p>
                                            <span>{el.time}</span>
                                        </div>
                                    </div>
                                    <div className="recent-notification-active"></div>
                                </div>

                            ))
                        }
                    </div>
                </div>
            </div>
        </>
    )
}
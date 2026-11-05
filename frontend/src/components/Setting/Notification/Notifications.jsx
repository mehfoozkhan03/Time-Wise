// import { useSelector } from "react-redux";
// import { useState, useEffect } from "react";
// import { SwitchBtn } from "../../SwichBtn/SwitchBtn";
// import "./Notification.css"
// import Skeleton from "../../../components/Skeleton/Skeleton";

// export const Notification = () => {

//     const { user, isLoading } = useSelector((state) => state.auth);
//     const [showSkeleton, setShowSkeleton] = useState(true);


//     useEffect(() => {
//         const timer = setTimeout(() => {
//             setShowSkeleton(false);
//         }, 1500);

//         return () => clearTimeout(timer);
//     }, []);

//     if (showSkeleton) {
//         return (
//             <div className="notification-container">

//                 {/* Heading Skeleton */}
//                 <div className="notification-heading">
//                     <Skeleton width="180px" height="32px" />

//                     <div style={{ marginTop: "10px" }}>
//                         <Skeleton width="400px" height="18px" />
//                     </div>
//                 </div>


//                 {/* Delivery Channels Skeleton */}
//                 <div className="delivery-channels">
//                     <Skeleton width="180px" height="25px" />

//                     <div className="delivery-content">
//                         {[1, 2, 3].map((item) => (
//                             <div
//                                 key={item}
//                                 style={{
//                                     display: "flex",
//                                     justifyContent: "space-between",
//                                     alignItems: "center",
//                                     padding: "15px 0",
//                                 }}
//                             >
//                                 <div>
//                                     <Skeleton width="180px" height="20px" />

//                                     <div style={{ marginTop: "8px" }}>
//                                         <Skeleton width="250px" height="15px" />
//                                     </div>
//                                 </div>

//                                 <Skeleton width="45px" height="25px" radius="20px" />
//                             </div>
//                         ))}
//                     </div>
//                 </div>


//                 {/* Notification Types Skeleton */}
//                 <div className="notification-type-container">
//                     <Skeleton width="200px" height="28px" />

//                     <div className="type-detail">
//                         {[1, 2, 3, 4, 5, 6].map((item) => (
//                             <div
//                                 key={item}
//                                 style={{
//                                     display: "flex",
//                                     justifyContent: "space-between",
//                                     alignItems: "center",
//                                     padding: "15px 0",
//                                 }}
//                             >
//                                 <div>
//                                     <Skeleton width="200px" height="20px" />

//                                     <div style={{ marginTop: "8px" }}>
//                                         <Skeleton width="320px" height="15px" />
//                                     </div>
//                                 </div>

//                                 <Skeleton width="45px" height="25px" radius="20px" />
//                             </div>
//                         ))}
//                     </div>
//                 </div>


//                 {/* Frequency Skeleton */}
//                 <div className="frequency">
//                     <Skeleton width="120px" height="28px" />

//                     <div
//                         style={{
//                             display: "flex",
//                             justifyContent: "space-between",
//                             marginTop: "20px",
//                         }}
//                     >
//                         <div>
//                             <Skeleton width="160px" height="20px" />

//                             <div style={{ marginTop: "8px" }}>
//                                 <Skeleton width="250px" height="15px" />
//                             </div>
//                         </div>

//                         <Skeleton width="150px" height="40px" radius="8px" />
//                     </div>
//                 </div>

//             </div>
//         );
//     }

//     return (
//         <>
//             <div className="notification-container">
//                 <div className="notification-heading">
//                     <h2>Notifications</h2>
//                     <p>Choose what you"re notified about and how you receive alerts.</p>
//                 </div>


//                 {/* Notification channels */}
//                 <div className="delivery-channels">
//                     <div className="delivery-heading">
//                         <h3>Delivery channels</h3>
//                     </div>
//                     <div className="delivery-content">
//                         <div className="email-notification">
//                             <div>
//                                 <h3>Email notifications</h3>
//                                 <p>Sent to {user?.email ?? "No Email"}</p>
//                             </div>
//                             <div>
//                                 <SwitchBtn />
//                             </div>
//                         </div>
//                         <div className="push-notification">
//                             <div>
//                                 <h3>Push notifications</h3>
//                                 <p>Browser and mobile app alerts</p>
//                             </div>
//                             <div>
//                                 <SwitchBtn />
//                             </div>
//                         </div>
//                         <div className="sms-alert">
//                             <div>
//                                 <h3>SMS alerts</h3>
//                                 <p>Text messages to 9262986281</p>
//                             </div>
//                             <div>
//                                 <SwitchBtn />
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Notification types */}
//                 <div className="notification-type-container">
//                     <div className="type-heading">
//                         <h2>Notification types</h2>
//                     </div>
//                     <div className="type-detail">
//                         <div className="checkin-reminder">
//                             <div>
//                                 <h3>Check-in reminder</h3>
//                                 <p>5-minute reminder before your scheduled check-in</p>
//                             </div>
//                             <div>
//                                 <SwitchBtn />
//                             </div>
//                         </div>
//                         <div className="checkout-reminder">
//                             <div>
//                                 <h3>Check-out reminder</h3>
//                                 <p>Alert when your scheduled check-out time approaches</p>
//                             </div>
//                             <div>
//                                 <SwitchBtn />
//                             </div>
//                         </div>
//                         <div className="leave-approval">
//                             <div>
//                                 <h3>Leave approval updates</h3>
//                                 <p>When your leave requests are approved or declined</p>
//                             </div>
//                             <div>
//                                 <SwitchBtn />
//                             </div>
//                         </div>
//                         <div className="payslip-available">
//                             <div>
//                                 <h3>Payslip available</h3>
//                                 <p>When a new payslip is generated for your account</p>
//                             </div>
//                             <div>
//                                 <SwitchBtn />
//                             </div>
//                         </div>
//                         <div className="team-update">
//                             <div>
//                                 <h3>Team updates</h3>
//                                 <p>When teammates change schedules or submit leave requests</p>
//                             </div>
//                             <div>
//                                 <SwitchBtn />
//                             </div>
//                         </div>
//                         <div className="weekly-digest">
//                             <div>
//                                 <h3>Weekly digest</h3>
//                                 <p>Summary of your hours and attendance every Monday</p>
//                             </div>
//                             <div>
//                                 <SwitchBtn />
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




import { useSelector } from "react-redux";
import { useState, useEffect } from "react";

import {
    FaBell,
    FaLayerGroup,
    FaEnvelope,
    FaMobileAlt,
    FaCommentDots,
    FaCalendarAlt,
    FaClock,
    FaSignOutAlt,
    FaFileInvoice,
    FaUsers,
    FaChartBar,
    FaCheck,
} from "react-icons/fa";

import { SwitchBtn } from "../../SwichBtn/SwitchBtn";
import Skeleton from "../../../components/Skeleton/Skeleton";

import "./Notification.css";

export const Notification = () => {

    const { user, isLoading } = useSelector((state) => state.auth);

    const [showSkeleton, setShowSkeleton] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowSkeleton(false);
        }, 1500);

        return () => clearTimeout(timer);
    }, []);

    // =========================
    // SKELETON UI
    // =========================

    if (showSkeleton) {
        return (
            <div className="notification-container notification-skeleton">

                <div className="notification-heading">
                    <Skeleton width="180px" height="32px" />
                    <div style={{ marginTop: "10px" }}>
                        <Skeleton width="400px" height="18px" />
                    </div>
                </div>

                <div className="delivery-channels">
                    <Skeleton width="180px" height="25px" />

                    <div className="delivery-content">
                        {[1, 2, 3].map((item) => (
                            <div className="notification-skeleton-row" key={item}>
                                <div>
                                    <Skeleton width="180px" height="20px" />
                                    <div style={{ marginTop: "8px" }}>
                                        <Skeleton width="250px" height="15px" />
                                    </div>
                                </div>

                                <Skeleton width="45px" height="25px" radius="20px" />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="notification-type-container">
                    <Skeleton width="200px" height="28px" />

                    <div className="type-detail">
                        {[1, 2, 3, 4, 5, 6].map((item) => (
                            <div className="notification-skeleton-row" key={item}>
                                <div>
                                    <Skeleton width="200px" height="20px" />
                                    <div style={{ marginTop: "8px" }}>
                                        <Skeleton width="320px" height="15px" />
                                    </div>
                                </div>

                                <Skeleton width="45px" height="25px" radius="20px" />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="save_changes">
                    <Skeleton width="150px" height="20px" />
                    <Skeleton width="130px" height="40px" radius="8px" />
                </div>

            </div>
        );
    }

    // =========================
    // ORIGINAL UI
    // =========================

    return (
        <div className="notification-container">

            {/* HEADER */}

            <div className="notification-heading">

                <div className="notification-title-icon">
                    <FaBell />
                </div>

                <div>
                    <h2>Notifications</h2>
                    <p>
                        Choose what you're notified about and how you receive alerts.
                    </p>
                </div>

            </div>

            {/* DELIVERY CHANNELS */}

            <div className="delivery-channels">

                <div className="delivery-heading">

                    <div className="notification-section-icon">
                        <FaLayerGroup />
                    </div>

                    <div>
                        <h3>Delivery channels</h3>
                        <p>Choose how you want to receive notifications.</p>
                    </div>

                </div>

                <div className="delivery-content">

                    <div className="notification-setting-row email-notification">

                        <div className="notification-row-icon">
                            <FaEnvelope />
                        </div>

                        <div className="notification-row-content">
                            <h3>Email notifications</h3>
                            <p>Sent to {user?.email ?? "No Email"}</p>
                        </div>

                        <SwitchBtn />

                    </div>

                    <div className="notification-setting-row push-notification">

                        <div className="notification-row-icon">
                            <FaMobileAlt />
                        </div>

                        <div className="notification-row-content">
                            <h3>Push notifications</h3>
                            <p>Browser and mobile app alerts</p>
                        </div>

                        <SwitchBtn />

                    </div>

                    <div className="notification-setting-row sms-alert">

                        <div className="notification-row-icon">
                            <FaCommentDots />
                        </div>

                        <div className="notification-row-content">
                            <h3>SMS alerts</h3>
                            <p>Text messages to {user?.phone ?? "No phone number"}</p>
                        </div>

                        <SwitchBtn />

                    </div>

                </div>
            </div>

            {/* NOTIFICATION TYPES */}

            <div className="notification-type-container">

                <div className="type-heading">

                    <div className="notification-section-icon">
                        <FaBell />
                    </div>

                    <div>
                        <h2>Notification types</h2>
                        <p>Manage the updates and reminders you receive.</p>
                    </div>

                </div>

                <div className="type-detail">

                    {/* ATTENDANCE */}

                    <div className="notification-category">

                        <div className="notification-category-heading">
                            <FaCalendarAlt />
                            <div>
                                <h3>Attendance</h3>
                                <p>Stay updated with your daily attendance.</p>
                            </div>
                        </div>

                        <div className="notification-setting-row checkin-reminder">
                            <div className="notification-row-icon">
                                <FaClock />
                            </div>

                            <div className="notification-row-content">
                                <h3>Check-in reminder</h3>
                                <p>5-minute reminder before your scheduled check-in</p>
                            </div>

                            <SwitchBtn />
                        </div>

                        <div className="notification-setting-row checkout-reminder">
                            <div className="notification-row-icon">
                                <FaSignOutAlt />
                            </div>

                            <div className="notification-row-content">
                                <h3>Check-out reminder</h3>
                                <p>Alert when your scheduled check-out time approaches</p>
                            </div>

                            <SwitchBtn />
                        </div>

                    </div>

                    {/* LEAVE AND PAYROLL */}

                    <div className="notification-category">

                        <div className="notification-category-heading">
                            <FaFileInvoice />
                            <div>
                                <h3>Leave & Payroll</h3>
                                <p>Updates about leave requests and payslips.</p>
                            </div>
                        </div>

                        <div className="notification-setting-row leave-approval">
                            <div className="notification-row-icon">
                                <FaCalendarAlt />
                            </div>

                            <div className="notification-row-content">
                                <h3>Leave approval updates</h3>
                                <p>When your leave requests are approved or declined</p>
                            </div>

                            <SwitchBtn />
                        </div>

                        <div className="notification-setting-row payslip-available">
                            <div className="notification-row-icon">
                                <FaFileInvoice />
                            </div>

                            <div className="notification-row-content">
                                <h3>Payslip available</h3>
                                <p>When a new payslip is generated for your account</p>
                            </div>

                            <SwitchBtn />
                        </div>

                    </div>

                    {/* TEAM UPDATES */}

                    <div className="notification-category">

                        <div className="notification-category-heading">
                            <FaUsers />
                            <div>
                                <h3>Team updates</h3>
                                <p>Stay connected with your team activities.</p>
                            </div>
                        </div>

                        <div className="notification-setting-row team-update">
                            <div className="notification-row-icon">
                                <FaUsers />
                            </div>

                            <div className="notification-row-content">
                                <h3>Team updates</h3>
                                <p>When teammates change schedules or submit leave requests</p>
                            </div>

                            <SwitchBtn />
                        </div>

                        <div className="notification-setting-row weekly-digest">
                            <div className="notification-row-icon">
                                <FaChartBar />
                            </div>

                            <div className="notification-row-content">
                                <h3>Weekly digest</h3>
                                <p>Summary of your hours and attendance every Monday</p>
                            </div>

                            <SwitchBtn />
                        </div>

                    </div>

                </div>
            </div>

            {/* SAVE CHANGES */}

            <div className="save_changes">

                <div className="notification-save-status">

                    <div className="notification-save-icon">
                        <FaCheck />
                    </div>

                    <div>
                        <h3>All changes saved</h3>
                        <p>Your notification preferences are up to date.</p>
                    </div>

                </div>

                <button type="button" className="change-btn">
                    <FaCheck />
                    Save Changes
                </button>

            </div>

        </div>
    );
};

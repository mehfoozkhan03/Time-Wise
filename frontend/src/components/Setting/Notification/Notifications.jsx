import "./Notification.css"
import { SwitchBtn } from "../../SwichBtn/SwitchBtn";

export const Notification = () => {

    return (
        <>
            <div className="notification-container">
                <div className="notification-heading">
                    <h2>Notifications</h2>
                    <p>Choose what you"re notified about and how you receive alerts.</p>
                </div>


                {/* Notification channels */}
                <div className="delivery-channels">
                    <div className="delivery-heading">
                        <h3>Delivery channels</h3>
                    </div>
                    <div className="delivery-content">
                        <div className="email-notification">
                            <div>
                                <h3>Email notifications</h3>
                                <p>Sent to silentkiller@gmail.com</p>
                            </div>
                            <div>
                                <SwitchBtn />
                            </div>
                        </div>
                        <div className="push-notification">
                            <div>
                                <h3>Push notifications</h3>
                                <p>Browser and mobile app alerts</p>
                            </div>
                            <div>
                                <SwitchBtn />
                            </div>
                        </div>
                        <div className="sms-alert">
                            <div>
                                <h3>SMS alerts</h3>
                                <p>Text messages to 9262986281</p>
                            </div>
                            <div>
                                <SwitchBtn />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Notification types */}
                <div className="notification-type-container">
                    <div className="type-heading">
                        <h2>Notification types</h2>
                    </div>
                    <div className="type-detail">
                        <div className="checkin-reminder">
                            <div>
                                <h3>Check-in reminder</h3>
                                <p>5-minute reminder before your scheduled check-in</p>
                            </div>
                            <div>
                                <SwitchBtn />
                            </div>
                        </div>
                        <div className="checkout-reminder">
                            <div>
                                <h3>Check-out reminder</h3>
                                <p>Alert when your scheduled check-out time approaches</p>
                            </div>
                            <div>
                                <SwitchBtn />
                            </div>
                        </div>
                        <div className="leave-approval">
                            <div>
                                <h3>Leave approval updates</h3>
                                <p>When your leave requests are approved or declined</p>
                            </div>
                            <div>
                                <SwitchBtn />
                            </div>
                        </div>
                        <div className="payslip-available">
                            <div>
                                <h3>Payslip available</h3>
                                <p>When a new payslip is generated for your account</p>
                            </div>
                            <div>
                                <SwitchBtn />
                            </div>
                        </div>
                        <div className="team-update">
                            <div>
                                <h3>Team updates</h3>
                                <p>When teammates change schedules or submit leave requests</p>
                            </div>
                            <div>
                                <SwitchBtn />
                            </div>
                        </div>
                        <div className="weekly-digest">
                            <div>
                                <h3>Weekly digest</h3>
                                <p>Summary of your hours and attendance every Monday</p>
                            </div>
                            <div>
                                <SwitchBtn />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Frequency */}
                <div className="frequency">
                    <div className="frequency-heading">
                        <h2>Frequency</h2>
                    </div>
                    <div className="frequency-data">
                        <div>
                            <h3>Alert Frequency</h3>
                            <p>How quickly notifications are delivered</p>
                        </div>
                        <div className="frequency-time">
                            <select>
                                <option value="Immediately">Immediately</option>
                                <option value="Hourly digest">Hourly digest</option>
                                <option value="Daily digest">Daily digest</option>
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
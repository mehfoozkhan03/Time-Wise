import  "./DashboardSetting.css"
import { SwitchBtn } from '../../SwichBtn/SwitchBtn';


export const DashboardSetting = () => {
    return (
        <>
            <div className="dashboardSetting-container">
                <div className="dashboardSetting-header">
                    <h3>Settings</h3>
                    <span>Configure your TimeWise admin preferences</span>
                </div>
                <div className="dashboardSetting-content">
                    <div className="dashboard-company-setting">
                        <h3>Company Settings</h3>
                        <div className="company-setting-details">
                            <div>
                                <label htmlFor="companyName">COMPANY NAME</label>
                                <input type="text" defaultValue="TimeWise Corporation" />
                            </div>
                            <div>
                                <label htmlFor="companyName">TIME ZONE</label>
                                <input type="text" defaultValue="UTC+0 / London" />
                            </div>
                            <div>
                                <label htmlFor="companyName">WORK HOURS START</label>
                                <input type="text" defaultValue="09:00 AM" />
                            </div>
                            <div>
                                <label htmlFor="companyName">WORK HOURS END</label>
                                <input type="text" defaultValue="06:00 PM" />
                            </div>
                            <div>
                                <label htmlFor="companyName">LATE THRESHOLD</label>
                                <input type="text" defaultValue="15 minutes" />
                            </div>
                        </div>
                        <button type="button">Save Settings</button>
                    </div>
                    <div className="dashboard-notification-preference">
                        <h3>Notification Preferences</h3>
                        <div className="notification-preference-content">
                            <div>
                                <p>Email alerts for absences</p>
                                <SwitchBtn className="notification-preference-switch-btn" />
                            </div>
                            <div>
                                <p>Daily attendance summary</p>
                                <SwitchBtn className="notification-preference-switch-btn" />
                            </div>
                            <div>
                                <p>Late check-in alerts</p>
                                <SwitchBtn className="notification-preference-switch-btn" />
                            </div>
                            <div>
                                <p>Thought of Day reminders</p>
                                <SwitchBtn className="notification-preference-switch-btn" />
                            </div>
                            <div>
                                <p>Report generation emails</p>
                                <SwitchBtn className="notification-preference-switch-btn" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
import { useEffect, useState } from "react";
import "./DashboardSetting.css"
import { SwitchBtn } from '../../SwichBtn/SwitchBtn';
import { aiBotAccessService } from "../../../services/aiBotAccessService";


export const DashboardSetting = () => {
    const [botAccess, setBotAccess] = useState(null);
    const [selectedCount, setSelectedCount] = useState(1);
    const [emails, setEmails] = useState([""]);
    const [accessMessage, setAccessMessage] = useState("");
    const [isSavingAccess, setIsSavingAccess] = useState(false);

    useEffect(() => {
        aiBotAccessService.getAdminSettings()
          .then(({ data }) => {
              setBotAccess(data.settings);
              if (data.settings.mode === "disabled_selected") {
                  setSelectedCount(data.settings.blockedEmails.length || 1);
                  setEmails(data.settings.blockedEmails.length ? data.settings.blockedEmails : [""]);
              }
          })
          .catch(() => setAccessMessage("Unable to load WiseBot access settings."));
    }, []);

    const disableForSelected = () => {
        setBotAccess((current) => ({ ...current, mode: "disabled_selected" }));
        setSelectedCount(1);
        setEmails([""]);
        setAccessMessage("");
    };

    const setCount = (value) => {
        const count = Math.max(1, Math.min(100, Number(value) || 1));
        setSelectedCount(count);
        setEmails((current) => Array.from({ length: count }, (_, index) => current[index] || ""));
    };

    const saveAccess = async () => {
        if (!botAccess) return;
        setIsSavingAccess(true);
        setAccessMessage("");
        try {
            const payload = {
                mode: botAccess.mode,
                blockedCount: botAccess.mode === "disabled_selected" ? selectedCount : 0,
                blockedEmails: botAccess.mode === "disabled_selected" ? emails : [],
            };
            const { data } = await aiBotAccessService.updateAdminSettings(payload);
            setBotAccess(data.settings);
            setAccessMessage("WiseBot access saved.");
        } catch (error) {
            setAccessMessage(error.response?.data?.message || "Unable to save WiseBot access.");
        } finally {
            setIsSavingAccess(false);
        }
    };

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
                    <div className="dashboard-ai-access">
                        <h3>WiseBot Access</h3>
                        {!botAccess ? <p>Loading WiseBot access...</p> : <>
                            <div className="ai-access-row">
                                <span>Enable WiseBot</span>
                                <div className="ai-access-switch">
                                    <SwitchBtn
                                        checked={botAccess.mode === "enabled"}
                                        onChange={(isEnabled) => setBotAccess((current) => ({ ...current, mode: isEnabled ? "enabled" : "disabled_all" }))}
                                        ariaLabel="Enable WiseBot"
                                    />
                                    <span>{botAccess.mode === "enabled" ? "Enabled" : "Disabled"}</span>
                                </div>
                            </div>

                            {botAccess.mode !== "enabled" && <div className="ai-access-options">
                                <p>Who should be blocked from using WiseBot?</p>
                                <label><input type="radio" checked={botAccess.mode === "disabled_all"} onChange={() => setBotAccess((current) => ({ ...current, mode: "disabled_all" }))} /> Full organisation</label>
                                <label><input type="radio" checked={botAccess.mode === "disabled_selected"} onChange={disableForSelected} /> Custom employees</label>

                                {botAccess.mode === "disabled_selected" && <div className="ai-email-fields">
                                    <label>HOW MANY EMPLOYEES DO YOU WANT TO BLOCK?
                                        <input type="number" min="1" max="100" value={selectedCount} onChange={(event) => setCount(event.target.value)} />
                                    </label>
                                    <p>Enter each employee's unique registered email address.</p>
                                    {emails.map((email, index) => <input key={index} type="email" value={email} placeholder={`Employee ${index + 1} email`} onChange={(event) => setEmails((current) => current.map((item, itemIndex) => itemIndex === index ? event.target.value : item))} />)}
                                </div>}
                            </div>}
                            {accessMessage && <p className="ai-access-message">{accessMessage}</p>}
                            <button type="button" onClick={saveAccess} disabled={isSavingAccess}>{isSavingAccess ? "Saving..." : "Save WiseBot Access"}</button>
                        </>}
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

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  FaBell,
  FaEnvelope,
  FaMobileAlt,
  FaCheck,
  FaRedo,
  FaMoon,
  FaExclamationTriangle,
  FaShieldAlt,
  FaBullhorn,
  FaRegClock,
} from "react-icons/fa";
import {
  MdOutlineWatchLater,
  MdEventAvailable,
  MdOutlineNotificationsActive,
} from "react-icons/md";

import { SwitchBtn } from "../../SwichBtn/SwitchBtn";
import Skeleton from "../../../components/Skeleton/Skeleton";
import {
  getNotificationPreferences,
  saveNotificationPreferences,
} from "../../../services/notificationPreferenceService";
import { cacheNotificationPreferences } from "../../../utils/notificationPreferences";
import "./Notification.css";

const defaultPreferences = {
  // Master quiet mode
  quietMode: false,

  // Channels
  emailNotifications: true,
  emailFrequency: "instant", // "instant" | "daily" | "weekly"
  pushNotifications: true,
  soundAlerts: true,
  inAppAlerts: true,
  inAppBadge: true,

  // Attendance & Shifts
  checkInReminder: true,
  checkInLeadTime: "10m", // "5m" | "10m" | "15m"
  checkOutReminder: true,
  breakTimeAlerts: true,
  overtimeAlerts: true,

  // Leave & Holidays
  leaveStatusUpdates: true,
  holidayReminders: true,
  quotaUpdates: false,

  // Company & Community
  companyAnnouncements: true,
  dailyThoughts: true,
  birthdayCelebrations: true,

  // Security & System
  securityLogins: true,
  profileChanges: true,
  monthlyTimesheet: true,

  // Quiet Hours Schedule
  quietHoursEnabled: true,
  quietHoursStart: "22:00",
  quietHoursEnd: "08:00",
  muteWeekends: true,
};

export const Notification = () => {
  const { user } = useSelector((state) => state.auth);
  const [showSkeleton, setShowSkeleton] = useState(true);

  // Notification preferences state
  const [preferences, setPreferences] = useState(() => {
    return defaultPreferences;
  });

  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // Load preferences from the signed-in employee's account.
  useEffect(() => {
    let active = true;
    getNotificationPreferences()
      .then(({ data }) => {
        if (!active) return;
        const savedPreferences = { ...defaultPreferences, ...data.preferences };
        setPreferences(savedPreferences);
        cacheNotificationPreferences(user?._id, savedPreferences);
      })
      .catch((error) => {
        console.error("Failed to load notification preferences", error);
      })
      .finally(() => {
        if (active) setShowSkeleton(false);
      });

    return () => {
      active = false;
    };
  }, [user?._id]);

  // Update a single setting
  const updateSetting = (key, value) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: value,
    }));
    setIsDirty(true);
  };

  const updatePushSetting = async (enabled) => {
    if (enabled && !("Notification" in window)) {
      updateSetting("pushNotifications", false);
      window.alert("This browser does not support desktop notifications.");
      return;
    }
    if (enabled && "Notification" in window) {
      const permission = Notification.permission === "default"
        ? await Notification.requestPermission()
        : Notification.permission;
      if (permission !== "granted") {
        updateSetting("pushNotifications", false);
        window.alert("Allow browser notifications to receive desktop alerts.");
        return;
      }
    }
    updateSetting("pushNotifications", enabled);
  };

  const requestDesktopPermission = async () => {
    if (!("Notification" in window)) {
      window.alert("This browser does not support desktop notifications.");
      return;
    }
    const permission = Notification.permission === "default"
      ? await Notification.requestPermission()
      : Notification.permission;
    if (permission === "granted") {
      updateSetting("pushNotifications", true);
    } else {
      updateSetting("pushNotifications", false);
      window.alert("Allow browser notifications in your browser settings to receive desktop alerts.");
    }
  };

  // Toggle master quiet mode
  const toggleQuietMode = (checked) => {
    updateSetting("quietMode", checked);
  };

  // Save preferences
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { data } = await saveNotificationPreferences(preferences);
      const savedPreferences = { ...defaultPreferences, ...data.preferences };
      setPreferences(savedPreferences);
      cacheNotificationPreferences(user?._id, savedPreferences);
      setIsDirty(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (e) {
      console.error("Failed to save notification preferences", e);
      setShowToast(false);
      window.alert(e.response?.data?.message || "Could not save notification preferences. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // Reset to defaults
  const handleReset = () => {
    setPreferences(defaultPreferences);
    setIsDirty(true);
  };

  // =========================
  // SKELETON LOADER
  // =========================
  if (showSkeleton) {
    return (
      <div className="notification-container">
        {/* Header Skeleton */}
        <div className="notification-header">
          <div className="notification-header-left">
            <Skeleton width="160px" height="14px" radius="4px" />
            <div style={{ margin: "6px 0" }}>
              <Skeleton width="260px" height="28px" radius="6px" />
            </div>
            <Skeleton width="420px" height="15px" radius="4px" />
          </div>
          <Skeleton width="220px" height="72px" radius="14px" />
        </div>

        {/* Delivery Channels Skeleton */}
        <div className="notification-section">
          <Skeleton width="180px" height="22px" radius="6px" />
          <div className="notification-channels-grid">
            {[1, 2, 3].map((i) => (
              <div key={i} className="notification-channel-card">
                <div className="channel-card-top">
                  <Skeleton width="46px" height="46px" radius="12px" />
                  <Skeleton width="38px" height="20px" radius="20px" />
                </div>
                <div className="channel-card-body">
                  <Skeleton width="140px" height="18px" radius="4px" />
                  <div style={{ marginTop: "8px" }}>
                    <Skeleton width="100%" height="14px" radius="4px" />
                  </div>
                </div>
                <div className="channel-card-footer">
                  <Skeleton width="180px" height="14px" radius="4px" />
                  <Skeleton width="100%" height="30px" radius="8px" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Categories Grid Skeleton */}
        <div className="notification-categories-grid">
          {[1, 2, 3, 4].map((cat) => (
            <div key={cat} className="notification-category-card">
              <div className="notification-category-header">
                <div className="category-header-title">
                  <Skeleton width="42px" height="42px" radius="11px" />
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <Skeleton width="180px" height="18px" radius="4px" />
                    <Skeleton width="220px" height="13px" radius="4px" />
                  </div>
                </div>
              </div>

              <div className="category-items-list">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="notification-item-row">
                    <div className="notification-item-left">
                      <Skeleton width="160px" height="16px" radius="4px" />
                      <div style={{ marginTop: "6px" }}>
                        <Skeleton width="240px" height="12px" radius="4px" />
                      </div>
                    </div>
                    <Skeleton width="38px" height="20px" radius="20px" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Schedule Card Skeleton */}
        <div className="notification-schedule-card">
          <div className="schedule-card-top">
            <div className="schedule-card-title">
              <Skeleton width="44px" height="44px" radius="12px" />
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <Skeleton width="200px" height="18px" radius="4px" />
                <Skeleton width="300px" height="14px" radius="4px" />
              </div>
            </div>
            <Skeleton width="38px" height="20px" radius="20px" />
          </div>
          <div className="schedule-settings-grid">
            <Skeleton width="100%" height="60px" radius="10px" />
            <Skeleton width="100%" height="60px" radius="10px" />
            <Skeleton width="100%" height="60px" radius="10px" />
          </div>
        </div>

        {/* Bottom Save Bar Skeleton */}
        <div className="notification-bottom-bar">
          <div className="notification-save-status">
            <Skeleton width="40px" height="40px" radius="50%" />
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <Skeleton width="140px" height="16px" radius="4px" />
              <Skeleton width="200px" height="12px" radius="4px" />
            </div>
          </div>
          <div className="notification-bottom-actions">
            <Skeleton width="130px" height="42px" radius="9px" />
            <Skeleton width="150px" height="42px" radius="9px" />
          </div>
        </div>
      </div>
    );
  }

  // =========================
  // MAIN UI
  // =========================
  return (
    <div className="notification-container">
      {/* ===================================================
          1. HEADER BANNER WITH QUICK DND MODE
          =================================================== */}
      <div className="notification-header">
        <div className="notification-header-left">
          <div className="notification-tag">
            <MdOutlineNotificationsActive />
            <span>NOTIFICATION PREFERENCES</span>
          </div>

          <h2>Notification Settings</h2>

          <p>
            Choose how, when, and where you want to receive alerts and updates
            across TimeWise.
          </p>
        </div>

        {/* Quiet Mode Card */}
        <div
          className={`notification-quiet-card ${
            preferences.quietMode ? "active" : ""
          }`}
        >
          <div className="notification-quiet-icon">
            <FaMoon />
          </div>

          <div className="notification-quiet-info">
            <h4>Quiet Mode</h4>
            <p>
              {preferences.quietMode
                ? "All non-critical alerts paused"
                : "Mute all push & sound alerts"}
            </p>
          </div>

          <SwitchBtn
            checked={preferences.quietMode}
            onChange={(checked) => toggleQuietMode(checked)}
            ariaLabel="Toggle Quiet Mode"
          />
        </div>
      </div>

      {/* Alert Banner when Quiet Mode is active */}
      {preferences.quietMode && (
        <div className="notification-quiet-banner">
          <FaExclamationTriangle />
          <span>
            Quiet Mode is currently active. You will only receive critical
            security warnings until Quiet Mode is disabled.
          </span>
        </div>
      )}

      {/* ===================================================
          2. DELIVERY CHANNELS GRID
          =================================================== */}
      <div className="notification-section">
        <h3 className="notification-section-title">
          Delivery Channels
          <span className="count-pill">3 Channels</span>
        </h3>

        <div className="notification-channels-grid">
          {/* Channel 1: Email */}
          <div className="notification-channel-card">
            <div className="channel-card-top">
              <div className="channel-icon-badge">
                <FaEnvelope />
              </div>
              <SwitchBtn
                checked={preferences.emailNotifications}
                onChange={(checked) =>
                  updateSetting("emailNotifications", checked)
                }
                ariaLabel="Toggle Email Notifications"
              />
            </div>

            <div className="channel-card-body">
              <h3>Email Notifications</h3>
              <p>
                Receive TimeWise alerts by email. Frequency controls when the
                digest is delivered.
              </p>
            </div>

            <div className="channel-card-footer">
              <div className="channel-info-pill">
                <span>Destination:</span>
                <strong>{user?.email || "user@timewise.com"}</strong>
              </div>

              {preferences.emailNotifications && (
                <div className="channel-frequency-pills">
                  <button
                    type="button"
                    className={`frequency-pill ${
                      preferences.emailFrequency === "instant" ? "active" : ""
                    }`}
                    onClick={() => updateSetting("emailFrequency", "instant")}
                  >
                    Instant
                  </button>
                  <button
                    type="button"
                    className={`frequency-pill ${
                      preferences.emailFrequency === "daily" ? "active" : ""
                    }`}
                    onClick={() => updateSetting("emailFrequency", "daily")}
                  >
                    Daily Digest
                  </button>
                  <button
                    type="button"
                    className={`frequency-pill ${
                      preferences.emailFrequency === "weekly" ? "active" : ""
                    }`}
                    onClick={() => updateSetting("emailFrequency", "weekly")}
                  >
                    Weekly Summary
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Channel 2: Push Notifications */}
          <div className="notification-channel-card">
            <div className="channel-card-top">
              <div className="channel-icon-badge">
                <FaBell />
              </div>
              <SwitchBtn
                checked={preferences.pushNotifications}
                onChange={updatePushSetting}
                disabled={preferences.quietMode}
                ariaLabel="Toggle Push Notifications"
              />
            </div>

            <div className="channel-card-body">
              <h3>Desktop Browser Alerts</h3>
              <p>
                Desktop alerts while TimeWise is open, including scheduled
                reminders and urgent team updates.
              </p>
            </div>

            <div className="channel-card-footer">
              <div className="channel-info-pill">
                <span>Status:</span>
                <strong>
                  {preferences.pushNotifications
                    ? "Enabled while TimeWise is open"
                    : "Muted"}
                </strong>
              </div>
              {preferences.pushNotifications && "Notification" in window && Notification.permission !== "granted" && (
                <button type="button" className="frequency-pill" onClick={requestDesktopPermission}>
                  Allow desktop alerts
                </button>
              )}

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: "4px",
                }}
              >
                <span
                  style={{
                    fontSize: "12px",
                    color: "var(--text_secondary)",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <FaMobileAlt /> Sound chime
                </span>
                <SwitchBtn
                  checked={preferences.soundAlerts}
                  onChange={(checked) =>
                    updateSetting("soundAlerts", checked)
                  }
                  disabled={!preferences.pushNotifications || preferences.quietMode}
                  ariaLabel="Toggle Sound Chime"
                />
              </div>
            </div>
          </div>

          {/* Channel 3: In-App Activity & Badges */}
          <div className="notification-channel-card">
            <div className="channel-card-top">
              <div className="channel-icon-badge">
                <MdOutlineNotificationsActive />
              </div>
              <SwitchBtn
                checked={preferences.inAppAlerts}
                onChange={(checked) =>
                  updateSetting("inAppAlerts", checked)
                }
                ariaLabel="Toggle In-App Alerts"
              />
            </div>

            <div className="channel-card-body">
              <h3>In-App Banners & Badges</h3>
              <p>
                Floating status toasts while working in TimeWise, plus red
                badge counter on the top bell icon.
              </p>
            </div>

            <div className="channel-card-footer">
              <div className="channel-info-pill">
                <span>Header Indicator:</span>
                <strong>
                  {preferences.inAppBadge ? "Badge Counter Enabled" : "Disabled"}
                </strong>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: "4px",
                }}
              >
                <span
                  style={{
                    fontSize: "12px",
                    color: "var(--text_secondary)",
                  }}
                >
                  Show unread count badge
                </span>
                <SwitchBtn
                  checked={preferences.inAppBadge}
                  onChange={(checked) =>
                    updateSetting("inAppBadge", checked)
                  }
                  disabled={!preferences.inAppAlerts}
                  ariaLabel="Toggle Unread Count Badge"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===================================================
          3. CATEGORIES OF NOTIFICATIONS (2x2 GRID)
          =================================================== */}
      <div className="notification-section">
        <h3 className="notification-section-title">
          Alert Preferences by Category
          <span className="count-pill">4 Categories</span>
        </h3>

        <div className="notification-categories-grid">
          {/* Category 1: Shifts & Attendance */}
          <div className="notification-category-card">
            <div className="notification-category-header">
              <div className="category-header-title">
                <div className="category-icon-box">
                  <MdOutlineWatchLater />
                </div>
                <div>
                  <h3>Attendance & Shifts</h3>
                  <p>Daily shift check-ins, breaks, and hour milestones</p>
                </div>
              </div>
            </div>

            <div className="category-items-list">
              {/* Item 1 */}
              <div className="notification-item-row">
                <div className="notification-item-left">
                  <h4>Shift Check-In Reminder</h4>
                  <p>
                    Get a gentle reminder before your scheduled work shift
                    begins.
                  </p>
                  {preferences.checkInReminder && (
                    <div className="sub-lead-pills">
                      <button
                        type="button"
                        className={`sub-lead-pill ${
                          preferences.checkInLeadTime === "5m" ? "active" : ""
                        }`}
                        onClick={() =>
                          updateSetting("checkInLeadTime", "5m")
                        }
                      >
                        5 min before
                      </button>
                      <button
                        type="button"
                        className={`sub-lead-pill ${
                          preferences.checkInLeadTime === "10m" ? "active" : ""
                        }`}
                        onClick={() =>
                          updateSetting("checkInLeadTime", "10m")
                        }
                      >
                        10 min before
                      </button>
                      <button
                        type="button"
                        className={`sub-lead-pill ${
                          preferences.checkInLeadTime === "15m" ? "active" : ""
                        }`}
                        onClick={() =>
                          updateSetting("checkInLeadTime", "15m")
                        }
                      >
                        15 min before
                      </button>
                    </div>
                  )}
                </div>
                <div className="notification-item-right">
                  <SwitchBtn
                    checked={preferences.checkInReminder}
                    onChange={(checked) =>
                      updateSetting("checkInReminder", checked)
                    }
                    ariaLabel="Toggle Check-In Reminder"
                  />
                </div>
              </div>

              {/* Item 2 */}
              <div className="notification-item-row">
                <div className="notification-item-left">
                  <h4>Shift Check-Out Alert</h4>
                  <p>
                    Notification when your 8-hour target is reached or shift
                    ends.
                  </p>
                </div>
                <div className="notification-item-right">
                  <SwitchBtn
                    checked={preferences.checkOutReminder}
                    onChange={(checked) =>
                      updateSetting("checkOutReminder", checked)
                    }
                    ariaLabel="Toggle Check-Out Alert"
                  />
                </div>
              </div>

              {/* Item 3 */}
              <div className="notification-item-row">
                <div className="notification-item-left">
                  <h4>Break Duration Notice</h4>
                  <p>
                    Alerts when you approach your maximum allowed break time.
                  </p>
                </div>
                <div className="notification-item-right">
                  <SwitchBtn
                    checked={preferences.breakTimeAlerts}
                    onChange={(checked) =>
                      updateSetting("breakTimeAlerts", checked)
                    }
                    ariaLabel="Toggle Break Duration Notice"
                  />
                </div>
              </div>

              {/* Item 4 */}
              <div className="notification-item-row">
                <div className="notification-item-left">
                  <h4>Overtime & Threshold Alerts</h4>
                  <p>
                    Confirmation whenever tracked hours qualify as billable
                    overtime.
                  </p>
                </div>
                <div className="notification-item-right">
                  <SwitchBtn
                    checked={preferences.overtimeAlerts}
                    onChange={(checked) =>
                      updateSetting("overtimeAlerts", checked)
                    }
                    ariaLabel="Toggle Overtime Alerts"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Category 2: Leaves & Holidays */}
          <div className="notification-category-card">
            <div className="notification-category-header">
              <div className="category-header-title">
                <div className="category-icon-box">
                  <MdEventAvailable />
                </div>
                <div>
                  <h3>Leave & Holidays</h3>
                  <p>Time-off approvals, holidays, and quota balances</p>
                </div>
              </div>
            </div>

            <div className="category-items-list">
              {/* Item 1 */}
              <div className="notification-item-row">
                <div className="notification-item-left">
                  <h4>Leave Request Updates</h4>
                  <p>
                    Instant alert when your manager approves, rejects, or adds
                    notes to your leave request.
                  </p>
                </div>
                <div className="notification-item-right">
                  <SwitchBtn
                    checked={preferences.leaveStatusUpdates}
                    onChange={(checked) =>
                      updateSetting("leaveStatusUpdates", checked)
                    }
                    ariaLabel="Toggle Leave Request Updates"
                  />
                </div>
              </div>

              {/* Item 2 */}
              <div className="notification-item-row">
                <div className="notification-item-left">
                  <h4>Upcoming Company Holidays</h4>
                  <p>
                    Advance reminders 2 days before recognized public and
                    company holidays.
                  </p>
                </div>
                <div className="notification-item-right">
                  <SwitchBtn
                    checked={preferences.holidayReminders}
                    onChange={(checked) =>
                      updateSetting("holidayReminders", checked)
                    }
                    ariaLabel="Toggle Holiday Reminders"
                  />
                </div>
              </div>

              {/* Item 3 */}
              <div className="notification-item-row">
                <div className="notification-item-left">
                  <h4>Leave Quota Balance Notice</h4>
                  <p>
                    Monthly balance summary of available sick, casual, and
                    earned leaves.
                  </p>
                </div>
                <div className="notification-item-right">
                  <SwitchBtn
                    checked={preferences.quotaUpdates}
                    onChange={(checked) =>
                      updateSetting("quotaUpdates", checked)
                    }
                    ariaLabel="Toggle Leave Quota Notice"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Category 3: Announcements & Community */}
          <div className="notification-category-card">
            <div className="notification-category-header">
              <div className="category-header-title">
                <div className="category-icon-box">
                  <FaBullhorn />
                </div>
                <div>
                  <h3>Company & Community</h3>
                  <p>Official memos, team celebrations, and thoughts</p>
                </div>
              </div>
            </div>

            <div className="category-items-list">
              {/* Item 1 */}
              <div className="notification-item-row">
                <div className="notification-item-left">
                  <h4>Company Announcements</h4>
                  <p>
                    Official broadcast memos, town hall updates, and leadership
                    announcements.
                  </p>
                </div>
                <div className="notification-item-right">
                  <SwitchBtn
                    checked={preferences.companyAnnouncements}
                    onChange={(checked) =>
                      updateSetting("companyAnnouncements", checked)
                    }
                    ariaLabel="Toggle Company Announcements"
                  />
                </div>
              </div>

              {/* Item 2 */}
              <div className="notification-item-row">
                <div className="notification-item-left">
                  <h4>Daily Thought of the Day</h4>
                  <p>
                    Morning inspirational quotes and featured thoughts from
                    colleagues.
                  </p>
                </div>
                <div className="notification-item-right">
                  <SwitchBtn
                    checked={preferences.dailyThoughts}
                    onChange={(checked) =>
                      updateSetting("dailyThoughts", checked)
                    }
                    ariaLabel="Toggle Daily Thought"
                  />
                </div>
              </div>

              {/* Item 3 */}
              <div className="notification-item-row">
                <div className="notification-item-left">
                  <h4>Celebrations & Anniversaries</h4>
                  <p>
                    Friendly reminders for teammate birthdays and work
                    anniversaries.
                  </p>
                </div>
                <div className="notification-item-right">
                  <SwitchBtn
                    checked={preferences.birthdayCelebrations}
                    onChange={(checked) =>
                      updateSetting("birthdayCelebrations", checked)
                    }
                    ariaLabel="Toggle Celebrations & Anniversaries"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Category 4: Security & Account */}
          <div className="notification-category-card">
            <div className="notification-category-header">
              <div className="category-header-title">
                <div className="category-icon-box">
                  <FaShieldAlt />
                </div>
                <div>
                  <h3>Security & Reports</h3>
                  <p>Account security, password changes, and monthly reports</p>
                </div>
              </div>
            </div>

            <div className="category-items-list">
              {/* Item 1 */}
              <div className="notification-item-row">
                <div className="notification-item-left">
                  <h4>New Device Sign-In Alerts</h4>
                  <p>
                    Immediate security alert whenever your account is accessed
                    from a new browser or IP.
                  </p>
                </div>
                <div className="notification-item-right">
                  <SwitchBtn
                    checked={preferences.securityLogins}
                    onChange={(checked) =>
                      updateSetting("securityLogins", checked)
                    }
                    ariaLabel="Toggle Security Sign-In Alerts"
                  />
                </div>
              </div>

              {/* Item 2 */}
              <div className="notification-item-row">
                <div className="notification-item-left">
                  <h4>Password & Profile Changes</h4>
                  <p>
                    Confirmation notice when passwords, emails, or personal
                    information are updated.
                  </p>
                </div>
                <div className="notification-item-right">
                  <SwitchBtn
                    checked={preferences.profileChanges}
                    onChange={(checked) =>
                      updateSetting("profileChanges", checked)
                    }
                    ariaLabel="Toggle Profile Changes"
                  />
                </div>
              </div>

              {/* Item 3 */}
              <div className="notification-item-row">
                <div className="notification-item-left">
                  <h4>Monthly Timesheet Statement</h4>
                  <p>
                    Notice at the end of each month when your full attendance
                    report is compiled.
                  </p>
                </div>
                <div className="notification-item-right">
                  <SwitchBtn
                    checked={preferences.monthlyTimesheet}
                    onChange={(checked) =>
                      updateSetting("monthlyTimesheet", checked)
                    }
                    ariaLabel="Toggle Monthly Timesheet"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===================================================
          4. QUIET HOURS & SCHEDULE CARD
          =================================================== */}
      <div className="notification-schedule-card">
        <div className="schedule-card-top">
          <div className="schedule-card-title">
            <div className="schedule-icon-badge">
              <FaMoon />
            </div>
            <div>
              <h3>Scheduled Quiet Hours</h3>
              <p>
                Automatically suppress notifications and sound chimes outside
                of your core working hours.
              </p>
            </div>
          </div>
          <SwitchBtn
            checked={preferences.quietHoursEnabled}
            onChange={(checked) =>
              updateSetting("quietHoursEnabled", checked)
            }
            ariaLabel="Toggle Scheduled Quiet Hours"
          />
        </div>

        {preferences.quietHoursEnabled && (
          <div className="schedule-settings-grid">
            {/* Start Time */}
            <div className="schedule-input-box">
              <label htmlFor="quiet-start">Quiet Hours Start</label>
              <select
                id="quiet-start"
                className="schedule-select"
                value={preferences.quietHoursStart}
                onChange={(e) =>
                  updateSetting("quietHoursStart", e.target.value)
                }
              >
                <option value="20:00">08:00 PM</option>
                <option value="21:00">09:00 PM</option>
                <option value="22:00">10:00 PM (Recommended)</option>
                <option value="23:00">11:00 PM</option>
                <option value="00:00">12:00 AM</option>
              </select>
            </div>

            {/* End Time */}
            <div className="schedule-input-box">
              <label htmlFor="quiet-end">Quiet Hours End</label>
              <select
                id="quiet-end"
                className="schedule-select"
                value={preferences.quietHoursEnd}
                onChange={(e) =>
                  updateSetting("quietHoursEnd", e.target.value)
                }
              >
                <option value="06:00">06:00 AM</option>
                <option value="07:00">07:00 AM</option>
                <option value="08:00">08:00 AM (Recommended)</option>
                <option value="09:00">09:00 AM</option>
                <option value="10:00">10:00 AM</option>
              </select>
            </div>

            {/* Weekend Toggle */}
            <div className="schedule-weekend-toggle">
              <span>Mute notifications on weekends</span>
              <SwitchBtn
                checked={preferences.muteWeekends}
                onChange={(checked) =>
                  updateSetting("muteWeekends", checked)
                }
                ariaLabel="Toggle Weekend Mute"
              />
            </div>
          </div>
        )}
      </div>

      {/* ===================================================
          5. BOTTOM SAVE ACTION BAR
          =================================================== */}
      <div className="notification-bottom-bar">
        <div className="notification-save-status">
          <div
            className={`notification-status-icon ${
              isDirty ? "dirty" : ""
            }`}
          >
            {isDirty ? <FaRegClock /> : <FaCheck />}
          </div>

          <div>
            <h4>
              {isDirty ? "Unsaved changes" : "All changes saved"}
            </h4>
            <p>
              {isDirty
                ? "You have modified your alert preferences."
                : "Your notification settings are up to date."}
            </p>
          </div>
        </div>

        <div className="notification-bottom-actions">
          <button
            type="button"
            className="notification-reset-btn"
            onClick={handleReset}
            disabled={!isDirty || isSaving}
          >
            <FaRedo />
            Reset Defaults
          </button>

          <span className="notification-action-divider" />

          <button
            type="button"
            className="notification-save-btn"
            onClick={handleSave}
            disabled={!isDirty || isSaving}
          >
            <FaCheck />
            {isSaving ? "Saving..." : "Save Preferences"}
          </button>
        </div>
      </div>

      {/* Toast popup */}
      {showToast && (
        <div className="notification-toast">
          <FaCheck style={{ color: "#10b981", fontSize: "16px" }} />
          <span>Notification preferences saved successfully!</span>
        </div>
      )}
    </div>
  );
};

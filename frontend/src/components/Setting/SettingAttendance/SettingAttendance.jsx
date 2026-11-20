import { useEffect, useState } from "react";
import {
  FaCalendarAlt,
  FaClock,
  FaCoffee,
  FaBolt,
  FaBell,
  FaRegClock,
  FaSignOutAlt,
  FaCheck,
  FaUndo,
} from "react-icons/fa";

import "./SettingAttendance.css";
import Skeleton from "../../../components/Skeleton/Skeleton";

const initialSettings = {
  checkIn: "10:00",
  checkOut: "18:00",
  breakStart: "13:00",
  breakEnd: "13:30",
  workDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
  overtimeAlerts: true,
  lateAlerts: true,
  earlyCheckoutAlerts: false,
};

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export const SettingAttendance = () => {
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [settings, setSettings] = useState(initialSettings);
  const [saved, setSaved] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSkeleton(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const updateSetting = (name, value) => {
    setSettings((prev) => ({
      ...prev,
      [name]: value,
    }));

    setSaved(false);
  };

  const toggleDay = (day) => {
    setSettings((prev) => ({
      ...prev,
      workDays: prev.workDays.includes(day)
        ? prev.workDays.filter((item) => item !== day)
        : [...prev.workDays, day],
    }));

    setSaved(false);
  };

  const toggleAlert = (name) => {
    updateSetting(name, !settings[name]);
  };

  const formatTime = (time) => {
    if (!time) return "--:--";

    const [hours, minutes] = time.split(":");
    const date = new Date();

    date.setHours(Number(hours), Number(minutes));

    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleReset = () => {
    setSettings({ ...initialSettings });
    setSaved(false);
  };

  const handleSave = () => {
    // Connect your backend save API here.
    setSaved(true);
  };

  // ================= SKELETON =================

  if (showSkeleton) {
    return (
      <div className="attendance-container attendance-loading">
        <Skeleton width="250px" height="30px" />

        <div className="attendance-summary">
          {[1, 2, 3, 4].map((item) => (
            <Skeleton key={item} height="130px" radius="14px" />
          ))}
        </div>

        <div className="attendance-content-grid">
          <Skeleton height="500px" radius="15px" />
          <Skeleton height="500px" radius="15px" />
        </div>

        <Skeleton height="85px" radius="14px" />
      </div>
    );
  }

  return (
    <div className="attendance-container">

      {/* ================= HEADER ================= */}

      <div className="attendance-heading">
        <div className="attendance-heading-left">
          <div className="attendance-main-icon">
            <FaCalendarAlt />
          </div>

          <div>
            <h2>Attendance Settings</h2>
            <p>
              Configure your work schedule, check-in times, and attendance rules.
            </p>
          </div>
        </div>

        <div className="attendance-active-badge">
          <span></span>
          Active
        </div>
      </div>

      {/* ================= SUMMARY CARDS ================= */}

      <div className="attendance-summary">

        <div className="attendance-summary-card checkin-card">
          <div className="summary-icon purple-icon">
            <FaClock />
          </div>

          <div className="summary-content">
            <p>Check-in Time</p>
            <h3>{formatTime(settings.checkIn)}</h3>
          </div>
        </div>

        <div className="attendance-summary-card checkout-card">
          <div className="summary-icon blue-icon">
            <FaRegClock />
          </div>

          <div className="summary-content">
            <p>Check-out Time</p>
            <h3>{formatTime(settings.checkOut)}</h3>
          </div>
        </div>

        <div className="attendance-summary-card break-card">
          <div className="summary-icon orange-icon">
            <FaCoffee />
          </div>

          <div className="summary-content">
            <p>Break</p>
            <h3>
              {formatTime(settings.breakStart)} – {formatTime(settings.breakEnd)}
            </h3>
          </div>
        </div>

        <div className="attendance-summary-card workdays-card">
          <div className="summary-icon green-icon">
            <FaCalendarAlt />
          </div>

          <div className="summary-content">
            <p>Work Days</p>
            <h3>
              {settings.workDays.length === 0
                ? "Not set"
                : settings.workDays.length === 5 &&
                  days.slice(0, 5).every((day) => settings.workDays.includes(day))
                  ? "Mon – Fri"
                  : `${settings.workDays.length} Days`}
            </h3>
          </div>
        </div>

      </div>

      {/* ================= MAIN CONTENT ================= */}

      <div className="attendance-content-grid">

        {/* ================= WORK SCHEDULE ================= */}

        <div className="attendance-panel work-schedule">

          <div className="attendance-panel-heading">
            <div className="panel-icon">
              <FaCalendarAlt />
            </div>

            <div>
              <h2>Work Schedule</h2>
              <p>Set your daily work hours and break timings.</p>
            </div>
          </div>

          <div className="attendance-panel-divider"></div>

          <div className="times-container">

            <div className="attendance-field">
              <label htmlFor="checkin">
                Check-in time <span>*</span>
              </label>

              <div className="attendance-input-wrapper">
                <FaClock />
                <input
                  id="checkin"
                  type="time"
                  value={settings.checkIn}
                  onChange={(e) =>
                    updateSetting("checkIn", e.target.value)
                  }
                />
              </div>
            </div>

            <div className="attendance-field">
              <label htmlFor="checkout">
                Check-out time <span>*</span>
              </label>

              <div className="attendance-input-wrapper">
                <FaClock />
                <input
                  id="checkout"
                  type="time"
                  value={settings.checkOut}
                  onChange={(e) =>
                    updateSetting("checkOut", e.target.value)
                  }
                />
              </div>
            </div>

            <div className="attendance-field">
              <label htmlFor="breakstart">
                Break start <span>*</span>
              </label>

              <div className="attendance-input-wrapper">
                <FaClock />
                <input
                  id="breakstart"
                  type="time"
                  value={settings.breakStart}
                  onChange={(e) =>
                    updateSetting("breakStart", e.target.value)
                  }
                />
              </div>
            </div>

            <div className="attendance-field">
              <label htmlFor="breakend">
                Break end <span>*</span>
              </label>

              <div className="attendance-input-wrapper">
                <FaClock />
                <input
                  id="breakend"
                  type="time"
                  value={settings.breakEnd}
                  onChange={(e) =>
                    updateSetting("breakEnd", e.target.value)
                  }
                />
              </div>
            </div>

          </div>

          {/* ================= WORK DAYS ================= */}

          <div className="work-days">
            <label>Work Days <span>*</span></label>

            <div className="work-days-options">
              {days.map((day) => (
                <button
                  type="button"
                  key={day}
                  className={`work-day-btn ${settings.workDays.includes(day) ? "selected" : ""
                    }`}
                  onClick={() => toggleDay(day)}
                >
                  {settings.workDays.includes(day) ? (
                    <FaCheck />
                  ) : (
                    <span className="day-circle"></span>
                  )}

                  <span>{day}</span>
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* ================= SMART ATTENDANCE ================= */}

        <div className="attendance-panel smart-attendance">

          <div className="attendance-panel-heading">
            <div className="panel-icon">
              <FaBolt />
            </div>

            <div>
              <h2>Smart Attendance</h2>
              <p>
                Automate alerts and stay informed about your attendance.
              </p>
            </div>
          </div>

          <div className="attendance-panel-divider"></div>

          <div className="smart-attendance-feature">

            {/* OVERTIME */}

            <div className="attendance-feature-row">
              <div className="feature-icon">
                <FaBell />
              </div>

              <div className="feature-content">
                <h3>Overtime Alerts</h3>
                <p>
                  Receive a notification when you exceed your scheduled hours.
                </p>
              </div>

              <button
                type="button"
                className={`attendance-toggle ${settings.overtimeAlerts ? "enabled" : ""
                  }`}
                aria-label="Toggle overtime alerts"
                aria-pressed={settings.overtimeAlerts}
                onClick={() => toggleAlert("overtimeAlerts")}
              >
                <span></span>
              </button>
            </div>

            {/* LATE CHECK-IN */}

            <div className="attendance-feature-row">
              <div className="feature-icon">
                <FaClock />
              </div>

              <div className="feature-content">
                <h3>Late Check-in Alerts</h3>
                <p>
                  Get notified when you check in after the scheduled time.
                </p>
              </div>

              <button
                type="button"
                className={`attendance-toggle ${settings.lateAlerts ? "enabled" : ""
                  }`}
                aria-label="Toggle late check-in alerts"
                aria-pressed={settings.lateAlerts}
                onClick={() => toggleAlert("lateAlerts")}
              >
                <span></span>
              </button>
            </div>

            {/* EARLY CHECK-OUT */}

            <div className="attendance-feature-row">
              <div className="feature-icon">
                <FaSignOutAlt />
              </div>

              <div className="feature-content">
                <h3>Early Check-out Alerts</h3>
                <p>
                  Receive a notification when you check out before the scheduled time.
                </p>
              </div>

              <button
                type="button"
                className={`attendance-toggle ${settings.earlyCheckoutAlerts ? "enabled" : ""
                  }`}
                aria-label="Toggle early check-out alerts"
                aria-pressed={settings.earlyCheckoutAlerts}
                onClick={() => toggleAlert("earlyCheckoutAlerts")}
              >
                <span></span>
              </button>
            </div>

          </div>
        </div>

      </div>

      {/* ================= SAVE CHANGES ================= */}

      <div className="attendance-save-bar">

        <div className="attendance-save-status">
          <div className={`save-status-icon ${saved ? "saved" : "unsaved"}`}>
            {saved ? <FaCheck /> : <FaUndo />}
          </div>

          <div>
            <h3>
              {saved ? "All changes saved" : "Unsaved changes"}
            </h3>

            <p>
              {saved
                ? "Your attendance settings are up to date."
                : "You have changes that haven't been saved yet."}
            </p>
          </div>
        </div>

        <div className="attendance-save-actions">
          <button
            type="button"
            className="attendance-reset-btn"
            onClick={handleReset}
          >
            <FaUndo />
            Reset Changes
          </button>

          <div className="save-action-divider"></div>

          <button
            type="button"
            className="attendance-save-btn"
            onClick={handleSave}
            disabled={saved}
          >
            <FaCheck />
            Save Changes
          </button>
        </div>

      </div>

    </div>
  );
};

import { IoToggleOutline } from "react-icons/io5";
import { IoToggle } from "react-icons/io5";


import "./SettingAttendance.css"
import { SwitchBtn } from "../../SwichBtn/SwitchBtn";

export const SettingAttendance = () => {
  return (
    <>
      <div className="attendance-container">
        <div className="attendance-heading">
          <h2>Attendance</h2>
          <p>
            Configure your work schedule, check-in times, and attendance rules.
          </p>
        </div>

        <div className="work-schedule">
          <div className="schedule-heading">
            <h2>Work Schedule</h2>
          </div>
          <div className="times-container">
            <div>
              <label htmlFor="checkin">Check-in time</label>
              <input type="time" defaultValue={"10:00"} />
            </div>
            <div>
              <label htmlFor="checkout">Check-out time</label>
              <input type="time" defaultValue={"06:00"} />
            </div>
            <div>
              <label htmlFor="breakstart">Break start</label>
              <input type="time" defaultValue={"13:00"} />
            </div>
            <div>
              <label htmlFor="breakend">Break end</label>
              <input type="time" defaultValue={"13:30"} />
            </div>
            <div className="work-days">
              <label htmlFor="worddays">Work Days</label>
              <select>
                <option value="Monday-Friday">Monday-Friday</option>
                <option value="Monday-Saturday">Monday-Saturday</option>
              </select>
            </div>
          </div>
        </div>

        {/* Smart attendance */}
        <div className="smart-attendance">
          <div className="smart-heading">
            <h2>Smart Attendance</h2>
          </div>
          <div className="smart-attendance-feature">
            <div className="auto-checkin">
              <div>
                <h3>Auto check-in</h3>
                <p>
                  Automatically log check-in when you connect to the office
                  Wi-Fi
                </p>
              </div>
              <div>
                <SwitchBtn />
              </div>
            </div>
            <div className="geo-fence-checkin">
              <div>
                <h3>Geo-fence check-in</h3>
                <p>
                  Enable location-based attendance tracking within office radius
                </p>
              </div>
              <div>
                <SwitchBtn />
              </div>
            </div>
            <div className="overtime-alerts">
              <div>
                <h3>Overtime alerts</h3>
                <p>
                  Receive a notification when you exceed your scheduled hours
                </p>
              </div>
              <div>
                <SwitchBtn />
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
  );
};

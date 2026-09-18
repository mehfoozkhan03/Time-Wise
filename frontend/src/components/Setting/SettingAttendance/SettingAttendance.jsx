// import { IoToggleOutline } from "react-icons/io5";
// import { IoToggle } from "react-icons/io5";


// import "./SettingAttendance.css"
// import { SwitchBtn } from "../../SwichBtn/SwitchBtn";

// export const SettingAttendance = () => {
//   return (
//     <>
//       <div className="attendance-container">
//         <div className="attendance-heading">
//           <h2>Attendance</h2>
//           <p>
//             Configure your work schedule, check-in times, and attendance rules.
//           </p>
//         </div>

//         <div className="work-schedule">
//           <div className="schedule-heading">
//             <h2>Work Schedule</h2>
//           </div>
//           <div className="times-container">
//             <div>
//               <label htmlFor="checkin">Check-in time</label>
//               <input type="time" defaultValue={"10:00"} />
//             </div>
//             <div>
//               <label htmlFor="checkout">Check-out time</label>
//               <input type="time" defaultValue={"06:00"} />
//             </div>
//             <div>
//               <label htmlFor="breakstart">Break start</label>
//               <input type="time" defaultValue={"13:00"} />
//             </div>
//             <div>
//               <label htmlFor="breakend">Break end</label>
//               <input type="time" defaultValue={"13:30"} />
//             </div>
//             <div className="work-days">
//               <label htmlFor="worddays">Work Days</label>
//               <select>
//                 <option value="Monday-Friday">Monday-Friday</option>
//               </select>
//             </div>
//           </div>
//         </div>

//         {/* Smart attendance */}
//         <div className="smart-attendance">
//           <div className="smart-heading">
//             <h2>Smart Attendance</h2>
//           </div>
//           <div className="smart-attendance-feature">
//             <div className="auto-checkin">
//               <div>
//                 <h3>Auto check-in</h3>
//                 <p>
//                   Automatically log check-in when you connect to the office
//                   Wi-Fi
//                 </p>
//               </div>
//               <div>
//                 <SwitchBtn />
//               </div>
//             </div>
//             <div className="geo-fence-checkin">
//               <div>
//                 <h3>Geo-fence check-in</h3>
//                 <p>
//                   Enable location-based attendance tracking within office radius
//                 </p>
//               </div>
//               <div>
//                 <SwitchBtn />
//               </div>
//             </div>
//             <div className="overtime-alerts">
//               <div>
//                 <h3>Overtime alerts</h3>
//                 <p>
//                   Receive a notification when you exceed your scheduled hours
//                 </p>
//               </div>
//               <div>
//                 <SwitchBtn />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Save changes */}
//         <div className="save_changes">
//           <div>
//             <p>Unsaved changes</p>
//           </div>
//           <button
//             type="button"
//             className="change-btn"
//           >
//             Save changes
//           </button>
//         </div>
//       </div>
//     </>
//   );
// };



import { useEffect, useState } from "react";
import { IoToggleOutline } from "react-icons/io5";
import { IoToggle } from "react-icons/io5";

import "./SettingAttendance.css";
import { SwitchBtn } from "../../SwichBtn/SwitchBtn";
import Skeleton from "../../../components/Skeleton/Skeleton";

export const SettingAttendance = () => {
  const [showSkeleton, setShowSkeleton] = useState(true);

  // =========================
  // SKELETON TIMER
  // =========================
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
      <div className="attendance-container">

        {/* Heading Skeleton */}
        <div className="attendance-heading">
          <Skeleton width="150px" height="30px" />

          <div style={{ marginTop: "20px" }}>
            <Skeleton width="450px" height="17px" />
          </div>
        </div>

        {/* Work Schedule Skeleton */}
        <div className="work-schedule">

          <div className="schedule-heading">
            <Skeleton width="160px" height="24px" />
          </div>

          <div className="times-container">

            {[1, 2, 3, 4].map((item) => (
              <div key={item}>
                <Skeleton width="510px" height="40px" />

                <div style={{ marginTop: "8px" }}>
                  <Skeleton
                    width="180px"
                    height="40px"
                    radius="8px"
                  />
                </div>
              </div>
            ))}

            {/* Work Days */}
            <div className="work-days">
              <Skeleton width="90px" height="17px" />

              <div style={{ marginTop: "8px" }}>
                <Skeleton
                 width="510px" height="40px"
                  radius="8px"
                />
              </div>
            </div>

          </div>
        </div>

        {/* Smart Attendance Skeleton */}
        <div className="smart-attendance">

          <div className="smart-heading">
            <Skeleton width="180px" height="24px" />
          </div>

          <div className="smart-attendance-feature">

            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="attendance-skeleton-feature"
              >
                <div>
                  <Skeleton width="150px" height="19px" />

                  <div style={{ marginTop: "8px" }}>
                    <Skeleton width="400px" height="15px" />
                  </div>
                </div>

                <Skeleton
                  width="45px"
                  height="25px"
                  radius="20px"
                />
              </div>
            ))}

          </div>
        </div>

        {/* Save Changes Skeleton */}
        <div className="save_changes attendance-save-skeleton">
          <Skeleton width="130px" height="17px" />

          <Skeleton
            width="120px"
            height="40px"
            radius="8px"
          />
        </div>

      </div>
    );
  }

  // =========================
  // ORIGINAL UI
  // =========================
  return (
    <>
      <div className="attendance-container">

        <div className="attendance-heading">
          <h2>Attendance</h2>

          <p>
            Configure your work schedule, check-in times, and attendance rules.
          </p>
        </div>

        {/* Work Schedule */}
        <div className="work-schedule">

          <div className="schedule-heading">
            <h2>Work Schedule</h2>
          </div>

          <div className="times-container">

            <div>
              <label htmlFor="checkin">Check-in time</label>
              <input
                id="checkin"
                type="time"
                defaultValue={"10:00"}
              />
            </div>

            <div>
              <label htmlFor="checkout">Check-out time</label>
              <input
                id="checkout"
                type="time"
                defaultValue={"06:00"}
              />
            </div>

            <div>
              <label htmlFor="breakstart">Break start</label>
              <input
                id="breakstart"
                type="time"
                defaultValue={"13:00"}
              />
            </div>

            <div>
              <label htmlFor="breakend">Break end</label>
              <input
                id="breakend"
                type="time"
                defaultValue={"13:30"}
              />
            </div>

            <div className="work-days">
              <label htmlFor="workdays">Work Days</label>

              <select id="workdays">
                <option value="Monday-Friday">
                  Monday-Friday
                </option>
              </select>
            </div>

          </div>
        </div>

        {/* Smart Attendance */}
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
                  Enable location-based attendance tracking within office
                  radius
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
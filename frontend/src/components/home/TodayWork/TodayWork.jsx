import { useEffect, useState } from 'react'

<<<<<<< HEAD
// import { useEffect, useState } from "react";
// import { FaCircle, FaClock, FaCoffee, FaSignInAlt } from "react-icons/fa";
// import Skeleton from "../../../components/Skeleton/Skeleton";

// import "./TodayWork.css";
// import Card from "../../Card/Card";
// import BreakModal from "./BreakModal";
// import useAttendance from "../../../hooks/useAttendance";
// import { PulseDot } from "../../PulseDot/pulseDot";

// export default function TodayWork() {
//   const {
//     attendance,
//     loading,
//     status,
//     checkIn,
//     startBreak,
//     endBreak,
//     checkOut,
//     sessionTime,
//     workingTime,
//     breakTime,
//     breakSeconds,
//   } = useAttendance();

//   const [showBreakModal, setShowBreakModal] = useState(false);
//   const [showSkeleton, setShowSkeleton] = useState(true);

//   useEffect(() => {
//     setShowBreakModal(status === "break");
//   }, [status]);

//   useEffect(() => {
//   const timer = setTimeout(() => {
//     setShowSkeleton(false);
//   }, 1500);

//   return () => clearTimeout(timer);
// }, []);


//   const handleBreak = async () => {
//     await startBreak();
//   };

//   const handleResume = async () => {
//     await endBreak();
//   };

//   const getStatus = () => {
//     switch (status) {
//       case "idle":
//         return "Not Checked In";

//       case "working":
//         return "Working";

//       case "break":
//         return "On Break";

//       case "checkedout":
//         return "Checked Out";

//       default:
//         return "Not Checked In";
//     }
//   };

//   const renderButton = () => {
//     switch (status) {
//       case "idle":
//         return (
//           <button
//             className="today_primary_button"
//             onClick={checkIn}
//             disabled={loading}
//           >
//             Check In
//           </button>
//         );

//       case "working":
//         return (
//           <>
//             <button
//               className="today_primary_button break"
//               onClick={handleBreak}
//               disabled={loading}
//             >
//               Take Break
//             </button>

//             <button
//               className="today_primary_button checkout"
//               onClick={checkOut}
//               disabled={loading}
//             >
//               Check Out
//             </button>
//           </>
//         );

//       case "break":
//         return (
//           <button
//             className="today_primary_button resume"
//             onClick={handleResume}
//             disabled={loading}
//           >
//             Resume Work
//           </button>
//         );

//       case "checkedout":
//         return (
//           <button className="today_primary_button finished" disabled>
//             Work Completed
//           </button>
//         );

//       default:
//         return null;
//     }
//   };

//   // skeleton//
 
// if (showSkeleton) {
//   return (
//     <Card className="today_work">
//       <div className="today_header">
//         <div>
//           <Skeleton width="180px" height="32px" />
//           <div style={{ marginTop: "10px" }}>
//             <Skeleton width="240px" height="18px" />
//           </div>
//         </div>

//         <Skeleton width="150px" height="40px" radius="20px" />
//       </div>

//       <div className="today_content">
//         {[1, 2, 3, 4].map((item) => (
//           <div className="today_stat" key={item}>
//             <Skeleton width="28px" height="28px" radius="50%" />

//             <div style={{ flex: 1, marginLeft: "12px" }}>
//               <Skeleton width="90px" height="14px" />
//               <div style={{ marginTop: "8px" }}>
//                 <Skeleton width="110px" height="22px" />
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       <div className="today_action">
//         <Skeleton width="170px" height="45px" radius="10px" />
//       </div>
//     </Card>
//   );
// }
//   // skeleton//


//   return (
//     <>
//       <Card className="today_work" id="tour-today-work">
//         <div className="today_header">
//           <div>
//             <h2>Today's Work</h2>

//             <p>Your attendance summary for today</p>
//           </div>

//           <div className={`today_status ${status}`}>
//             <PulseDot
//               color={
//                 status === "idle"
//                   ? "#ef4444"
//                   : status === "working"
//                     ? "#22c55e"
//                     : status === "break"
//                       ? "#f59e0b"
//                       : "#3b82f6"
//               }
//             />
//             {getStatus()}
//           </div>
//         </div>

//         <div className="today_content">
//           <div className="today_stat">
//             <FaSignInAlt />

//             <div>
//               <span>Checked In</span>

//               <strong>
//                 {attendance?.checkInTime
//                   ? new Date(attendance.checkInTime).toLocaleTimeString()
//                   : "--:--"}
//               </strong>
//             </div>
//           </div>

//           <div className="today_stat">
//             <FaClock />

//             <div>
//               <span>Current Session</span>

//               <strong>{sessionTime}</strong>
//             </div>
//           </div>

//           <div className="today_stat">
//             <FaClock />

//             <div>
//               <span>Working Time</span>

//               <strong>{workingTime}</strong>
//             </div>
//           </div>

//           <div className="today_stat">
//             <FaCoffee />

//             <div>
//               <span>Break Used</span>

//               <strong>{breakTime}</strong>
//             </div>
//           </div>
//         </div>

//         <div className="today_action">{renderButton()}</div>
//       </Card>

//       <BreakModal
//         isOpen={showBreakModal}
//         onResume={handleResume}
//         breakSeconds={breakSeconds}
//       />
//     </>
//   );
// }


import { useEffect, useState } from "react";
import {
  FaClock,
  FaCoffee,
  FaSignInAlt,
} from "react-icons/fa";

import Skeleton from "../../../components/Skeleton/Skeleton";

import "./TodayWork.css";

import Card from "../../Card/Card";
import BreakModal from "./BreakModal";
import useAttendance from "../../../hooks/useAttendance";
import { PulseDot } from "../../PulseDot/pulseDot";
=======
import { FaClock, FaCoffee, FaSignInAlt } from 'react-icons/fa'

import Skeleton from '../../../components/Skeleton/Skeleton'

import './TodayWork.css'

import Card from '../../Card/Card'

import BreakModal from './BreakModal'

import useAttendance from '../../../hooks/useAttendance'

import { PulseDot } from '../../PulseDot/pulseDot'
>>>>>>> e5adab7aba31128b6c79c538c277d2634e48bceb

export default function TodayWork() {

  /* ==========================================
     ATTENDANCE
  ========================================== */

  const {
    attendance,
    loading,
    status,
    checkIn,
    startBreak,
    endBreak,
    checkOut,
    sessionTime,
    workingTime,
    breakTime,
    breakSeconds,

<<<<<<< HEAD

  /* ==========================================
     BREAK MODAL
  ========================================== */

  const [showBreakModal, setShowBreakModal] =
    useState(false);


  useEffect(() => {

    setShowBreakModal(
      status === "break"
    );

  }, [status]);


  /* ==========================================
     BREAK HANDLERS
  ========================================== */

  const handleBreak = async () => {

    await startBreak();

  };
=======
    isWorkingDay,
    isHoliday,
    holiday,
  } = useAttendance()

  const [showBreakModal, setShowBreakModal] = useState(false)

  const [showSkeleton, setShowSkeleton] = useState(true)

  // =====================================================
  // Break Modal
  // =====================================================

  useEffect(() => {
    setShowBreakModal(status === 'break')
  }, [status])

  // =====================================================
  // Skeleton
  // =====================================================

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSkeleton(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  // =====================================================
  // Attendance Day State
  // =====================================================

  const attendanceDisabled = !isWorkingDay || isHoliday

  // =====================================================
  // Break Actions
  // =====================================================

  const handleBreak = async () => {
    await startBreak()
  }
>>>>>>> e5adab7aba31128b6c79c538c277d2634e48bceb


  const handleResume = async () => {
<<<<<<< HEAD

    await endBreak();

  };
=======
    await endBreak()
  }

  // =====================================================
  // Status
  // =====================================================
>>>>>>> e5adab7aba31128b6c79c538c277d2634e48bceb


  /* ==========================================
     STATUS
  ========================================== */

  const getStatus = () => {
<<<<<<< HEAD

    switch (status) {

      case "idle":
        return "Not Checked In";
=======
    if (attendanceDisabled) {
      if (isHoliday) {
        return 'Holiday'
      }

      return 'Weekend'
    }

    switch (status) {
      case 'idle':
        return 'Not Checked In'
>>>>>>> e5adab7aba31128b6c79c538c277d2634e48bceb

      case 'working':
        return 'Working'

      case 'break':
        return 'On Break'

      case 'checkedout':
        return 'Checked Out'

      default:
        return 'Not Checked In'
    }
  }

  // =====================================================
  // Status Color
  // =====================================================

  const getStatusColor = () => {
    if (attendanceDisabled) {
      return '#64748b'
    }

    if (status === 'idle') {
      return '#ef4444'
    }

    if (status === 'working') {
      return '#22c55e'
    }

    if (status === 'break') {
      return '#f59e0b'
    }

    return '#3b82f6'
  }

  // =====================================================
  // Buttons
  // =====================================================


  /* ==========================================
     ACTION BUTTON
  ========================================== */

  const renderButton = () => {
<<<<<<< HEAD

    switch (status) {

      case "idle":

=======
    if (attendanceDisabled) {
      return null
    }

    switch (status) {
      case 'idle':
>>>>>>> e5adab7aba31128b6c79c538c277d2634e48bceb
        return (
          <button
            className="today_primary_button"
            onClick={checkIn}
            disabled={loading}
          >
            Check In
          </button>
        )

<<<<<<< HEAD

      case "working":

=======
      case 'working':
>>>>>>> e5adab7aba31128b6c79c538c277d2634e48bceb
        return (
          <>
            <button
              className="today_primary_button break"
              onClick={handleBreak}
              disabled={loading}
            >
              Take Break
            </button>

            <button
              className="today_primary_button checkout"
              onClick={checkOut}
              disabled={loading}
            >
              Check Out
            </button>
          </>
        )

<<<<<<< HEAD

      case "break":

=======
      case 'break':
>>>>>>> e5adab7aba31128b6c79c538c277d2634e48bceb
        return (
          <button
            className="today_primary_button resume"
            onClick={handleResume}
            disabled={loading}
          >
            Resume Work
          </button>
        )

<<<<<<< HEAD

      case "checkedout":

=======
      case 'checkedout':
>>>>>>> e5adab7aba31128b6c79c538c277d2634e48bceb
        return (
          <button
            className="today_primary_button finished"
            disabled
          >
            Work Completed
          </button>
        )


      default:
        return null
    }
  }

<<<<<<< HEAD

  /* ==========================================
     BACKEND LOADING SKELETON
     
     Skeleton will stay visible while
     useAttendance() loading === true.
  ========================================== */

  if (loading) {

    return (

      <Card
        className="today_work"
        id="tour-today-work"
      >

        {/* ==================================
            HEADER
        ================================== */}

        <div className="today_header">

          <div>

            <Skeleton
              width="180px"
              height="32px"
            />

            <div
              style={{
                marginTop: "10px",
              }}
            >

              <Skeleton
                width="240px"
                height="18px"
              />

            </div>

          </div>


          {/* STATUS */}

          <Skeleton
            width="150px"
            height="40px"
            radius="20px"
          />

        </div>


        {/* ==================================
            ATTENDANCE STATS
        ================================== */}

        <div className="today_content">

          {/* CHECKED IN */}

          <div className="today_stat">

            <Skeleton
              width="28px"
              height="28px"
              radius="50%"
            />

            <div
              style={{
                flex: 1,
                marginLeft: "12px",
              }}
            >

              <Skeleton
                width="90px"
                height="14px"
              />

              <div
                style={{
                  marginTop: "8px",
                }}
              >

                <Skeleton
                  width="110px"
                  height="22px"
                />

              </div>

=======
  // =====================================================
  // Skeleton
  // =====================================================

  if (showSkeleton) {
    return (
      <Card className="today_work">
        <div className="today_header">
          <div>
            <Skeleton width="180px" height="32px" />

            <div
              style={{
                marginTop: '10px',
              }}
            >
              <Skeleton width="240px" height="18px" />
>>>>>>> e5adab7aba31128b6c79c538c277d2634e48bceb
            </div>

          </div>

<<<<<<< HEAD

          {/* CURRENT SESSION */}

          <div className="today_stat">

            <Skeleton
              width="28px"
              height="28px"
              radius="50%"
            />

            <div
              style={{
                flex: 1,
                marginLeft: "12px",
              }}
            >

              <Skeleton
                width="110px"
                height="14px"
              />

              <div
                style={{
                  marginTop: "8px",
                }}
              >

                <Skeleton
                  width="110px"
                  height="22px"
                />

              </div>

            </div>

          </div>


          {/* WORKING TIME */}

          <div className="today_stat">

            <Skeleton
              width="28px"
              height="28px"
              radius="50%"
            />

            <div
              style={{
                flex: 1,
                marginLeft: "12px",
              }}
            >

              <Skeleton
                width="100px"
                height="14px"
              />

              <div
                style={{
                  marginTop: "8px",
                }}
              >

                <Skeleton
                  width="110px"
                  height="22px"
                />

              </div>

            </div>

          </div>


          {/* BREAK USED */}

          <div className="today_stat">

            <Skeleton
              width="28px"
              height="28px"
              radius="50%"
            />

            <div
              style={{
                flex: 1,
                marginLeft: "12px",
              }}
            >

              <Skeleton
                width="80px"
                height="14px"
              />

              <div
                style={{
                  marginTop: "8px",
                }}
              >

                <Skeleton
                  width="110px"
                  height="22px"
                />

              </div>

            </div>

          </div>

        </div>


        {/* ==================================
            ACTION BUTTON
        ================================== */}

        <div className="today_action">

          <Skeleton
            width="170px"
            height="45px"
            radius="10px"
          />

        </div>

      </Card>
    );
  }


  /* ==========================================
     ACTUAL UI
  ========================================== */

  return (
=======
          <Skeleton width="150px" height="40px" radius="20px" />
        </div>

        <div className="today_content">
          {[1, 2, 3, 4].map((item) => (
            <div className="today_stat" key={item}>
              <Skeleton width="28px" height="28px" radius="50%" />

              <div
                style={{
                  flex: 1,
                  marginLeft: '12px',
                }}
              >
                <Skeleton width="90px" height="14px" />

                <div
                  style={{
                    marginTop: '8px',
                  }}
                >
                  <Skeleton width="110px" height="22px" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="today_action">
          <Skeleton width="170px" height="45px" radius="10px" />
        </div>
      </Card>
    )
  }

  // =====================================================
  // Main UI
  // =====================================================

  return (
    <>
      <Card
        className={`today_work ${
          attendanceDisabled ? 'today_work_disabled' : ''
        }`}
        id="tour-today-work"
      >
        <div className="today_header">
          <div>
            <h2>Today's Work</h2>
>>>>>>> e5adab7aba31128b6c79c538c277d2634e48bceb

    <>

      <Card
        className="today_work"
        id="tour-today-work"
      >

        {/* ==================================
            HEADER
        ================================== */}

        <div className="today_header">

          <div>

            <h2>
              Today's Work
            </h2>

            <p>
              Your attendance summary for today
            </p>

          </div>

<<<<<<< HEAD

          {/* STATUS */}

          <div
            className={`today_status ${status}`}
          >

            <PulseDot
              color={
                status === "idle"
                  ? "#ef4444"
                  : status === "working"
                    ? "#22c55e"
                    : status === "break"
                      ? "#f59e0b"
                      : "#3b82f6"
              }
            />
=======
          <div
            className={`today_status ${
              attendanceDisabled ? 'disabled' : status
            }`}
          >
            <PulseDot color={getStatusColor()} />
>>>>>>> e5adab7aba31128b6c79c538c277d2634e48bceb

            {getStatus()}

          </div>

        </div>


        {/* ==================================
            CONTENT
        ================================== */}

        <div className="today_content">

          {/* CHECKED IN */}

          <div className="today_stat">

            <FaSignInAlt />

            <div>

              <span>
                Checked In
              </span>

              <strong>

                {attendance?.checkInTime
<<<<<<< HEAD
                  ? new Date(
                      attendance.checkInTime
                    ).toLocaleTimeString()
                  : "--:--"}

=======
                  ? new Date(attendance.checkInTime).toLocaleTimeString()
                  : '--:--'}
>>>>>>> e5adab7aba31128b6c79c538c277d2634e48bceb
              </strong>

            </div>

          </div>


          {/* CURRENT SESSION */}

          <div className="today_stat">

            <FaClock />

            <div>

              <span>
                Current Session
              </span>

              <strong>
                {sessionTime}
              </strong>

            </div>

          </div>


          {/* WORKING TIME */}

          <div className="today_stat">

            <FaClock />

            <div>

              <span>
                Working Time
              </span>

              <strong>
                {workingTime}
              </strong>

            </div>

          </div>


          {/* BREAK USED */}

          <div className="today_stat">

            <FaCoffee />

            <div>

              <span>
                Break Used
              </span>

              <strong>
                {breakTime}
              </strong>

            </div>

          </div>

        </div>


        {/* ==================================
            ACTION
        ================================== */}

        <div className="today_action">

          {renderButton()}

        </div>

<<<<<<< HEAD
=======
        <div className="today_action">{renderButton()}</div>

        {/* ============================================= */}
        {/* WEEKEND / HOLIDAY OVERLAY */}
        {/* ============================================= */}

        {attendanceDisabled && (
          <div className="today_disabled_overlay">
            <div className="today_disabled_lines" />

            <div className="today_disabled_message">
              <div className="today_disabled_title">
                {isHoliday ? 'Today is a Holiday' : "It's the Weekend"}
              </div>

              <div className="today_disabled_subtitle">
                {isHoliday
                  ? holiday?.title || 'Attendance is not required today.'
                  : 'Attendance is not required on weekends.'}
              </div>
            </div>
          </div>
        )}
>>>>>>> e5adab7aba31128b6c79c538c277d2634e48bceb
      </Card>


      {/* ======================================
          BREAK MODAL
      ====================================== */}

      <BreakModal
        isOpen={showBreakModal}
        onResume={handleResume}
        breakSeconds={breakSeconds}
      />

    </>
<<<<<<< HEAD
  );
}
=======
  )
}
>>>>>>> e5adab7aba31128b6c79c538c277d2634e48bceb

// import { useState, useRef, useEffect } from "react";
// import "./FeedBack.css";
// import { FaCheckCircle, FaTimesCircle, FaTimes } from "react-icons/fa";

// export function Feedback({
//   isOpen,
//   variant = "success",
//   title,
//   message,
//   reason,
//   onClose,
//   onConfirm,
//   confirmText = "Continue",
//   cancelText = "Cancel",
//   showActions = false,
// }) {
//   const [showLoader, setShowLoader] = useState(false);
//   const [showCelebration, setShowCelebration] = useState(false);

//   useEffect(() => {
//     if (isOpen) {
//       document.body.classList.add("feedback-open");
//     } else {
//       document.body.classList.remove("feedback-open");
//     }

//     return () => {
//       document.body.classList.remove("feedback-open");
//     };
//   }, [isOpen]);

//   // 🔊 Audio
//   const audioRef = useRef(null);

//   if (audioRef.current === null) {
//     audioRef.current = new Audio(
//       "/Video/u_jspnqv1glx-1gift-confetti-447240.mp3",
//     );
//   }

//   if (!isOpen) return null;

//   const isSuccess = variant === "success";
//   const isError = variant === "error";
//   const isLogout = variant === "logout";

//   const handleLogoutAnimation = () => {
//     setShowLoader(true);

//     setTimeout(() => {
//       setShowLoader(false);
//       setShowCelebration(true);

//       const audio = audioRef.current;

//       audio.pause();
//       audio.currentTime = 0;
//       audio.volume = 0.8;

//       const startTime = Date.now();

//       audio.play().catch(() => {
//         setTimeout(() => {
//           setShowCelebration(false);
//           onConfirm?.();
//         }, 2500);
//       });

//       audio.onended = () => {
//         const elapsed = Date.now() - startTime;
//         const remaining = Math.max(2500 - elapsed, 0);

//         setTimeout(() => {
//           setShowCelebration(false);
//           onConfirm?.();
//         }, remaining);
//       };
//     }, 2000);
//   };

//   const colors = [
//     "#FFD700",
//     "#FF6B6B",
//     "#00E5FF",
//     "#7C4DFF",
//     "#00FF95",
//     "#FF4FD8",
//     "#FFFFFF",
//     "#FF9800",
//   ];

//   return (
//     <>
//       {/* ===========================
//         Full Screen Loader
//     ============================ */}
//       {showLoader && (
//         <div className="feedback_loader_overlay">
//           <div className="feedback_loader"></div>
//         </div>
//       )}

//       {/* ===========================
//     Celebration Animation
// =========================== */}
//       {showCelebration && (
//         <div className="feedback_party">
//           <div className="party_left">
//             🎉
//             {[...Array(350)].map((_, i) => {
//               const types = ["dot", "star", "sparkle", "ring"];

//               return (
//                 <span
//                   key={`left-${i}`}
//                   className={`particle ${types[i % types.length]}`}
//                   style={{
//                     "--x": `${(Math.random() - 0.5) * 2600}px`,
//                     "--y": `${(Math.random() - 1) * 1800}px`,
//                     "--delay": `${Math.random() * 0.25}s`,
//                     "--size": `${6 + Math.random() * 18}px`,
//                     "--rotate": `${Math.random() * 360}deg`,
//                     "--color":
//                       colors[Math.floor(Math.random() * colors.length)],
//                   }}
//                 />
//               );
//             })}
//           </div>

//           <div className="party_right">
//             🎉
//             {[...Array(350)].map((_, i) => {
//               const types = ["dot", "star", "sparkle", "ring"];

//               return (
//                 <span
//                   key={`right-${i}`}
//                   className={`particle ${types[i % types.length]}`}
//                   style={{
//                     "--x": `${(Math.random() - 0.5) * 2600}px`,
//                     "--y": `${(Math.random() - 1) * 1800}px`,
//                     "--delay": `${Math.random() * 0.25}s`,
//                     "--size": `${6 + Math.random() * 18}px`,
//                     "--rotate": `${Math.random() * 360}deg`,
//                     "--color":
//                       colors[Math.floor(Math.random() * colors.length)],
//                   }}
//                 />
//               );
//             })}
//           </div>
//         </div>
//       )}

//       <div className="feedback_overlay" onClick={onClose}>
//         <div
//           className={`feedback_modal feedback_modal--${variant}`}
//           onClick={(e) => e.stopPropagation()}
//         >
//           {/* Close button */}
//           <button
//             className="feedback_close"
//             onClick={onClose}
//             aria-label="Close"
//           >
//             <FaTimes />
//           </button>

//           {/* Icon */}
//           <div className={`feedback_icon feedback_icon--${variant}`}>
//             {isSuccess && <FaCheckCircle />}

//             {isError && <FaTimesCircle />}

//             {isLogout && (
//               <span className="feedback_wave" role="img" aria-label="Goodbye">
//                 👋
//               </span>
//             )}
//           </div>

//           {/* Title */}
//           <h2 className="feedback_title">{title}</h2>

//           {/* Body message */}
//           <p className="feedback_message">{message}</p>

//           {/* Error Reason - shown for all error types when provided */}
//           {isError && reason && (
//             <div className="feedback_reason">
//               <span className="feedback_reason_label">Reason</span>
//               <span className="feedback_reason_text">{reason}</span>
//             </div>
//           )}

//           {/* Buttons */}
//           {isLogout || showActions ? (
//             <div className="feedback_actions">
//               <button
//                 className="feedback_button feedback_button--cancel"
//                 onClick={onClose}
//               >
//                 {cancelText}
//               </button>

//               <button
//                 className={`feedback_button ${
//                   isLogout
//                     ? "feedback_button--logout"
//                     : "feedback_button--error"
//                 }`}
//                 onClick={isLogout ? handleLogoutAnimation : onConfirm}
//               >
//                 {confirmText}
//               </button>
//             </div>
//           ) : (
//             <button
//               className={`feedback_button feedback_button--${variant}`}
//               onClick={onClose}
//             >
//               {isSuccess ? "Continue" : "Try Again"}
//             </button>
//           )}
//         </div>
//       </div>
//     </>
//   );
// }


import "./FeedBack.css";
import { FaCheckCircle, FaTimesCircle, FaTimes } from "react-icons/fa";

export function Feedback({
  isOpen,
  variant = "success",
  title,
  message,
  reason,
  onClose,
  onConfirm,
  confirmText = "Continue",
  cancelText = "Cancel",
  showActions = false,
}) {
  if (!isOpen) return null;

  const isSuccess = variant === "success";
  const isError = variant === "error";
  const isLogout = variant === "logout";

  return (
    <div className="feedback_overlay" onClick={onClose}>
      <div
        className={`feedback_modal feedback_modal--${variant}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          className="feedback_close"
          onClick={onClose}
          aria-label="Close"
        >
          <FaTimes />
        </button>

        {/* Icon */}
        <div className={`feedback_icon feedback_icon--${variant}`}>
          {isSuccess && <FaCheckCircle />}

          {isError && <FaTimesCircle />}

          {isLogout && (
            <span className="feedback_wave" role="img" aria-label="Goodbye">
              👋
            </span>
          )}
        </div>

        {/* Title */}
        <h2 className="feedback_title">{title}</h2>

        {/* Body message */}
        <p className="feedback_message">{message}</p>

        {/* Error Reason */}
        {isError && reason && (
          <div className="feedback_reason">
            <span className="feedback_reason_label">Reason</span>
            <span className="feedback_reason_text">{reason}</span>
          </div>
        )}

        {/* Buttons */}
        {isLogout || showActions ? (
          <div className="feedback_actions">
            {/* Cancel Button */}
            <button
              className="feedback_button feedback_button--cancel"
              onClick={onClose}
            >
              {cancelText}
            </button>

            {/* Confirm Button */}
            <button
              className={`feedback_button ${
                isLogout
                  ? "feedback_button--logout"
                  : "feedback_button--error"
              }`}
              onClick={onConfirm}
            >
              {confirmText}
            </button>
          </div>
        ) : (
          <button
            className={`feedback_button feedback_button--${variant}`}
            onClick={onClose}
          >
            {isSuccess ? "Continue" : "Try Again"}
          </button>
        )}
      </div>
    </div>
  );
}
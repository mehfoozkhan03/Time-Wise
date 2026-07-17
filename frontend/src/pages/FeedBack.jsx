import "./FeedBack.css";

import { FaCheckCircle, FaTimesCircle, FaTimes } from "react-icons/fa";

/**
 * FeedbackModal — a dynamic modal for success / error feedback.
 *
 * Props:
 *   isOpen   {boolean}  — controls visibility
 *   type     {string}   — "success" | "error"
 *   title    {string}   — heading text
 *   message  {string}   — body text
 *   onClose  {function} — called when the user dismisses the modal
 */
export function Feedback({
  isOpen,
  type = "success",
  title,
  message,
  onClose,
}) {
  if (!isOpen) return null;

  const isSuccess = type === "success";

  return (
    <div className="feedback_overlay" onClick={onClose}>
      <div
        className={`feedback_modal feedback_modal--${type}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close (×) button */}
        <button className="feedback_close" onClick={onClose} aria-label="Close">
          <FaTimes />
        </button>

        {/* Icon */}
        <div className={`feedback_icon feedback_icon--${type}`}>
          {isSuccess ? <FaCheckCircle /> : <FaTimesCircle />}
        </div>

        {/* Text */}
        <h2 className="feedback_title">{title}</h2>
        <p className="feedback_message">{message}</p>

        {/* Action button */}
        <button
          className={`feedback_button feedback_button--${type}`}
          onClick={onClose}
        >
          {isSuccess ? "Continue" : "Try Again"}
        </button>
      </div>
    </div>
  );
}

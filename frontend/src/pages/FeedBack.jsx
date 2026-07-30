import "./FeedBack.css";
import { FaCheckCircle, FaTimesCircle, FaTimes } from "react-icons/fa";

/**
 * FeedbackModal — dynamic modal for success / error feedback.
 *
 * Props:
 *   isOpen   {boolean}  — controls visibility
 *   variant     {string}   — "success" | "error"
 *   title    {string}   — heading text
 *   message  {string}   — body text
 *   reason   {string}   — (optional) specific error detail shown in a highlight box
 *   onClose  {function} — called when the user dismisses the modal
 */

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
        <button className="feedback_close" onClick={onClose} aria-label="Close">
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

        {/* ── Reason box — only shown on error when reason is provided ── */}
        {isError && reason && (
          <div className="feedback_reason">
            <span className="feedback_reason_label">Reason</span>
            <span className="feedback_reason_text">{reason}</span>
          </div>
        )}

        {/* Action button */}
        {isLogout ? (
          <div className="feedback_actions">
            <button
              className="feedback_button feedback_button--cancel"
              onClick={onClose}
            >
              {cancelText}
            </button>

            <button
              className="feedback_button feedback_button--logout"
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

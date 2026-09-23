import "./EventFormModal.css";

import { memo, useEffect, useRef, useCallback } from "react";

import { FaTimes, FaPlus, FaEdit } from "react-icons/fa";

import EventForm from "./EventForm";

function EventFormModal({
  mode = "CREATE",
  event = null,
  employees = [],
  isAdmin = false,
  isSubmitting = false,
  onSubmit,
  onClose,
}) {
  const closeButtonRef = useRef(null);

  const isEditMode = mode === "EDIT";

  useEffect(() => {
    closeButtonRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === "Escape" && !isSubmitting) {
        onClose?.();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, isSubmitting]);

  const handleClose = useCallback(() => {
    if (isSubmitting) {
      return;
    }

    onClose?.();
  }, [onClose, isSubmitting]);

  const handleOverlayClick = useCallback(
    (event) => {
      if (event.target === event.currentTarget) {
        handleClose();
      }
    },
    [handleClose],
  );

  const handleModalClick = useCallback((event) => {
    event.stopPropagation();
  }, []);

  const handleSubmit = useCallback(
    (formData) => {
      onSubmit?.(formData);
    },
    [onSubmit],
  );

  return (
    <div
      className="eventFormOverlay"
      onClick={handleOverlayClick}
      role="presentation"
    >
      <div
        className="eventFormModal"
        onClick={handleModalClick}
        role="dialog"
        aria-modal="true"
        aria-labelledby="event-form-title"
      >
        <div className="eventFormHeader">
          <div className="eventFormTitle">
            <div className="eventFormIcon">
              {isEditMode ? <FaEdit /> : <FaPlus />}
            </div>

            <div>
              <h2 id="event-form-title">
                {isEditMode ? "Edit Event" : "Create Event"}
              </h2>

              <span>
                {isEditMode ? "Update existing event" : "Fill event details"}
              </span>
            </div>
          </div>

          <button
            ref={closeButtonRef}
            type="button"
            className="closeBtn"
            onClick={handleClose}
            disabled={isSubmitting}
            aria-label="Close Event Form"
          >
            <FaTimes />
          </button>
        </div>

        <div className="eventFormBody">
          <EventForm
            mode={mode}
            initialData={event}
            employees={employees}
            isAdmin={isAdmin}
            isSubmitting={isSubmitting}
            onSubmit={handleSubmit}
            onCancel={handleClose}
          />
        </div>
      </div>
    </div>
  );
}

EventFormModal.displayName = "EventFormModal";

export default memo(EventFormModal);

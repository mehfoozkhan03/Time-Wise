import "./HolidayFormModal.css";

import { memo, useEffect, useRef, useCallback } from "react";

import { FaTimes, FaEdit, FaUmbrellaBeach } from "react-icons/fa";

import HolidayForm from "./HolidayForm";

function HolidayFormModal({
  mode = "CREATE",
  holiday = null,
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

  const handleOverlayClick = useCallback(
    (event) => {
      if (event.target === event.currentTarget && !isSubmitting) {
        onClose?.();
      }
    },
    [onClose, isSubmitting],
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
      className="holidayFormOverlay"
      onClick={handleOverlayClick}
      role="presentation"
    >
      <div
        className="holidayFormModal"
        onClick={handleModalClick}
        role="dialog"
        aria-modal="true"
        aria-labelledby="holiday-form-title"
      >
        <div className="holidayFormHeader">
          <div className="holidayFormTitle">
            <div className="holidayFormIcon">
              {isEditMode ? <FaEdit /> : <FaUmbrellaBeach />}
            </div>

            <div>
              <h2 id="holiday-form-title">
                {isEditMode ? "Edit Holiday" : "Create Holiday"}
              </h2>

              <span>
                {isEditMode
                  ? "Update holiday information"
                  : "Create a new holiday"}
              </span>
            </div>
          </div>

          <button
            ref={closeButtonRef}
            type="button"
            className="closeBtn"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Close Holiday Form"
          >
            <FaTimes />
          </button>
        </div>

        <div className="holidayFormBody">
          <HolidayForm
            mode={mode}
            initialData={holiday}
            isSubmitting={isSubmitting}
            onSubmit={handleSubmit}
            onCancel={onClose}
          />
        </div>
      </div>
    </div>
  );
}

HolidayFormModal.displayName = "HolidayFormModal";

export default memo(HolidayFormModal);

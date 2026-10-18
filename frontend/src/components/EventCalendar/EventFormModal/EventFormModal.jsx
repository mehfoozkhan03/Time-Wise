import "./EventFormModal.css";

import { memo, useEffect, useRef, useState, useCallback } from "react";

import { FaTimes, FaPlus, FaEdit } from "react-icons/fa";

import EventForm from "./EventForm";
import { Modal } from "../../Modal/Modal";

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
  const detailsCloseButtonRef = useRef(null);

  const [employeeDetails, setEmployeeDetails] = useState(null);

  const isEditMode = mode === "EDIT";

  const closeEmployeeDetails = useCallback(() => {
    setEmployeeDetails(null);
  }, []);

  const handleEmployeeDetails = useCallback((employee) => {
    if (employee) {
      setEmployeeDetails(employee);
    }
  }, []);

  useEffect(() => {
    if (employeeDetails) {
      detailsCloseButtonRef.current?.focus();
    } else {
      closeButtonRef.current?.focus();
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        if (employeeDetails) {
          event.stopPropagation();
          closeEmployeeDetails();
          return;
        }

        if (!isSubmitting) {
          onClose?.();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [employeeDetails, closeEmployeeDetails, onClose, isSubmitting]);

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

  const getEmployeeValue = useCallback((employee, fields) => {
    for (const field of fields) {
      const value = employee?.[field];

      if (
        value !== undefined &&
        value !== null &&
        String(value).trim() !== ""
      ) {
        return String(value);
      }
    }

    return "Not available";
  }, []);

  return (
    <>
      <Modal
        isOpen
        overlayClassName="eventFormOverlay"
        className="eventFormModal"
        onOverlayClick={handleOverlayClick}
        onContentClick={handleModalClick}
        ariaLabelledBy="event-form-title"
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
            onEmployeeDetails={handleEmployeeDetails}
          />
        </div>
      </Modal>

      {employeeDetails && (
        <div
          className="employeeDetailsOverlay"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              closeEmployeeDetails();
            }
          }}
        >
          <section
            className="employeeDetailsModal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="employee-details-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="employeeDetailsHeader">
              <div>
                <h2 id="employee-details-title">Employee Details</h2>

                <p>Employee information</p>
              </div>

              <button
                ref={detailsCloseButtonRef}
                type="button"
                className="employeeDetailsCloseBtn"
                onClick={closeEmployeeDetails}
                aria-label="Close employee details"
              >
                <FaTimes />
              </button>
            </div>

            <div className="employeeDetailsBody">
              <div className="employeeDetailsField">
                <span>Full Name</span>
                <strong>
                  {getEmployeeValue(employeeDetails, ["name", "fullName"]) !==
                  "Not available"
                    ? getEmployeeValue(employeeDetails, ["name", "fullName"])
                    : [employeeDetails.firstName, employeeDetails.lastName]
                        .filter(Boolean)
                        .join(" ") || "Not available"}
                </strong>
              </div>

              <div className="employeeDetailsField">
                <span>User ID</span>
                <strong className="employeeDetailsUserId">
                  {getEmployeeValue(employeeDetails, ["_id"])}
                </strong>
              </div>

              <div className="employeeDetailsField">
                <span>Role</span>
                <strong>{getEmployeeValue(employeeDetails, ["role"])}</strong>
              </div>

              <div className="employeeDetailsField">
                <span>Department</span>
                <strong>
                  {getEmployeeValue(employeeDetails, ["department"])}
                </strong>
              </div>

              <div className="employeeDetailsField">
                <span>Designation</span>
                <strong>
                  {getEmployeeValue(employeeDetails, ["designation"])}
                </strong>
              </div>
            </div>

            <div className="employeeDetailsFooter">
              <button
                type="button"
                className="employeeDetailsDoneBtn"
                onClick={closeEmployeeDetails}
              >
                Close
              </button>
            </div>
          </section>
        </div>
      )}
    </>
  );
}

EventFormModal.displayName = "EventFormModal";

export default memo(EventFormModal);

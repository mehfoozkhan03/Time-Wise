import "./DeleteModal.css";

import { memo, useEffect, useRef, useCallback } from "react";

import { FaTrash, FaTimes, FaExclamationTriangle } from "react-icons/fa";

function DeleteModal({
  title = "Delete Item",
  message = "Are you sure you want to delete this item?",
  deleteLabel = "Delete",
  isDeleting = false,
  onConfirm,
  onCancel,
}) {
  const closeButtonRef = useRef(null);

  useEffect(() => {
    closeButtonRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === "Escape" && !isDeleting) {
        onCancel?.();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onCancel, isDeleting]);

  const handleClose = useCallback(() => {
    if (isDeleting) {
      return;
    }

    onCancel?.();
  }, [isDeleting, onCancel]);

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

  const handleConfirm = useCallback(() => {
    if (!isDeleting) {
      onConfirm?.();
    }
  }, [isDeleting, onConfirm]);

  return (
    <div
      className="deleteOverlay"
      onClick={handleOverlayClick}
      role="presentation"
    >
      <div
        className="deleteModal"
        onClick={handleModalClick}
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-title"
      >
        <div className="deleteHeader">
          <div className="deleteIcon">
            <FaExclamationTriangle />
          </div>

          <button
            ref={closeButtonRef}
            type="button"
            className="closeBtn"
            onClick={handleClose}
            disabled={isDeleting}
            aria-label="Close Delete Dialog"
          >
            <FaTimes />
          </button>
        </div>

        <div className="deleteBody">
          <h2 id="delete-title">{title}</h2>

          <p>{message}</p>
        </div>

        <div className="deleteFooter">
          <button
            type="button"
            className="cancelBtn"
            onClick={handleClose}
            disabled={isDeleting}
          >
            Cancel
          </button>

          <button
            type="button"
            className="deleteBtn"
            onClick={handleConfirm}
            disabled={isDeleting}
          >
            <FaTrash />
            {isDeleting ? "Deleting..." : deleteLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

DeleteModal.displayName = "DeleteModal";

export default memo(DeleteModal);
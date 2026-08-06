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

  const handleOverlayClick = useCallback(
    (event) => {
      if (isDeleting) {
        return;
      }

      if (event.target === event.currentTarget) {
        onCancel?.();
      }
    },
    [isDeleting, onCancel],
  );

  const handleModalClick = useCallback((event) => {
    event.stopPropagation();
  }, []);

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
            onClick={onCancel}
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
            onClick={onCancel}
            disabled={isDeleting}
          >
            Cancel
          </button>

          <button
            type="button"
            className="deleteBtn"
            onClick={onConfirm}
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
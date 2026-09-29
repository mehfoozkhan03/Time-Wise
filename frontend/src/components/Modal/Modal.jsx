import React from "react";
import { Feedback } from "../../pages/FeedBack";

const FeedbackModalController = ({ onReady }) => {
  const [modal, setModal] = React.useState({
    open: false,
    variant: "",
    title: "",
    message: "",
    description: "",
    reason: "",
    onCloseCb: null,
  });
  const modalRef = React.useRef(modal);
  modalRef.current = modal;

  const showModal = React.useCallback(
    ({
      variant,
      title,
      message,
      description = "",
      reason = "",
      onCloseCb = null,
    }) => {
      setModal({
        open: true,
        variant,
        title,
        message,
        description,
        reason,
        onCloseCb,
      });
    },
    [],
  );

  const closeModal = React.useCallback(() => {
    const onCloseCb = modalRef.current.onCloseCb;
    setModal({
      open: false,
      variant: "",
      title: "",
      message: "",
      description: "",
      reason: "",
      onCloseCb: null,
    });
    onCloseCb?.();
  }, []);

  const closeModalRef = React.useRef(closeModal);
  closeModalRef.current = closeModal;

  React.useEffect(() => {
    if (!modal.open) return undefined;

    const handleKeyDown = (event) => {
      if (event.key !== "Enter") return;
      event.preventDefault();
      event.stopPropagation();
      closeModalRef.current();
    };

    window.addEventListener("keydown", handleKeyDown, true);
    return () => window.removeEventListener("keydown", handleKeyDown, true);
  }, [modal.open]);

  React.useEffect(() => {
    onReady?.(showModal);
  }, [onReady, showModal]);

  return (
    <Feedback
      isOpen={modal.open}
      variant={modal.variant}
      title={modal.title}
      message={modal.message}
      reason={modal.reason}
      description={modal.description}
      onClose={closeModal}
    />
  );
};

export const Modal = ({
  onReady,
  isOpen,
  variant = "success",
  title,
  message,
  description,
  reason,
  onClose,
  onConfirm,
  confirmText,
  cancelText,
  showActions,
  overlayClassName = "feedback_overlay",
  className = "feedback_modal",
  onOverlayClick,
  onContentClick,
  onOverlayMouseDown,
  onContentMouseDown,
  role = "dialog",
  ariaModal = true,
  ariaLabelledBy,
  ariaDescribedBy,
  tabIndex,
  children,
}) => {
  if (onReady) {
    return <FeedbackModalController onReady={onReady} />;
  }

  if (children !== undefined) {
    if (!isOpen) return null;
    return (
      <div
        className={overlayClassName}
        onClick={onOverlayClick}
        onMouseDown={onOverlayMouseDown}
        role="presentation"
      >
        <div
          className={className}
          onClick={onContentClick}
          onMouseDown={onContentMouseDown}
          role={role}
          aria-modal={ariaModal}
          aria-labelledby={ariaLabelledBy}
          aria-describedby={ariaDescribedBy}
          tabIndex={tabIndex}
        >
          {children}
        </div>
      </div>
    );
  }

  return (
    <Feedback
      isOpen={isOpen}
      variant={variant}
      title={title}
      message={message}
      reason={reason}
      description={description}
      onClose={onClose}
      onConfirm={onConfirm}
      confirmText={confirmText}
      cancelText={cancelText}
      showActions={showActions}
    />
  );
};

// Every system has its weakness. This bug's weakness is that it fails under specific edge cases, and I'm going to find them.
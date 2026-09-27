import React from "react";
import { Feedback } from "../../pages/FeedBack";

export const Modal = ({ onReady }) => {
  const [modal, setModal] = React.useState({
    open: false,
    variant: "",
    title: "",
    message: "",
    description: "",
    reason: "",
    onCloseCb: null,
  });

  // ==========================================
  // SHOW MODAL
  // ==========================================

  const showModal = ({
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
  };

  // ==========================================
  // CLOSE MODAL
  // ==========================================

  const closeModal = () => {
    const cb = modal.onCloseCb;

    setModal({
      open: false,
      variant: "",
      title: "",
      message: "",
      description: "",
      reason: "",
      onCloseCb: null,
    });

    if (cb) {
      cb();
    }
  };

  const closeModalRef = React.useRef(closeModal);
  closeModalRef.current = closeModal;

  React.useEffect(() => {
    if (!modal.open) return;

    const handleKeyDown = (event) => {
      if (event.key !== "Enter") return;

      event.preventDefault();
      event.stopPropagation();
      closeModalRef.current();
    };

    window.addEventListener("keydown", handleKeyDown, true);
    return () => window.removeEventListener("keydown", handleKeyDown, true);
  }, [modal.open]);

  // ==========================================
  // GIVE showModal TO PARENT
  // ==========================================

  React.useEffect(() => {
    if (onReady) {
      onReady(showModal);
    }
  }, [onReady]);

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

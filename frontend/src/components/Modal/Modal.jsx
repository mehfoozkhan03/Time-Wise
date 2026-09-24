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
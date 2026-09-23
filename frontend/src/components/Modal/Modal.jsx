import React from 'react';

export const modal = () => {
  // Modal state
  const [modal, setModal] = useState({
    open: false,
    variant: '',
    title: '',
    message: '',
    description: '',
    reason: '',
    onCloseCb: null,
  });

  const showModal = ({
    variant,
    title,
    message,
    description = '',
    reason = '',
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

  const closeModal = () => {
    const cb = modal.onCloseCb;

    setModal({
      open: false,
      variant: '',
      title: '',
      description: '',
      message: '',
      reason: '',
      onCloseCb: null,
    });

    if (cb) {
      cb();
    }
  };

  return <div>modal</div>;
};

import React from 'react';
import { CloseButton, Modal } from 'react-bootstrap';
import RegistrationForm from 'components/authentication/RegistrationForm';
import { useAppContext } from 'Main';

export default function Example() {
  const {
    config: { openAuthModal },
    setConfig
  } = useAppContext();

  const handleClose = () => {
    setConfig('openAuthModal', false);
  };

  return (
    <Modal show={openAuthModal} onHide={handleClose} className="mt-4">
      <Modal.Header className="bg-shape modal-shape-header px-4 position-relative">
        <div className="position-relative z-1" data-bs-theme="light">
          <h4 className="mb-0 text-white" id="authentication-modal-label">
            Register
          </h4>
          <p className="fs--1 mb-0 text-white">
            Please create your free Falcon account
          </p>
        </div>
        <CloseButton
          variant="white"
          className="position-absolute end-0 me-2 mt-2 top-0"
          onClick={handleClose}
        />
      </Modal.Header>
      <Modal.Body className="p-4">
        <RegistrationForm layout="split" hasLabel />
      </Modal.Body>
    </Modal>
  );
}

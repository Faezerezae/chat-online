import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, Modal, Nav, Dropdown } from 'react-bootstrap';
import Login from 'components/authentication/simple/Login';
import Registration from 'components/authentication/simple/Registration';
import ThemeControlDropdown from 'components/navbar/top/ThemeControlDropdown';

const LandingRightSideNavItem = () => {
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);

  return (
    <Nav navbar className="ms-auto align-items-lg-center">
      <Nav.Item as={'li'} className="me-2 d-none d-lg-block">
        <ThemeControlDropdown iconClassName="fs--1" />
      </Nav.Item>

      <Dropdown>
        <Dropdown.Toggle as={Link} to="#!" className="nav-link fw-semi-bold">
          Login
        </Dropdown.Toggle>
        <Dropdown.Menu className="dropdown-menu-end dropdown-menu-card mt-0 dropdown-caret dropdown-caret-bg">
          <Card className="navbar-card-login shadow-none">
            <Card.Body className="fs--1 fw-normal p-4">
              <Login />
            </Card.Body>
          </Card>
        </Dropdown.Menu>
      </Dropdown>

      <Nav.Item>
        <Nav.Link
          as={Link}
          to="#!"
          onClick={() => setShowRegistrationModal(!showRegistrationModal)}
        >
          Register
        </Nav.Link>
        <Modal
          show={showRegistrationModal}
          centered
          onHide={() => setShowRegistrationModal(false)}
        >
          <Modal.Body className="p-0">
            <Card>
              <Card.Body className="fs--1 fw-normal p-4">
                <Registration />
              </Card.Body>
            </Card>
          </Modal.Body>
        </Modal>
      </Nav.Item>
    </Nav>
  );
};

export default LandingRightSideNavItem;

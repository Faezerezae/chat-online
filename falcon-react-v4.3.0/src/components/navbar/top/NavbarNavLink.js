import React from 'react';
import PropTypes from 'prop-types';
import { Nav } from 'react-bootstrap';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import { useAppContext } from 'Main';

const NavbarNavLink = ({ title, route }) => {
    const {
        config: { navbarCollapsed, showBurgerMenu },
        setConfig
    } = useAppContext();

    const handleClick = () => {
        if (route.name === 'Modal') {
            setConfig('openAuthModal', true);
        }
        if (navbarCollapsed) {
            setConfig('navbarCollapsed', !navbarCollapsed);
        }
        if (showBurgerMenu) {
            setConfig('showBurgerMenu', !showBurgerMenu);
        }
    };
    return (
        <Nav.Link
            as={title ? 'p' : Link}
            className={classNames('fw-medium', {
                'text-500': !route?.active,
                'text-700 mb-0 fw-bold': title,
                'py-1': !title,
                'link-600': !title && route?.active
            })}
            to={route?.to}
            onClick={handleClick}
        >
            {title ? title : route.name}
        </Nav.Link>
    );
};

NavbarNavLink.propTypes = {
    title: PropTypes.string,
    route: PropTypes.shape({
        name: PropTypes.string.isRequired,
        to: PropTypes.string.isRequired,
        active: PropTypes.bool
    })
};

export default NavbarNavLink;

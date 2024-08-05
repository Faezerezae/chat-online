import React, { useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Nav, Navbar, Row, Col } from 'react-bootstrap';
import { navbarBreakPoint, topNavbarBreakpoint } from 'config';
import Flex from 'components/common/Flex';
import Logo from 'components/common/Logo';
import NavbarVerticalMenu from './NavbarVerticalMenu';
import ToggleButton from './ToggleButton';
import { navigationSettingChatData } from '../navigationSettingChatData';

import NavbarTopDropDownMenus from 'components/navbar/top/NavbarTopDropDownMenus';
import bgNavbar from 'assets/img/generic/bg-navbar.png';
import { useAppContext } from 'Main';

const NavbarVertical = () => {
    const {
        config: {
            navbarPosition,
            navbarStyle,
            isNavbarVerticalCollapsed,
            showBurgerMenu
        }
    } = useAppContext();

    const HTMLClassList = document.getElementsByTagName('html')[0].classList;

    useEffect(() => {
        if (isNavbarVerticalCollapsed) {
            HTMLClassList.add('navbar-vertical-collapsed');
        } else {
            HTMLClassList.remove('navbar-vertical-collapsed');
        }
        return () => {
            HTMLClassList.remove('navbar-vertical-collapsed-hover');
        };
    }, [isNavbarVerticalCollapsed, HTMLClassList]);

    //Control mouseEnter event
    let time = null;
    const handleMouseEnter = () => {
        if (isNavbarVerticalCollapsed) {
            time = setTimeout(() => {
                HTMLClassList.add('navbar-vertical-collapsed-hover');
            }, 100);
        }
    };
    const handleMouseLeave = () => {
        clearTimeout(time);
        HTMLClassList.remove('navbar-vertical-collapsed-hover');
    };

    const NavbarLabel = ({ label }) => (
        <Nav.Item as="li">
            <Row className="mt-3 mb-2 navbar-vertical-label-wrapper">
                <Col
                    xs="auto"
                    className="navbar-vertical-label navbar-vertical-label"
                >
                    {label}
                </Col>
                <Col className="ps-0">
                    <hr className="mb-0 navbar-vertical-divider"></hr>
                </Col>
            </Row>
        </Nav.Item>
    );

    return (
        <Navbar
            expand={navbarBreakPoint}
            className={classNames('navbar-vertical', {
                [`navbar-${navbarStyle}`]: navbarStyle !== 'transparent'
            })}
            variant="light"
        >
            <Flex alignItems="center">
                <ToggleButton />
                <Logo
                    at="navbar-vertical"
                    textClass="text-primary"
                    width={40}
                />
            </Flex>
            <Navbar.Collapse
                in={showBurgerMenu}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                style={{
                    backgroundImage:
                        navbarStyle === 'vibrant'
                            ? `linear-gradient(-45deg, rgba(0, 160, 255, 0.86), #0048a2),url(${bgNavbar})`
                            : 'none'
                }}
            >
                <div className="navbar-vertical-content scrollbar">
                    <Nav className="flex-column" as="ul">
                        {navigationSettingChatData?.children?.map(route => (
                            <Fragment key={route.name}>
                                <NavbarLabel label={route.name} />
                                <NavbarVerticalMenu routes={route.children} />
                            </Fragment>
                        ))}
                    </Nav>

                    <>
                        {navbarPosition === 'combo' && (
                            <div className={`d-${topNavbarBreakpoint}-none`}>
                                <div className="navbar-vertical-divider">
                                    <hr className="navbar-vertical-hr my-2" />
                                </div>
                                <Nav navbar>
                                    <NavbarTopDropDownMenus />
                                </Nav>
                            </div>
                        )}
                    </>
                </div>
            </Navbar.Collapse>
        </Navbar>
    );
};

NavbarVertical.propTypes = {
    label: PropTypes.string
};

export default NavbarVertical;

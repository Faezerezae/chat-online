import React from 'react';
import PropTypes from 'prop-types';
import { Dropdown } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { themeVariants } from 'config';
import { useAppContext } from 'Main';

const ThemeControlDropdown = ({
  dropdownClassName,
  iconClassName = 'fs-1'
}) => {
  const {
    config: { theme },
    changeTheme
  } = useAppContext();

  return (
    <Dropdown
      navbar={true}
      as="div"
      onSelect={colorMode => changeTheme(colorMode)}
      className={`theme-control-dropdown ${
        dropdownClassName ? dropdownClassName : ''
      }`}
    >
      <Dropdown.Toggle
        bsPrefix="toggle"
        variant="link"
        className="nav-link dropdown-toggle d-flex align-items-center pe-1"
      >
        <FontAwesomeIcon
          icon={
            theme === 'light' ? 'sun' : theme === 'dark' ? 'moon' : 'adjust'
          }
          className={iconClassName}
        />
      </Dropdown.Toggle>

      <Dropdown.Menu className="dropdown-caret dropdown-menu-card dropdown-menu-end mt-2">
        <div className="bg-white rounded-2 py-2 dark__bg-1000">
          {themeVariants.map(colorMode => (
            <Dropdown.Item
              key={colorMode}
              active={theme === colorMode}
              eventKey={colorMode}
              className="link-600 fs--1 d-flex align-items-center gap-2"
            >
              <FontAwesomeIcon
                icon={
                  colorMode === 'light'
                    ? 'sun'
                    : colorMode === 'dark'
                    ? 'moon'
                    : 'adjust'
                }
              />
              {colorMode.charAt(0).toUpperCase() + colorMode.slice(1)}
              {theme === colorMode && (
                <FontAwesomeIcon icon="check" className="ms-auto text-600" />
              )}
            </Dropdown.Item>
          ))}
        </div>
      </Dropdown.Menu>
    </Dropdown>
  );
};

ThemeControlDropdown.propTypes = {
  iconClassName: PropTypes.string,
  dropdownClassName: PropTypes.string
};

export default ThemeControlDropdown;

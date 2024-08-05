import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const SubtleBadge = ({ bg = 'primary', pill, children, className }) => {
  return (
    <div
      className={classNames(className, `badge badge-subtle-${bg}`, {
        'rounded-pill': pill
      })}
    >
      {children}
    </div>
  );
};

SubtleBadge.propTypes = {
  bg: PropTypes.oneOf([
    'primary',
    'secondary',
    'success',
    'info',
    'warning',
    'danger',
    'light',
    'dark'
  ]),
  pill: PropTypes.bool,
  children: PropTypes.node,
  className: PropTypes.string
};

export default SubtleBadge;

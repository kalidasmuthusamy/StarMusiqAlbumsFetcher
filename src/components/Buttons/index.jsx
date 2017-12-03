import React, { Component } from 'react';
import PropTypes from 'prop-types';

const Button = ({
  onClick,
  className,
  disabled,
  value,
  buttonRef,
  ...restProps,
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`btn ${className}`}
    disabled={disabled}
    ref={(el) => buttonRef(el)}
  >
    {value}
  </button>
);

Button.propTypes = {
  value: PropTypes.string,
  onClick: PropTypes.func,
  className: PropTypes.string,
  buttonRef: PropTypes.func,
};

Button.defaultProps = {
  value: '',
  onClick: () => { },
  className: 'btn',
  buttonRef: () => { },
};

export default Button;

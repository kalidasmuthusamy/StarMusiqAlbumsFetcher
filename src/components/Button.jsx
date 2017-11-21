import React, { Component } from 'react';
import PropTypes from 'prop-types';

const Button = ({
  onClick,
  className,
  disabled,
  value,
  ...restProps,
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`btn ${className}`}
    disabled={disabled}
  >
    {value}
  </button>
);

Button.defaultProps = {
  value: '',
  onClick: PropTypes.func,
  className: 'btn'
};


Button.propTypes = {
  value: PropTypes.string,
  onClick: PropTypes.func,
  className: PropTypes.string,
};

export default Button;

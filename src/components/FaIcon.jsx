import React from 'react';
import PropTypes from 'prop-types';

const FaIcon = ({ className }) => (
  <i
    className={`fa ${className} fa-element`}
    aria-hidden='true'
  />
);

FaIcon.propTypes = {
  className: PropTypes.string.isRequired,
};

export default FaIcon;
